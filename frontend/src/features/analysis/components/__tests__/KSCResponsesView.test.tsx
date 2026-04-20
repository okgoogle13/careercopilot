import React from 'react';
import { render, screen } from '@testing-library/react';

import { KSCResponsesView } from '../KSCResponsesView';

describe('KSCResponsesView', () => {
  const template = {
    fontSans: 'Work Sans',
    textColor: 'var(--kr-color-worker-ash-base)',
    primaryColor: 'var(--kr-color-ink-gold-base)',
    headingColor: 'var(--kr-color-worker-ash-base)',
    fontSerif: 'Fraunces',
    borderColor: 'var(--kr-color-concrete-grey-steps-1)',
  };

  it('uses the dark canvas surface instead of a white background', () => {
    render(
      <KSCResponsesView
        analysis={{ KSC_Responses_Drafts: [] } as any}
        template={template as any}
      />
    );

    const emptyState = screen.getByText(/no key selection criteria responses generated/i);
    expect(emptyState.className).toContain('bg-canvas');
    expect(emptyState.className).not.toContain('bg-white');
  });
});
