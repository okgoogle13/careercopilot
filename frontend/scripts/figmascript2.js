async function ensureArchivePage() {
  let archive = figma.root.children.find((p) => p.type === 'PAGE' && p.name === 'Archive');
  if (!archive) {
    archive = figma.createPage();
    archive.name = 'Archive';
  }
  return archive;
}

function isSceneFrame(node) {
  return (
    node &&
    (node.type === 'FRAME' ||
      node.type === 'COMPONENT' ||
      node.type === 'INSTANCE' ||
      node.type === 'GROUP')
  );
}

function normalizeName(name) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/page$/i, '')
    .replace(/[_\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const canonicalMap = {
  landing: 'landing',
  auth: 'auth',
  login: 'login',
  register: 'register',
  // Runtime route aliases and redirects.
  onboarding: 'onboarding',
  welcome: 'welcome',
  dashboard: 'dashboard',
  'dashboard-overview': 'dashboard',
  'job-queue': 'applications',
  lookout: 'opportunities',
  opportunities: 'opportunities',
  feed: 'feed',
  applications: 'applications',
  tracker: 'applications',
  kanban: 'applications',
  profile: 'profile',
  'career-ingest': 'profile',
  ingestion: 'profile',
  identity: 'identity',
  dossier: 'dossier',
  analysis: 'analysis',
  documents: 'documents',
  docs: 'documents',
  editor: 'documents',
  generation: 'generation',
  'ksc-generator': 'generation',
  'cover-letter-generator': 'generation',
  studio: 'generation',
  apply: 'apply',
  'apply-quick': 'apply',
  'quick-apply': 'apply',
  settings: 'settings',
  'asset-library': 'asset-library',
  'test-tokens': 'test-tokens',
  'style-guide': 'style-guide',
  styleguide: 'style-guide',
  'design-sidekick': 'design-sidekick',
  'animation-test': 'animation-test',
  'dev-map': 'dev-map',
};

function canonicalRoute(name) {
  const n = normalizeName(name);
  return canonicalMap[n] || n;
}

function scoreNode(node) {
  let score = 0;

  try {
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      score += 20;
    }
  } catch (e) {}

  try {
    score += Math.min(node.children ? node.children.length * 5 : 0, 50);
  } catch (e) {}

  try {
    const area = Math.round(node.width * node.height);
    if (area > 500000) score += 25;
    else if (area > 150000) score += 15;
    else if (area > 50000) score += 5;
  } catch (e) {}

  try {
    if ((node.name || '').match(/Page|Layout|AppShell|Main|Dashboard|Welcome|Onboarding/i)) {
      score += 10;
    }
  } catch (e) {}

  return score;
}

function isClearlyEmpty(node) {
  try {
    if (!('children' in node)) return false;
    if (node.children.length > 0) return false;
    const tiny = node.width < 10 || node.height < 10;
    const fullButEmpty = node.width >= 100 && node.height >= 100;
    return tiny || fullButEmpty;
  } catch (e) {
    return false;
  }
}

function findTopLevelCandidates(page) {
  return page.children.filter((n) => isSceneFrame(n));
}

function moveToArchive(node, archivePage, reason) {
  const wrapper = figma.createFrame();
  wrapper.name = `ARCHIVED / ${reason}/${node.name}`;
  wrapper.resize(Math.max(100, node.width || 100), Math.max(100, node.height || 100));
  archivePage.appendChild(wrapper);
  try {
    wrapper.appendChild(node);
  } catch (e) {
    try {
      const clone = node.clone();
      wrapper.appendChild(clone);
      node.remove();
    } catch (err) {}
  }
}

function renameCanonical(node) {
  const route = canonicalRoute(node.name);
  if (!route) return;
  const map = {
    landing: 'LandingPage',
    auth: 'AuthPage',
    login: 'LoginPage',
    register: 'RegisterPage',
    onboarding: 'OnboardingPage',
    welcome: 'WelcomePage',
    dashboard: 'DashboardPage',
    opportunities: 'OpportunitiesPage',
    applications: 'ApplicationsPage',
    profile: 'ProfilePage',
    identity: 'IdentityPage',
    dossier: 'DossierPage',
    analysis: 'AnalysisPage',
    documents: 'DocumentsPage',
    generation: 'GenerationPage',
    apply: 'ApplyPage',
    settings: 'SettingsPage',
    'asset-library': 'AssetLibraryPage',
    'test-tokens': 'TokenTestPage',
    'style-guide': 'StyleGuidePage',
    'design-sidekick': 'DesignSidekickPage',
    'animation-test': 'AnimationTestPage',
    'dev-map': 'DevMapPage',
    feed: 'FeedPage',
  };
  if (map[route]) node.name = map[route];
}

function flattenSingleChildWrappers(node) {
  if (!('children' in node)) return;
  const children = [...node.children];
  for (const child of children) {
    flattenSingleChildWrappers(child);
  }

  if (
    node.type === 'FRAME' &&
    node.children.length === 1 &&
    node.parent &&
    node.parent.type !== 'PAGE'
  ) {
    const child = node.children[0];
    const hasOwnVisualStyle =
      (node.fills && node.fills.length) ||
      (node.strokes && node.strokes.length) ||
      (node.effects && node.effects.length);

    if (!hasOwnVisualStyle) {
      node.name = `WRAPPER/${node.name}`;
    }
  }
}

async function main() {
  const page = figma.currentPage;
  const archive = await ensureArchivePage();

  const topLevel = findTopLevelCandidates(page);

  const buckets = {};
  for (const node of topLevel) {
    const route = canonicalRoute(node.name);
    if (!buckets[route]) buckets[route] = [];
    buckets[route].push(node);
  }

  let archivedCount = 0;
  let renamedCount = 0;
  let flaggedWrappers = 0;

  for (const route of Object.keys(buckets)) {
    const nodes = buckets[route];

    for (const node of [...nodes]) {
      if (isClearlyEmpty(node)) {
        moveToArchive(node, archive, 'EMPTY');
        archivedCount++;
      }
    }
  }

  const freshTopLevel = findTopLevelCandidates(page);
  const freshBuckets = {};
  for (const node of freshTopLevel) {
    const route = canonicalRoute(node.name);
    if (!freshBuckets[route]) freshBuckets[route] = [];
    freshBuckets[route].push(node);
  }

  for (const route of Object.keys(freshBuckets)) {
    const nodes = freshBuckets[route];
    if (!nodes[0]) continue;
    if (nodes.length <= 1) {
      renameCanonical(nodes[0]);
      renamedCount++;
      continue;
    }

    const scored = nodes
      .map((n) => ({ node: n, score: scoreNode(n) }))
      .sort((a, b) => b.score - a.score);

    const keep = scored[0].node;
    renameCanonical(keep);
    renamedCount++;

    for (let i = 1; i < scored.length; i++) {
      moveToArchive(scored[i].node, archive, `DUPLICATE-${route}`);
      archivedCount++;
    }
  }

  const remaining = findTopLevelCandidates(page);
  for (const node of remaining) {
    const before = node.name;
    flattenSingleChildWrappers(node);
    if (node.name !== before && node.name.startsWith('WRAPPER/')) {
      flaggedWrappers++;
    }
  }

  figma.notify(
    `Cleanup complete: archived ${archivedCount}, renamed ${renamedCount}, flagged ${flaggedWrappers} wrappers.`
  );
  figma.closePlugin();
}

main();
