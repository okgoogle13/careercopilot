const ROOT_W = 1440;
const ROOT_H = 1024;

const SIDEBAR_W = 256;
const RIGHT_W = 360;
const TOPBAR_H = 72;

const PAGE_PADDING = 24;
const SECTION_GAP = 24;

function isFrameLike(node) {
  return node && (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE');
}

function isPageFrameName(name) {
  return /(Page|dashboard|opportunities|applications|documents|analysis|generation|apply|profile|settings)/i.test(
    name || ''
  );
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
    primaryAxisSizingMode = 'FIXED',
    counterAxisSizingMode = 'FIXED',
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

function ensureFrameChild(parent, name) {
  let child = parent.children.find((n) => n.name === name && isFrameLike(n));
  if (child && child.type === 'INSTANCE') {
    child = child.detachInstance();
    child.name = name;
  }
  if (!child) {
    child = figma.createFrame();
    child.name = name;
    parent.appendChild(child);
  }
  return child;
}

function setFillChild(node, axis = 'both') {
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

function setFixedSize(node, w, h) {
  const width = typeof w === 'number' ? w : node.width;
  const height = typeof h === 'number' ? h : node.height;
  node.resize(width, height);
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

function normalizeDesktopAppPage(pageFrame) {
  if (!isFrameLike(pageFrame)) return;

  if (pageFrame.type === 'INSTANCE') {
    pageFrame = pageFrame.detachInstance();
  }

  pageFrame.resize(ROOT_W, ROOT_H);

  makeAutoLayout(pageFrame, {
    mode: 'VERTICAL',
    itemSpacing: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });

  const originalChildren = [...pageFrame.children];

  let appShell = pageFrame.children.find((n) => n.name === 'AppShell' && isFrameLike(n));
  if (appShell && appShell.type === 'INSTANCE') {
    appShell = appShell.detachInstance();
    appShell.name = 'AppShell';
  }

  if (!appShell) {
    appShell = figma.createFrame();
    appShell.name = 'AppShell';
    pageFrame.appendChild(appShell);
  }

  preserveVisualStyle(pageFrame, appShell);

  makeAutoLayout(appShell, {
    mode: 'HORIZONTAL',
    itemSpacing: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  appShell.resize(ROOT_W, ROOT_H);
  setFillChild(appShell, 'both');

  const sidebar = ensureFrameChild(appShell, 'Sidebar');
  makeAutoLayout(sidebar, {
    mode: 'VERTICAL',
    itemSpacing: 16,
    paddingTop: 24,
    paddingRight: 16,
    paddingBottom: 24,
    paddingLeft: 16,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFixedSize(sidebar, SIDEBAR_W, ROOT_H);

  const mainColumn = ensureFrameChild(appShell, 'MainColumn');
  makeAutoLayout(mainColumn, {
    mode: 'VERTICAL',
    itemSpacing: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFillChild(mainColumn, 'both');
  try {
    mainColumn.minWidth = 0;
  } catch (e) {}

  const rightPanel = ensureFrameChild(appShell, 'RightPanel');
  makeAutoLayout(rightPanel, {
    mode: 'VERTICAL',
    itemSpacing: 16,
    paddingTop: 24,
    paddingRight: 16,
    paddingBottom: 24,
    paddingLeft: 16,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFixedSize(rightPanel, RIGHT_W, ROOT_H);

  const topNavbar = ensureFrameChild(mainColumn, 'TopNavbar');
  makeAutoLayout(topNavbar, {
    mode: 'HORIZONTAL',
    itemSpacing: 16,
    paddingTop: 16,
    paddingRight: 24,
    paddingBottom: 16,
    paddingLeft: 24,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    primaryAxisAlignItems: 'SPACE_BETWEEN',
    counterAxisAlignItems: 'CENTER',
    clipsContent: true,
  });
  setFixedSize(topNavbar, Math.max(400, ROOT_W - SIDEBAR_W - RIGHT_W), TOPBAR_H);
  setFillChild(topNavbar, 'horizontal');

  const pageContent = ensureFrameChild(mainColumn, 'PageContent');
  makeAutoLayout(pageContent, {
    mode: 'VERTICAL',
    itemSpacing: SECTION_GAP,
    paddingTop: PAGE_PADDING,
    paddingRight: PAGE_PADDING,
    paddingBottom: PAGE_PADDING,
    paddingLeft: PAGE_PADDING,
    primaryAxisSizingMode: 'FIXED',
    counterAxisSizingMode: 'FIXED',
    clipsContent: true,
  });
  setFillChild(pageContent, 'both');

  const shellNames = [
    'AppShell',
    'Sidebar',
    'MainColumn',
    'TopNavbar',
    'PageContent',
    'RightPanel',
  ];

  for (const child of originalChildren) {
    if (child.id === appShell.id) continue;
    if (shellNames.includes(child.name)) continue;
    try {
      pageContent.appendChild(child);
    } catch (e) {}
  }

  const namedCandidates = [...pageContent.children];
  for (const child of namedCandidates) {
    const n = (child.name || '').toLowerCase();
    try {
      if (n.includes('sidebar') || n.includes('nav')) {
        sidebar.appendChild(child);
      } else if (
        n.includes('panel') ||
        n.includes('preview') ||
        n.includes('details') ||
        n.includes('activity')
      ) {
        rightPanel.appendChild(child);
      }
    } catch (e) {}
  }

  pageFrame.expanded = true;
  appShell.expanded = true;
  mainColumn.expanded = true;
}

function main() {
  const selection = figma.currentPage.selection;

  if (!selection.length) {
    figma.notify('Select one or more top-level app page frames first.');
    figma.closePlugin();
    return;
  }

  const targets = selection.filter((node) => isFrameLike(node) && isPageFrameName(node.name));

  if (!targets.length) {
    figma.notify('No suitable app page frames found in selection.');
    figma.closePlugin();
    return;
  }

  for (const node of targets) {
    normalizeDesktopAppPage(node);
  }

  figma.currentPage.selection = targets;
  figma.viewport.scrollAndZoomIntoView(targets);

  figma.notify(`Standardized ${targets.length} page(s) to desktop app shell.`);
  figma.closePlugin();
}

main();
