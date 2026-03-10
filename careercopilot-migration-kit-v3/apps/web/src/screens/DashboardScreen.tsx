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
    'Movement overview is steady: active roles, drafts, and signals are aligned in one view.',
  );

  return (
    <section
      className="journey-screen dashboard-screen"
      data-testid="dashboard-screen"
    >
      <Strike
        className="auth-strike dashboard-strike"
        eyebrow="Movement Overview"
      >
        One sharper board for active roles, draft pressure, and the next move demanding attention.
      </Strike>

      <Placard title="Hold The Movement In One View">
        <March>
          Track the search as one coordinated rhythm: active roles, draft pressure, and signals ready for review.
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
            onClick={() => setStatus('Active roles opened. Priority applications are next in line.')}
            type="button"
          >
            Review Active Roles
          </button>
          <button
            className="secondary-action"
            onClick={() => setStatus('Draft queue opened. Revision-ready materials are now in focus.')}
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
