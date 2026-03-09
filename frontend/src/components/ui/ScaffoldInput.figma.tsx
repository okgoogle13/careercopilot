import React from 'react';
import { ScaffoldInput } from './ScaffoldInput';
import figma from '@figma/code-connect';

/**
 * -- FIGMA CODE CONNECT --
 * Archetype: Scaffold (v6.1)
 * Successor to Lens.
 * Represents structural, load-bearing form elements.
 */
figma.connect(ScaffoldInput, 'https://www.figma.com/design/YOUR_FILE_ID?node-id=YOUR_NODE_ID', {
  props: {
    label: figma.string('Label'),
    placeholder: figma.string('Placeholder'),
    helperText: figma.string('Helper Text'),
    error: figma.boolean('Error State'),
    errorMessage: figma.string('Error Message'),
    variant: figma.enum('Variant', {
      Outlined: 'outlined',
      Filled: 'filled',
    }),
    size: figma.enum('Size', {
      Small: 'small',
      Medium: 'medium',
      Large: 'large',
    }),
    disabled: figma.boolean('Disabled'),
    required: figma.boolean('Required'),
    fullWidth: figma.boolean('Full Width'),
    showCounter: figma.boolean('Show Character Counter'),
    maxLength: figma.boolean('Has Max Length'),
  },
  example: ({
    label,
    placeholder,
    helperText,
    error,
    errorMessage,
    variant,
    size,
    disabled,
    required,
    fullWidth,
    showCounter,
    maxLength,
  }) => (
    <ScaffoldInput
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      errorMessage={errorMessage}
      variant={variant}
      size={size}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      showCounter={showCounter}
      maxLength={maxLength ? 100 : undefined}
    />
  ),
});
