/**
 * Custom ESLint Rules for M3 Migration
 * Enforces design token usage and prevents hardcoded values
 */

module.exports = {
  rules: {
    // Warn about hardcoded hex colors
    'no-hardcoded-colors': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow hardcoded hex color values in favor of design tokens',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          hardcodedColor:
            'Use design tokens instead of hardcoded colors. Replace "{{ value }}" with var(--sys-color-*) or theme.palette.*',
        },
        schema: [],
      },
      create(context) {
        return {
          Property(node) {
            // Check sx prop object properties
            if (
              ['backgroundColor', 'color', 'borderColor', 'fill', 'stroke'].includes(
                node.key.name || node.key.value
              )
            ) {
              const value = node.value;

              // Check for hex color literals
              if (value.type === 'Literal' && typeof value.value === 'string') {
                if (/^#[0-9A-Fa-f]{3,8}$/.test(value.value)) {
                  context.report({
                    node,
                    messageId: 'hardcodedColor',
                    data: {
                      value: value.value,
                    },
                  });
                }
              }

              // Check for template literals with hex colors
              if (value.type === 'TemplateLiteral') {
                const templateValue = value.quasis[0]?.value.raw || '';
                if (/^#[0-9A-Fa-f]{3,8}$/.test(templateValue)) {
                  context.report({
                    node,
                    messageId: 'hardcodedColor',
                    data: {
                      value: templateValue,
                    },
                  });
                }
              }
            }
          },
        };
      },
    },

    // Warn about hardcoded spacing values
    'no-hardcoded-spacing': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow hardcoded spacing values in favor of design tokens',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          hardcodedSpacing:
            'Use design tokens or theme.spacing() instead of hardcoded spacing. Replace "{{ value }}" with var(--sys-space-*) or theme.spacing()',
        },
        schema: [],
      },
      create(context) {
        return {
          Property(node) {
            // Check sx prop object properties
            if (
              [
                'padding',
                'margin',
                'gap',
                'paddingTop',
                'paddingRight',
                'paddingBottom',
                'paddingLeft',
                'marginTop',
                'marginRight',
                'marginBottom',
                'marginLeft',
              ].includes(node.key.name || node.key.value)
            ) {
              const value = node.value;

              // Check for px literals like "16px"
              if (value.type === 'Literal' && typeof value.value === 'string') {
                if (/^\d+px$/.test(value.value)) {
                  context.report({
                    node,
                    messageId: 'hardcodedSpacing',
                    data: {
                      value: value.value,
                    },
                  });
                }
              }

              // Check for template literals with px values
              if (value.type === 'TemplateLiteral') {
                const templateValue = value.quasis[0]?.value.raw || '';
                if (/^\d+px$/.test(templateValue)) {
                  context.report({
                    node,
                    messageId: 'hardcodedSpacing',
                    data: {
                      value: templateValue,
                    },
                  });
                }
              }
            }
          },
        };
      },
    },

    // Warn about hardcoded border radius values
    'no-hardcoded-radius': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow hardcoded border radius values in favor of design tokens',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          hardcodedRadius:
            'Use design tokens instead of hardcoded border radius. Replace "{{ value }}" with var(--sys-shape-radius-*) or theme.shape.borderRadius',
        },
        schema: [],
      },
      create(context) {
        return {
          Property(node) {
            // Check sx prop object properties
            if (
              [
                'borderRadius',
                'borderTopLeftRadius',
                'borderTopRightRadius',
                'borderBottomLeftRadius',
                'borderBottomRightRadius',
              ].includes(node.key.name || node.key.value)
            ) {
              const value = node.value;

              // Check for px literals like "12px"
              if (value.type === 'Literal' && typeof value.value === 'string') {
                if (/^\d+px$/.test(value.value) || /^\d+rem$/.test(value.value)) {
                  context.report({
                    node,
                    messageId: 'hardcodedRadius',
                    data: {
                      value: value.value,
                    },
                  });
                }
              }

              // Check for template literals
              if (value.type === 'TemplateLiteral') {
                const templateValue = value.quasis[0]?.value.raw || '';
                if (/^\d+px$/.test(templateValue) || /^\d+rem$/.test(templateValue)) {
                  context.report({
                    node,
                    messageId: 'hardcodedRadius',
                    data: {
                      value: templateValue,
                    },
                  });
                }
              }
            }
          },
        };
      },
    },
  },
};
