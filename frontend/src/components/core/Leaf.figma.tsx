import React from 'react';
import { Leaf } from './Leaf';
import figma from '@figma/code-connect';

/**
 * -- FIGMA CODE CONNECT --
 * Component: Leaf (Typography)
 * Figma Node: [Paste Figma Component URL Here]
 */
figma.connect(Leaf, 'https://www.figma.com/design/YOUR_FILE_ID?node-id=YOUR_NODE_ID', {
  props: {
    role: figma.enum('Role', {
      Hero: 'hero',
      Title: 'title',
      Body: 'body',
      Data: 'data',
    }),
    children: figma.string('Content'),
    label: figma.string('Label (Hero Only)'),
    as: figma.enum('HTML Tag', {
      H1: 'h1',
      H2: 'h2',
      P: 'p',
      Code: 'code',
      Div: 'div',
    }),
  },
  example: ({ role, children, label, as }) => (
    <Leaf
      role={role}
      label={label}
      as={as}
    >
      {children}
    </Leaf>
  ),
});
