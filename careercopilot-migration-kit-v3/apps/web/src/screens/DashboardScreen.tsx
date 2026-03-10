import { useState } from 'react';
import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

const dashboardCards = [
  {
    title: 'Applications In Motion',
    value: '12',
    detail: 'Priority roles, follow-up windows, and next actions regrouped into one queue.',
  },
  {
    title: 'Drafts Ready To Push',
    value: '04',
    detail: 'Cover letters and notes waiting for the next clean revision pass.',
  },
  {
    title: 'Signals To Review',
    value: '03',
    detail: 'Fresh leads surfaced from the current workflow without leaving the dashboard shell.',
  },
] as const;

export function DashboardScreen() {
  const [status, setStatus] = useState(
    'Dashboard migration is live behind the flag while the legacy route remains available for rollback.',
  );

  return (
    <section
      className="placeholder-screen dashboard-screen"
      data-testid="dashboard-screen"
    >
      <Strike
        className="auth-strike dashboard-strike"
        eyebrow="Worker Overview"
      >
        One sharper board for active roles, draft pressure, and the next move that needs attention.
      </Strike>

      <Placard title="Hold The Full Search In One View">
        <March>
          The migrated dashboard keeps the route reversible while making the work feel more coordinated,
          legible, and emotionally awake.
        </March>

        <div className="dashboard-grid">
          {dashboardCards.map((card) => (
            <article
              className="dashboard-card"
              key={card.title}
            >
              <p className="dashboard-card__label">{card.title}</p>
              <p className="dashboard-card__value">{card.value}</p>
              <p className="dashboard-card__detail">{card.detail}</p>
            </article>
          ))}
        </div>

        <div className="dashboard-actions">
          <button
            className="primary-action"
            onClick={() => setStatus('Primary dashboard workflow placeholder acknowledged.')}
            type="button"
          >
            Review Active Roles
          </button>
          <button
            className="secondary-action"
            onClick={() => setStatus('Secondary dashboard workflow placeholder acknowledged.')}
            type="button"
          >
            Open Draft Queue
          </button>
        </div>

        <p
          aria-live="polite"
          className="status-copy"
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
