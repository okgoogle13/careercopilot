/**
 * figmascript-dashboard-mainboard.js
 *
 * Purpose:
 * Create or normalize only the dashboard middle section destination in Figma.
 * Use this when the full dashboard file is messy and you only want a stable
 * main content area for the donor "Top Matches" section.
 *
 * Resulting structure:
 * - MainBoard
 *   - MainSection / TopMatches
 *   - MainSection / CTA
 *
 * Usage in Scripter:
 * 1. Select a single frame to turn into MainBoard, or select nothing to create one.
 * 2. Run the script.
 * 3. Paste or rebuild the donor middle section into:
 *    - MainSection / TopMatches
 *    - MainSection / CTA
 */

const MAINBOARD_W = 1020;
const MAINBOARD_H = 560;
const PADDING = 24;
const GAP = 24;

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
    frame.name = node.name || 'MainBoard';
    frame.resize(Math.max(100, node.width), Math.max(100, node.height));
    frame.x = node.x;
    frame.y = node.y;
    node.parent.appendChild(frame);
    for (const child of [...node.children]) {
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
    if (axis === 'horizontal' || axis === 'both') node.layoutSizingHorizontal = 'FILL';
  } catch (e) {}
  try {
    if (axis === 'vertical' || axis === 'both') node.layoutSizingVertical = 'FILL';
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
  // DISABLED: Returning 0 immediately to prevent accidental deletion of critical layout blocks.
  return 0;
}

function flagSingleChildWrappers(frame) {
  let flagged = 0;
  const walk = (node) => {
    if (!node || !('children' in node)) return;
    for (const child of node.children) walk(child);
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

function normalizeSalvagedLayers(root) {
  const mapping = {
    'Operational Status': 'HeaderBlock',
    'Stats Container': 'MetricsRow',
    'Main Content Area': 'MainBoard',
    'Discovery Radar': 'RightRail',
    Charts: 'RightRail',
    Body: 'DashboardContent',
  };

  const toDelete = ['Dashboard', 'Layout', 'Ghost', 'Stale'];
  let fixedCount = 0;

  const walk = (node) => {
    if (!node || !('children' in node)) return;

    for (const child of [...node.children]) {
      // 1. Rename based on salvage mapping
      for (const [oldName, newName] of Object.entries(mapping)) {
        if (child.name.includes(oldName)) {
          child.name = newName;
          fixedCount++;
        }
      }

      // 2. Delete known stale artifacts
      if (toDelete.some((stale) => child.name === stale)) {
        try {
          child.remove();
        } catch (e) {}
      } else {
        walk(child);
      }
    }
  };

  walk(root);
  return fixedCount;
}

function autoWrapLooseLayers(root) {
  const looseChildren = [];
  let sidebarNode = null;

  // 1. Identify what is loose and separate the Sidebar
  for (const child of root.children) {
    if (child.name.toLowerCase().includes('sidebar')) {
      sidebarNode = child;
    } else {
      looseChildren.push(child);
    }
  }

  // If there are less than 2 loose items, don't wrap (already clean)
  if (looseChildren.length < 2) return 0;

  // 2. Create the DashboardContent wrapper
  const dashboardContent = figma.createFrame();
  dashboardContent.name = 'DashboardContent';

  // Set to Vertical Auto Layout to stack the loose pieces
  dashboardContent.layoutMode = 'VERTICAL';
  dashboardContent.itemSpacing = 24;
  dashboardContent.layoutSizingHorizontal = 'FILL';
  dashboardContent.layoutSizingVertical = 'HUG';

  root.appendChild(dashboardContent);

  // 3. Move all loose pieces into the new wrapper
  for (const child of looseChildren) {
    try {
      dashboardContent.appendChild(child);
      // Make sure the internal pieces stretch to fit
      if (child.layoutSizingHorizontal !== undefined) {
        child.layoutSizingHorizontal = 'FILL';
      }
    } catch (e) {}
  }

  // Ensure Sidebar stays on the left (make root horizontal)
  root.layoutMode = 'HORIZONTAL';
  root.itemSpacing = 32;

  return looseChildren.length;
}

function createOrPrepareMainBoard() {
  const selection = figma.currentPage.selection.filter(isFrameLike);
  let root = selection.length === 1 ? ensureEditableFrame(selection[0]) : null;

  if (root) {
    const wrappedCount = autoWrapLooseLayers(root);
    const salvagedFixes = normalizeSalvagedLayers(root);

    if (wrappedCount > 0 || salvagedFixes > 0) {
      figma.notify(
        `Grouped ${wrappedCount} loose layers into DashboardContent. Salvaged ${salvagedFixes} names.`
      );
    }
  }

  const createdFresh = !root;

  if (!root) {
    root = figma.createFrame();
    root.name = 'MainBoard';
    root.resize(MAINBOARD_W, MAINBOARD_H);
    figma.currentPage.appendChild(root);
    root.x = figma.viewport.center.x - MAINBOARD_W / 2;
    root.y = figma.viewport.center.y - MAINBOARD_H / 2;
  }

  const looseChildren = [...root.children];

  root.name = 'MainBoard';
  root.resize(MAINBOARD_W, MAINBOARD_H);
  makeAutoLayout(root, {
    mode: 'VERTICAL',
    itemSpacing: GAP,
    paddingTop: PADDING,
    paddingRight: PADDING,
    paddingBottom: PADDING,
    paddingLeft: PADDING,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });

  const topMatches = ensureChildFrame(root, 'MainSection / TopMatches');
  makeAutoLayout(topMatches, {
    mode: 'VERTICAL',
    itemSpacing: 16,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFixed(topMatches, MAINBOARD_W - PADDING * 2, 392);
  setFill(topMatches, 'horizontal');

  const cta = ensureChildFrame(root, 'MainSection / CTA');
  makeAutoLayout(cta, {
    mode: 'VERTICAL',
    itemSpacing: 12,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: false,
  });
  setFixed(cta, MAINBOARD_W - PADDING * 2, 96);
  setFill(cta, 'horizontal');

  const scaffoldNames = ['MainSection / TopMatches', 'MainSection / CTA'];
  for (const child of looseChildren) {
    if (!child || child.parent !== root) continue;
    if (scaffoldNames.includes(child.name)) continue;
    try {
      topMatches.appendChild(child);
    } catch (e) {}
  }

  const removed =
    stripEmptyChildren(root) + stripEmptyChildren(topMatches) + stripEmptyChildren(cta);
  const wrappers = flagSingleChildWrappers(root);

  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);

  return { createdFresh, removed, wrappers };
}

try {
  const result = createOrPrepareMainBoard();
  figma.notify(
    `MainBoard ready: ${result.createdFresh ? 'created fresh' : 'normalized selection'}, removed ${result.removed} empty nodes, flagged ${result.wrappers} wrappers.`
  );
} catch (error) {
  figma.notify(`MainBoard prep failed: ${error && error.message ? error.message : error}`);
  throw error;
}
