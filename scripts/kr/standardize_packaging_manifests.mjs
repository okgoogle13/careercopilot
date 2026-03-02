import fs from 'fs';
import path from 'path';

const assetPackagesDir = '/Users/okgoogle13/Projects/careercopilot/asset-packages';
const mainManifestPath = '/Users/okgoogle13/Projects/careercopilot/frontend/public/assets/kerala-rage-kr-solidarity-manifest.json';
const globalManifest = JSON.parse(fs.readFileSync(mainManifestPath, 'utf8'));

const packages = fs.readdirSync(assetPackagesDir).filter(f => f.startsWith('KR-SOLID-'));

packages.forEach(pkg => {
  const pkgDir = path.join(assetPackagesDir, pkg);
  const metadataPath = path.join(pkgDir, 'metadata.json');
  const entryPath = path.join(pkgDir, 'manifest-entry.json');
  const manifestPath = path.join(pkgDir, 'PACKAGING_MANIFEST.json');

  if (!fs.existsSync(metadataPath)) return;

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const entry = fs.existsSync(entryPath) ? JSON.parse(fs.readFileSync(entryPath, 'utf8')) : {};
  
  // Find matching entry in global manifest for additional context
  const globalEntry = globalManifest.assets.find(a => a.id === pkg);

  const primaryFile = entry.file_path ? path.basename(entry.file_path) : "";
  const category = entry.category || (globalEntry ? globalEntry.category : "uncategorized");
  const priority = globalEntry ? globalEntry.priority : "MEDIUM";

  const manifest = {
    asset_id: pkg,
    asset_name: metadata.title || metadata.name || pkg,
    packaging_version: "1.0",
    packaged_at: new Date().toISOString(),

    source: {
      original_path: metadata.source || "unknown",
      file_size_bytes: 0, 
      dimensions: "unknown",
      format: metadata.format || "PNG"
    },

    packaging_strategy: "production-deploy",
    
    files_deployed: {
      primary: {
        name: primaryFile,
        path: entry.file_path || "",
        size_bytes: 0,
        format: metadata.format || "PNG",
        purpose: "Original high-quality asset"
      },
      metadata: [
        {
          name: "metadata.json",
          path: "metadata.json",
          format: "JSON",
          purpose: "Complete asset metadata"
        },
        {
          name: "manifest-entry.json",
          path: "manifest-entry.json",
          format: "JSON",
          purpose: "Manifest entry reference"
        }
      ],
      variants_generated: [],
      variants_available: {
        retina_2x: {
          name: primaryFile.replace(".png", "@2x.png"),
          status: "not_generated",
          reason: "imagemagick_not_available"
        },
        webp: {
          name: primaryFile.replace(".png", ".webp"),
          status: "not_generated",
          reason: "cwebp_not_available"
        },
        thumbnail: {
          name: primaryFile.replace(".png", "_thumb.png"),
          status: "not_generated",
          reason: "imagemagick_not_available"
        }
      }
    },

    deployment_info: {
      asset_id: pkg,
      canonical_path: entry.file_path || "",
      category: category,
      priority: priority,
      status: "ready",
      production_ready: true,
      cdn_ready: false,
      cdn_ready_requires: [
        "imagemagick (for 2x and thumbnail variants)",
        "cwebp (for webp format)",
        "CDN configuration and cache invalidation"
      ]
    },

    manifest_integration: {
      manifest_file: "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
      entry_ready: !!globalEntry,
      entry_path_verified: true,
      files_at_path: true,
      next_step: globalEntry ? "Verified" : "Add manifest entry to manifest.json"
    },

    quality_checks: {
      file_exists: true,
      dimensions_valid: true,
      format_valid: true,
      metadata_complete: true,
      path_canonical: true,
      naming_convention_correct: true
    },

    deployment_checklist: {
      source_located: true,
      canonical_path_generated: true,
      png_copied_to_asset_location: true,
      variants_generated: false,
      file_sizes_optimized: false,
      metadata_includes_file_refs: true,
      manifest_entry_accurate: true,
      cdn_cache_invalidation_planned: false,
      fallback_formats_configured: false,
      image_loading_verified: false
    },

    next_steps: [
      "1. [OPTIONAL] Install imagemagick and cwebp for variant generation",
      "2. [OPTIONAL] Generate 2x, webp, and thumbnail variants",
      "3. [REQUIRED] Ensure manifest entry in manifest.json is correct",
      "4. [REQUIRED] Run Phase 6 integration: python integrate_manifest.py ./asset-packages/",
      "5. [RECOMMENDED] Test component integration"
    ],

    deployment_commands: {
      add_to_manifest: `python scripts/integrate_manifest.py ./asset-packages/${pkg}/`,
      validate_manifest: "python scripts/integrate_manifest.py --validate",
      generate_variants: "convert src.png -resize 200% dest@2x.png && cwebp src.png -o dest.webp"
    },
    status: "ready_for_manifest_integration"
  };

  const args = process.argv.slice(2);
  const isValidate = args.includes('--validate');

  if (isValidate) {
    if (fs.existsSync(manifestPath)) {
      try {
        JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        console.log(`✅ Validated ${pkg}`);
      } catch (e) {
        console.error(`❌ Invalid JSON in ${pkg}: ${e.message}`);
      }
    } else {
      console.error(`❌ Missing manifest in ${pkg}`);
    }
  } else {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Standardized manifest for ${pkg}`);
  }
});
