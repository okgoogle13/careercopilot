/**
 * figmascript-dashboard-clean.js
 *
 * Purpose:
 * Prepare a no-panel dashboard destination frame in Figma before pasting in
 * content from a Figma Make donor. This script is intentionally selection-scoped
 * and avoids imposing sidebar/right-rail shell structure.
 *
 * Usage in Scripter:
 * 1. Select a single dashboard frame, or select nothing to create a fresh one.
 * 2. Run the script.
 * 3. Paste donor sections into the generated / normalized frame:
 *    HeaderBlock, MetricsRow, MainBoard, RightRail.
 *
 * Safety:
 * - Does not archive or delete top-level pages.
 * - Only removes obviously empty children inside the selected frame.
 * - Only renames wrapper frames when they are structurally suspicious.
 */

const ROOT_W = 1440;
const ROOT_H = 1024;
const PAGE_PADDING = 30;
const CONTENT_GAP = 24;
const RIGHT_RAIL_W = 340;

function isFrameLike(node) {
  return (
    node &&
    (node.type === 'FRAME' ||
      node.type === 'COMPONENT' ||
      node.type === 'INSTANCE' ||
      node.type === 'GROUP')
  );
}

function ensureEditableFrame(node) {
  if (!node) return null;
  if (node.type === 'INSTANCE') {
    const detached = node.detachInstance();
    detached.name = node.name;
    return detached;
  }
  if (node.type === 'GROUP') {
    const frame = figma.createFrame();
    frame.name = node.name || 'ConvertedFrame';
    frame.resize(Math.max(100, node.width), Math.max(100, node.height));
    frame.x = node.x;
    frame.y = node.y;
    node.parent.appendChild(frame);
    const children = [...node.children];
    for (const child of children) {
      try {
        frame.appendChild(child);
      } catch (e) {}
    }
    try {
      node.remove();
    } catch (e) {}
    return frame;
  }
  return node;
}

function makeAutoLayout(
  frame,
  {
    mode = 'VERTICAL',
    itemSpacing = 0,
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    primaryAxisSizingMode = 'AUTO',
    counterAxisSizingMode = 'AUTO',
    primaryAxisAlignItems = 'MIN',
    counterAxisAlignItems = 'MIN',
    clipsContent = true,
  } = {}
) {
  frame.layoutMode = mode;
  frame.itemSpacing = itemSpacing;
  frame.paddingTop = paddingTop;
  frame.paddingRight = paddingRight;
  frame.paddingBottom = paddingBottom;
  frame.paddingLeft = paddingLeft;
  frame.primaryAxisSizingMode = primaryAxisSizingMode;
  frame.counterAxisSizingMode = counterAxisSizingMode;
  frame.primaryAxisAlignItems = primaryAxisAlignItems;
  frame.counterAxisAlignItems = counterAxisAlignItems;
  frame.clipsContent = clipsContent;
}

function setFill(node, axis = 'both') {
  try {
    if (axis === 'horizontal' || axis === 'both') {
      node.layoutSizingHorizontal = 'FILL';
    }
  } catch (e) {}
  try {
    if (axis === 'vertical' || axis === 'both') {
      node.layoutSizingVertical = 'FILL';
    }
  } catch (e) {}
  try {
    node.layoutAlign = 'STRETCH';
  } catch (e) {}
}

function setFixed(node, width, height) {
  try {
    node.resize(width, height);
  } catch (e) {}
}

function preserveVisualStyle(fromNode, toNode) {
  try {
    toNode.fills = JSON.parse(JSON.stringify(fromNode.fills));
  } catch (e) {}
  try {
    toNode.strokes = JSON.parse(JSON.stringify(fromNode.strokes));
  } catch (e) {}
  try {
    toNode.strokeWeight = fromNode.strokeWeight;
  } catch (e) {}
  try {
    toNode.cornerRadius = fromNode.cornerRadius;
  } catch (e) {}
  try {
    toNode.effects = JSON.parse(JSON.stringify(fromNode.effects));
  } catch (e) {}
  try {
    toNode.opacity = fromNode.opacity;
  } catch (e) {}
}

function ensureChildFrame(parent, name) {
  let child = parent.children.find((n) => n.name === name && isFrameLike(n));
  if (child) {
    child = ensureEditableFrame(child);
    child.name = name;
    return child;
  }
  child = figma.createFrame();
  child.name = name;
  parent.appendChild(child);
  return child;
}

function isEmptyNode(node) {
  try {
    if ('children' in node && node.children.length > 0) return false;
    const noText = node.type !== 'TEXT';
    const tiny = node.width < 8 || node.height < 8;
    const largeButBlank = node.width >= 80 && node.height >= 80;
    const hasNoFills = !node.fills || node.fills.length === 0;
    return noText && hasNoFills && (tiny || largeButBlank);
  } catch (e) {
    return false;
  }
}

function stripEmptyChildren(frame) {
  let removed = 0;
  for (const child of [...frame.children]) {
    if (isEmptyNode(child)) {
      try {
        child.remove();
        removed++;
      } catch (e) {}
    }
  }
  return removed;
}

function flagSingleChildWrappers(frame) {
  let flagged = 0;
  const walk = (node) => {
    if (!node || !('children' in node)) return;
    for (const child of node.children) {
      walk(child);
    }
    if (
      node.type === 'FRAME' &&
      node.children.length === 1 &&
      node.parent &&
      node.parent.type !== 'PAGE'
    ) {
      const hasOwnVisualStyle =
        (node.fills && node.fills.length) ||
        (node.strokes && node.strokes.length) ||
        (node.effects && node.effects.length);
      if (!hasOwnVisualStyle && !node.name.startsWith('WRAPPER/')) {
        node.name = `WRAPPER/${node.name}`;
        flagged++;
      }
    }
  };
  walk(frame);
  return flagged;
}

function moveNonScaffoldChildren(sourceChildren, dashboardContent, rightRail) {
  const rightRailMatchers = /(warning|alert|signal|intel|intelligence|aside|rail|panel|side)/i;

  for (const child of sourceChildren) {
    if (!child || child.parent !== dashboardContent.parent) continue;
    try {
      if (rightRailMatchers.test(child.name || '')) {
        rightRail.appendChild(child);
      } else {
        dashboardContent.appendChild(child);
      }
    } catch (e) {}
  }
}

function createOrPrepareDashboardFrame() {
  const selection = figma.currentPage.selection.filter(isFrameLike);

  let root = selection.length === 1 ? ensureEditableFrame(selection[0]) : null;
  const createdFresh = !root;

  if (!root) {
    root = figma.createFrame();
    root.name = 'Route / Dashboard';
    root.resize(ROOT_W, ROOT_H);
    figma.currentPage.appendChild(root);
    root.x = figma.viewport.center.x - ROOT_W / 2;
    root.y = figma.viewport.center.y - ROOT_H / 2;
  }

  const originalChildren = [...root.children];
  const oldName = root.name;
  root.name = 'Route / Dashboard';
  root.resize(ROOT_W, ROOT_H);

  makeAutoLayout(root, {
    mode: 'VERTICAL',
    itemSpacing: CONTENT_GAP,
    paddingTop: PAGE_PADDING,
    paddingRight: PAGE_PADDING,
    paddingBottom: PAGE_PADDING,
    paddingLeft: PAGE_PADDING,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });

  if (!createdFresh && oldName !== 'Route / Dashboard') {
    preserveVisualStyle(root, root);
  }

  const header = ensureChildFrame(root, 'HeaderBlock');
  makeAutoLayout(header, {
    mode: 'VERTICAL',
    itemSpacing: 12,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: false,
  });
  setFixed(header, ROOT_W - PAGE_PADDING * 2, 160);
  setFill(header, 'horizontal');

  const metricsRow = ensureChildFrame(root, 'MetricsRow');
  makeAutoLayout(metricsRow, {
    mode: 'HORIZONTAL',
    itemSpacing: 20,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'AUTO',
    clipsContent: false,
  });
  setFixed(metricsRow, ROOT_W - PAGE_PADDING * 2, 220);
  setFill(metricsRow, 'horizontal');

  const content = ensureChildFrame(root, 'DashboardContent');
  makeAutoLayout(content, {
    mode: 'HORIZONTAL',
    itemSpacing: CONTENT_GAP,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFixed(
    content,
    ROOT_W - PAGE_PADDING * 2,
    ROOT_H - PAGE_PADDING * 2 - 160 - 220 - CONTENT_GAP * 2
  );
  setFill(content, 'both');

  const mainBoard = ensureChildFrame(content, 'MainBoard');
  makeAutoLayout(mainBoard, {
    mode: 'VERTICAL',
    itemSpacing: CONTENT_GAP,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFill(mainBoard, 'both');
  try {
    mainBoard.minWidth = 0;
  } catch (e) {}

  const rightRail = ensureChildFrame(content, 'RightRail');
  makeAutoLayout(rightRail, {
    mode: 'VERTICAL',
    itemSpacing: CONTENT_GAP,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFixed(rightRail, RIGHT_RAIL_W, content.height);

  const scaffoldNames = ['HeaderBlock', 'MetricsRow', 'DashboardContent', 'MainBoard', 'RightRail'];
  const looseChildren = originalChildren.filter(
    (child) => child.parent === root && !scaffoldNames.includes(child.name)
  );
  moveNonScaffoldChildren(looseChildren, mainBoard, rightRail);

  const removed =
    stripEmptyChildren(root) + stripEmptyChildren(mainBoard) + stripEmptyChildren(rightRail);
  const wrappers = flagSingleChildWrappers(root);

  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);

  return { root, createdFresh, removed, wrappers };
}

try {
  const result = createOrPrepareDashboardFrame();
  figma.notify(
    `Dashboard prep complete: ${result.createdFresh ? 'created fresh frame' : 'normalized selection'}, removed ${result.removed} empty nodes, flagged ${result.wrappers} wrappers.`
  );
} catch (error) {
  figma.notify(`Dashboard prep failed: ${error && error.message ? error.message : error}`);
  throw error;
}
