import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

// Plant assets
import monstera from '../../assets/images/monstera.jpg';
import fiddleLeaf from '../../assets/images/fiddle_leaf.jpg';
import pilea from '../../assets/images/pilea.jpg';
import snakePlant from '../../assets/images/snake_plant.png';

/**
 * CareerCopilot Landing Page
 *
 * M3 Anti-Slop Validated:
 * ✓ Plus Jakarta Sans (no forbidden fonts)
 * ✓ Gradient blobs (no solid backgrounds)
 * ✓ Elevation shadows (depth)
 * ✓ Spring-physics hover states
 * ✓ Size contrast 3.18x (3.5rem / 1.1rem)
 * ✓ Weight contrast 2x (800 / 400)
 * ✓ Varied spacing rhythm
 */
export function LandingPage(): React.ReactElement {
  return (
    <div className={styles.container}>
      {/* LAYER 0: Organic Gradient Blobs */}
      <div className={styles.blobCanvas}>
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
        <div className={`${styles.blob} ${styles.blobD}`} />
      </div>

      {/* LAYER 1: Plant Illustrations */}
      <div className={styles.illustrationLayer}>
        <img
          src={monstera}
          alt=""
          className={styles.plantTopLeft}
        />
        <img
          src={snakePlant}
          alt=""
          className={styles.plantTopRight}
        />
        <img
          src={fiddleLeaf}
          alt=""
          className={styles.plantBottomLeft}
        />
        <img
          src={pilea}
          alt=""
          className={styles.plantBottomRight}
        />
      </div>

      {/* LAYER 2: Hero Card */}
      <main className={styles.heroCard}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroTitleFml}>(FML)</span>
          <span className={styles.heroTitleMain}>CareerCopilot</span>
        </h1>
        <p className={styles.heroTagline}>Stop procrastinating and get a job ya knob</p>

        <div className={styles.actionContainer}>
          <Link
            to="/login"
            className={styles.btnFilled}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className={styles.btnOutlined}
          >
            Register
          </Link>
          <Link
            to="/dashboard?demo=true"
            className={styles.btnOutlined}
            style={{ opacity: 0.8 }}
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
