import React from 'react';
import { March } from './March';
import figma from '@figma/code-connect';

/**
 * -- FIGMA CODE CONNECT --
 * Archetype: March (v6.1)
 * Successor to Jar.
 * Represents sequential progress and collective choice.
 */
figma.connect(March, 'https://www.figma.com/design/YOUR_FILE_ID?node-id=YOUR_NODE_ID', {
  props: {
    label: figma.string('Label'),
    placeholder: figma.string('Placeholder'),
    helperText: figma.string('Helper Text'),
    error: figma.boolean('Error State'),
    errorMessage: figma.string('Error Message'),
    disabled: figma.boolean('Disabled'),
    required: figma.boolean('Required'),
    fullWidth: figma.boolean('Full Width'),
    // Options are mapped to figma selection if needed, but here we provide a static preview
  },
  example: ({
    label,
    placeholder,
    helperText,
    error,
    errorMessage,
    disabled,
    required,
    fullWidth,
  }) => (
    <March
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      errorMessage={errorMessage}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      options={[
        { value: 'option-1', label: 'First Selection' },
        { value: 'option-2', label: 'Second Selection' },
      ]}
      value="option-1"
    />
  ),
});
