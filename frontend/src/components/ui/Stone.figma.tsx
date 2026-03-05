import React from 'react';
import { Stone } from './Stone';
import figma from '@figma/code-connect';

/**
 * -- FIGMA CODE CONNECT --
 * Component: Stone (Container)
 * Figma Node: [Paste Figma Component URL Here]
 */
figma.connect(Stone, 'https://www.figma.com/design/YOUR_FILE_ID?node-id=YOUR_NODE_ID', {
  props: {
    mode: figma.enum('Mode', {
      Gallery: 'gallery',
      Laboratory: 'laboratory',
    }),
    elevation: figma.enum('Elevation', {
      Flat: 'flat',
      Raised: 'raised',
      Floating: 'floating',
    }),
    // Mapping content slots
    hasHeader: figma.boolean('Show Header'),
    hasFooter: figma.boolean('Show Footer'),
    content: figma.string('Content Text'),
  },
  example: ({ mode, elevation, hasHeader, hasFooter, content }) => (
    <Stone
      elevation={elevation}
      header={hasHeader ? <h3>Header</h3> : undefined}
      footer={hasFooter ? <button>Action</button> : undefined}
    >
      <p>{content}</p>
    </Stone>
  ),
});
