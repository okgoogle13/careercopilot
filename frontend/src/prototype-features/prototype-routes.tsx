/* eslint-disable */
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

const PrototypeIndex: React.FC = () => (
  <div style={{ padding: '2rem', fontFamily: 'Work Sans, sans-serif', color: 'white' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Prototype Features</h1>
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <li>
        <Link to="/prototype/apply-quick">Apply Quick Workspace</Link>
      </li>
      <li>
        <Link to="/prototype/library">Library Reference</Link>
      </li>
      <li>
        <Link to="/prototype/past-applications">Past Applications</Link>
      </li>
      <li>
        <Link to="/prototype/profile">Profile</Link>
      </li>
      <li>
        <Link to="/prototype/image-studio">Image Studio</Link>
      </li>
      <li>
        <Link to="/prototype/resume">Tailored Resume (stub)</Link>
      </li>
      <li>
        <Link to="/prototype/cover-letter">Cover Letter Metrics (stub)</Link>
      </li>
    </ul>
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
