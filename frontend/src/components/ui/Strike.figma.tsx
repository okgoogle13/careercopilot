import React from 'react';
import { Strike } from './Strike';
import figma from '@figma/code-connect';

/**
 * -- FIGMA CODE CONNECT --
 * Archetype: Strike (v6.1)
 * Successor to Pebble / KeralaRageButton.
 * Represents defiance, finality, and primary CTAs.
 */
figma.connect(Strike, 'https://www.figma.com/design/YOUR_FILE_ID?node-id=YOUR_NODE_ID', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Ghost: 'ghost',
      Destructive: 'destructive',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    children: figma.string('Label'),
    isLoading: figma.boolean('Loading'),
    disabled: figma.boolean('Disabled'),
    iconLeft: figma.boolean('Show Icon Left'),
    iconRight: figma.boolean('Show Icon Right'),
  },
  example: ({ variant, size, children, isLoading, disabled, iconLeft, iconRight }) => (
    <Strike
      variant={variant}
      size={size}
      isLoading={isLoading}
      disabled={disabled}
      iconLeft={iconLeft ? <span>+</span> : undefined}
      iconRight={iconRight ? <span>→</span> : undefined}
    >
      {children}
    </Strike>
  ),
});
