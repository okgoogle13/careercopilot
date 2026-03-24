import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { ApplyQuickWorkspaceReference } from './src/pages/ApplyQuickWorkspaceReference';
import { LibraryReferencePage } from './src/pages/LibraryReferencePage';
import { PastApplicationsReference } from './src/pages/PastApplicationsReference';
import { ProfileView } from './src/pages/ProfileView';
import { ImageStudioPage } from './image-studio/ImageStudioPage';
// TailoredResumeView and CoverLetterSpecificMetrics require non-trivial required props;
// stub wrappers below replace them until data providers are wired in M2+.

// Stub wrappers for components that require non-trivial props in production.
// These exist only to satisfy the prototype route — replace with real data providers in M2+.
const TailoredResumeViewStub: React.FC = () => (
  <div style={{ padding: '2rem', color: 'white' }}>
    <p>TailoredResumeView requires careerData, analysis, and template props.</p>
    <p>Wire up a data provider before promoting this route to production.</p>
  </div>
);

const CoverLetterMetricsStub: React.FC = () => (
  <div style={{ padding: '2rem', color: 'white' }}>
    <p>CoverLetterSpecificMetrics requires a score object and wordCount prop.</p>
    <p>Wire up a data provider before promoting this route to production.</p>
  </div>
);

/**
 * Prototype harvest index — canonical route ownership declared per entry.
 * Groups sourced from route-matrix.md § Permanent Authenticated Navigation Lock.
 * Use these mappings to determine which canonical route owns harvested logic.
 */
const PrototypeIndex: React.FC = () => (
  <div style={{ padding: '2rem', fontFamily: 'Work Sans, sans-serif', color: 'white' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Prototype Routes</h1>
    <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '2rem' }}>
      Support-reference zone. Each entry declares its canonical product route owner.
    </p>

    {/* Applications family → /apply/quick, /tracker */}
    <section style={{ marginBottom: '1.5rem' }}>
      <h2
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: '0.5rem',
        }}
      >
        Applications family
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <li>
          <Link to="/prototype/apply-quick">Apply Quick Workspace</Link>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            → canonical: /apply/quick
          </span>
        </li>
        <li>
          <Link to="/prototype/past-applications">Past Applications</Link>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            → canonical: /tracker
          </span>
        </li>
      </ul>
    </section>

    {/* Documents family → /documents */}
    <section style={{ marginBottom: '1.5rem' }}>
      <h2
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: '0.5rem',
        }}
      >
        Documents family
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <li>
          <Link to="/prototype/resume">Tailored Resume (stub)</Link>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            → canonical: /documents
          </span>
        </li>
        <li>
          <Link to="/prototype/cover-letter">Cover Letter Metrics (stub)</Link>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            → canonical: /documents
          </span>
        </li>
      </ul>
    </section>

    {/* Account family → /profile */}
    <section style={{ marginBottom: '1.5rem' }}>
      <h2
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: '0.5rem',
        }}
      >
        Account family
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <li>
          <Link to="/prototype/profile">Profile</Link>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            → canonical: /profile
          </span>
        </li>
      </ul>
    </section>

    {/* Support-reference only — no canonical product route */}
    <section style={{ marginBottom: '1.5rem' }}>
      <h2
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: '0.5rem',
        }}
      >
        Support-reference only (no canonical promotion)
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <li>
          <Link to="/prototype/library">Component Library</Link>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            → component reference, support-only
          </span>
        </li>
        <li>
          <Link to="/prototype/image-studio">Image Studio</Link>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            → support-only
          </span>
        </li>
      </ul>
    </section>
  </div>
);

export const PrototypeRoutes: React.FC = () => (
  <Routes>
    <Route
      index
      element={<PrototypeIndex />}
    />
    <Route
      path="apply-quick"
      element={<ApplyQuickWorkspaceReference />}
    />
    <Route
      path="library"
      element={<LibraryReferencePage />}
    />
    <Route
      path="past-applications"
      element={<PastApplicationsReference />}
    />
    <Route
      path="profile"
      element={<ProfileView />}
    />
    <Route
      path="image-studio"
      element={<ImageStudioPage />}
    />
    <Route
      path="resume"
      element={<TailoredResumeViewStub />}
    />
    <Route
      path="cover-letter"
      element={<CoverLetterMetricsStub />}
    />
  </Routes>
);
