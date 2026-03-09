import React from 'react';
import { Placard } from './Placard';
import figma from '@figma/code-connect';

/**
 * -- FIGMA CODE CONNECT --
 * Archetype: Placard (v6.1)
 * Successor to Stone / ActionCard.
 * Represents solidarity structure and content framing.
 */
figma.connect(Placard, 'https://www.figma.com/design/YOUR_FILE_ID?node-id=YOUR_NODE_ID', {
  props: {
    elevation: figma.enum('Elevation', {
      Flat: 'flat',
      Raised: 'raised',
      Floating: 'floating',
    }),
    header: figma.boolean('Show Header'),
    footer: figma.boolean('Show Footer'),
    children: figma.string('Body Content'),
  },
  example: ({ elevation, header, footer, children }) => (
    <Placard
      elevation={elevation}
      header={header}
      footer={footer}
    >
      <p>{children}</p>
    </Placard>
  ),
});
