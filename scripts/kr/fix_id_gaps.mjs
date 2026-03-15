import fs from 'fs';
import path from 'path';

const assetPackagesDir = '/Users/okgoogle13/Projects/careercopilot/asset-packages';
const gapIds = Array.from({ length: 105 - 93 + 1 }, (_, i) => `KR-SOLID-0${93 + i}`);

gapIds.forEach(id => {
  const pkgDir = path.join(assetPackagesDir, id);
  if (fs.existsSync(pkgDir)) {
    console.log(`Skipping ${id} (already exists)`);
    return;
  }

  fs.mkdirSync(pkgDir, { recursive: true });

  const metadata = {
    id: id,
    title: "System Reserved Gap",
    description: "Intentionally reserved ID to preserve historical sequence. No asset associated with this ID.",
    status: "RESERVED",
    audit_date: new Date().toISOString()
  };

  const manifest = {
    asset_id: id,
    asset_name: "Reserved Gap",
    packaging_version: "1.0",
    packaged_at: new Date().toISOString(),
    status: "reserved_gap"
  };

  fs.writeFileSync(path.join(pkgDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
  fs.writeFileSync(path.join(pkgDir, 'PACKAGING_MANIFEST.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(pkgDir, 'usage.md'), `# ${id}\n\nThis ID is reserved.`);

  console.log(`Created reservation for ${id}`);
});
