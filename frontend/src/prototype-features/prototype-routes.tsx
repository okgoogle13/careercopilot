import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

type PrototypeSurfaceProps = {
  title: string;
  canonicalOwner: string;
  status: string;
  notes: string;
};

function PrototypeSurface({ title, canonicalOwner, status, notes }: PrototypeSurfaceProps) {
  return (
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] px-6 py-10 text-[var(--sys-color-worker-ash-base)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="rounded-[var(--sys-shape-placardTorn01)] border border-[var(--sys-color-concreteGrey-base)] bg-[var(--sys-color-charcoalBackground-steps-2)] p-6">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--sys-color-concreteGrey-base)]">
            Prototype Support Reference
          </p>
          <h1 className="mb-4 text-3xl font-semibold text-[var(--sys-color-worker-ash-base)]">
            {title}
          </h1>
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-[var(--sys-shape-blockRiot01)] border border-[var(--sys-color-protestMetalBlue-base)] px-3 py-1 text-[var(--sys-color-paperWhite-base)]">
              Canonical owner: {canonicalOwner}
            </span>
            <span className="rounded-[var(--sys-shape-blockRiot02)] border border-[var(--sys-color-inkGold-base)] px-3 py-1 text-[var(--sys-color-inkGold-base)]">
              Status: {status}
            </span>
          </div>
          <p className="max-w-3xl text-base leading-7 text-[var(--sys-color-worker-ash-base)]/90">
            {notes}
          </p>
        </div>

        <div className="rounded-[var(--sys-shape-blockRiot02)] border border-[var(--sys-color-concreteGrey-base)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-5">
          <Link
            className="inline-flex rounded-[var(--sys-shape-blockRiot03)] bg-[var(--sys-color-inkGold-base)] px-4 py-2 font-semibold text-[var(--sys-color-charcoalBackground-base)]"
            to="/prototype"
          >
            Back to prototype index
          </Link>
        </div>
      </div>
    </div>
  );
}

function PrototypeIndex() {
  const entries = [
    {
      path: '/prototype/apply-quick',
      label: 'Apply Quick Workspace',
      owner: '/apply/quick',
      notes: 'Behavior-reference only. Keep canonical runtime ownership in Apply Quick.',
    },
    {
      path: '/prototype/past-applications',
      label: 'Past Applications',
      owner: '/tracker',
      notes: 'Reference-only. Tracker remains the canonical runtime surface.',
    },
    {
      path: '/prototype/profile',
      label: 'Profile View',
      owner: '/profile',
      notes: 'Reference-only. Voice/profile ownership stays in the canonical profile route.',
    },
    {
      path: '/prototype/settings-harvest',
      label: 'Settings Harvest',
      owner: '/settings',
      notes:
        'Reference-only. Settings remains a utility route; do not promote prototype shell semantics.',
    },
    {
      path: '/prototype/library',
      label: 'Component Library',
      owner: 'support-only',
      notes: 'Support-reference only. Not a product route owner.',
    },
    {
      path: '/prototype/image-studio',
      label: 'Image Studio',
      owner: 'support-only',
      notes: 'Support-reference only until explicitly promoted by a canonical plan.',
    },
    {
      path: '/prototype/resume',
      label: 'Tailored Resume View',
      owner: '/documents',
      notes: 'Stub route. Documents remains the canonical owner for document workspaces.',
    },
    {
      path: '/prototype/cover-letter',
      label: 'Cover Letter Metrics',
      owner: '/cover-letter-generator',
      notes: 'Support-reference only. Cover letter generation remains a canonical route owner.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] px-6 py-10 text-[var(--sys-color-worker-ash-base)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-[var(--sys-shape-placardTorn01)] border border-[var(--sys-color-concreteGrey-base)] bg-[var(--sys-color-charcoalBackground-steps-2)] p-6">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--sys-color-concreteGrey-base)]">
            Quarantine Zone
          </p>
          <h1 className="mb-4 text-3xl font-semibold">Prototype Support Routes</h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--sys-color-worker-ash-base)]/90">
            These routes are support-reference surfaces only. Canonical route ownership stays in the
            live app and the migration control docs; this index exists to prevent broken links while
            quarantine artifacts are reviewed.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <Link
              key={entry.path}
              className="rounded-[var(--sys-shape-blockRiot02)] border border-[var(--sys-color-concreteGrey-base)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-5 transition-transform duration-150 hover:-translate-y-0.5"
              to={entry.path}
            >
              <div className="mb-2 text-lg font-semibold text-[var(--sys-color-paperWhite-base)]">
                {entry.label}
              </div>
              <div className="mb-2 text-sm text-[var(--sys-color-inkGold-base)]">
                Canonical owner: {entry.owner}
              </div>
              <div className="text-sm leading-6 text-[var(--sys-color-worker-ash-base)]/85">
                {entry.notes}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrototypeRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<PrototypeIndex />}
      />
      <Route
        path="apply-quick"
        element={
          <PrototypeSurface
            title="Apply Quick Workspace"
            canonicalOwner="/apply/quick"
            status="behavior-reference only"
            notes="This prototype surface remains a quarantined reference. Reuse behavior only through the canonical Apply Quick route and its explicit remediation plan."
          />
        }
      />
      <Route
        path="library"
        element={
          <PrototypeSurface
            title="Component Library"
            canonicalOwner="support-only"
            status="reference-only"
            notes="This is not a canonical route. Treat it as support-reference material for cleanup and harvest planning only."
          />
        }
      />
      <Route
        path="past-applications"
        element={
          <PrototypeSurface
            title="Past Applications"
            canonicalOwner="/tracker"
            status="behavior-reference only"
            notes="Application tracking ownership remains in the canonical tracker surface. Do not promote the prototype shell or layout from this route."
          />
        }
      />
      <Route
        path="profile"
        element={
          <PrototypeSurface
            title="Profile View"
            canonicalOwner="/profile"
            status="reference-only"
            notes="Voice/profile ownership remains in the canonical profile route. This prototype route is held only as a support-reference stub."
          />
        }
      />
      <Route
        path="settings-harvest"
        element={
          <PrototypeSurface
            title="Settings Harvest"
            canonicalOwner="/settings"
            status="reference-only"
            notes="Settings remains a secondary utility surface. Prototype settings layouts are not route authority and must not drive shell decisions."
          />
        }
      />
      <Route
        path="image-studio"
        element={
          <PrototypeSurface
            title="Image Studio"
            canonicalOwner="support-only"
            status="blocked for promotion"
            notes="This surface stays quarantined until a canonical owner and runtime contract are explicitly approved."
          />
        }
      />
      <Route
        path="resume"
        element={
          <PrototypeSurface
            title="Tailored Resume View"
            canonicalOwner="/documents"
            status="stub route"
            notes="Document workflows remain owned by the canonical documents route. This stub exists only to keep old prototype links from breaking during cleanup."
          />
        }
      />
      <Route
        path="cover-letter"
        element={
          <PrototypeSurface
            title="Cover Letter Metrics"
            canonicalOwner="/cover-letter-generator"
            status="stub route"
            notes="Cover letter generation remains owned by the canonical generator route. This support-reference stub is intentionally non-promotable."
          />
        }
      />
    </Routes>
  );
}
