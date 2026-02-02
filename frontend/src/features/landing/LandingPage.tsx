import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

// Northcote Assets
import sentryKookaburra from '../../assets/specimens/sentry_kookaburra.png';
import wallpaper from '../../assets/textures/wallpaper.png';

/**
 * CareerCopilot Landing Page ("The Resurrection")
 *
 * V3.1 Gallery Mode Implementation:
 * ✓ ASSET-01 Wallpaper Integration
 * ✓ High-Fidelity Hero with Proclamation/Curator mix
 * ✓ Viscous Breeze motion ready (CSS)
 * ✓ Federation Font Stack enforced
 */
export function LandingPage(): React.ReactElement {
  return (
    <div className={styles.container}>
      {/* LAYER 0: The Great Wallpaper (ASSET-01) */}
      <div
        className={styles.wallpaperLayer}
        style={{ backgroundImage: `url(${wallpaper})` }}
      />

      {/* LAYER 1: Organic Gradient Blobs */}
      <div className={styles.blobCanvas}>
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
      </div>

      {/* LAYER 2: Specimen Anchors */}
      <div className={styles.specimenLayer}>
        <img
          src={sentryKookaburra}
          alt="The Sentry Kookaburra"
          className={styles.sentryMascot}
        />
      </div>

      {/* LAYER 3: Hero Card (Gallery Glass) */}
      <main className={styles.heroCard}>
        <div className="hero-cursive-mix">
          <span className="proclamation text-bloom-ultra">Career</span>
          <span className="cursive">Copilot</span>
        </div>

        <p className={styles.heroTagline}>
          A Victorian Naturalist’s approach to modern career transition.
        </p>

        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-annotation text-wattle-gold tracking-[0.2em]">
            RESURRECTION PROTOCOL V3.1
          </span>
          <span className="text-curator-annotation text-flannel-flower opacity-60">
            → specimens awaiting audit
          </span>
        </div>

        <div className={styles.actionContainer}>
          <Link
            to="/login"
            className={styles.btnPebbleFilled}
          >
            Enter Station
          </Link>
          <Link
            to="/register"
            className={styles.btnPebbleOutlined}
          >
            New Specimen
          </Link>
          <Link
            to="/dashboard?demo=true"
            className={styles.btnLink}
          >
            Explore as Guest
          </Link>
        </div>
      </main>

      <div className={styles.m3Star}>✦</div>
    </div>
  );
}

export default LandingPage;
