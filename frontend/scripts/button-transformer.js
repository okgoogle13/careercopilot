// scripts/button-transformer.js
module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  try {
    // 1. Find the import declaration for the old button (multiple possible paths)
    const oldButtonImports = root.find(j.ImportDeclaration).filter(path => {
      const source = path.node.source.value;
      return source === './components/ui/button' ||
             source === './ui/button' ||
             source === './button' ||
             source === '@/components/ui/button' ||
             source.endsWith('/ui/button');
    });

    if (oldButtonImports.size() === 0) {
      return null; // This file doesn't use the old button, no changes needed.
    }

    // Collect imported button names from old imports
    const importedButtonNames = new Set();
    const importedOtherNames = new Set(); // for buttonVariants, etc.

    oldButtonImports.forEach(path => {
      if (path.node.specifiers) {
        path.node.specifiers.forEach(spec => {
          if (spec.type === 'ImportSpecifier') {
            if (spec.imported.name === 'Button') {
              importedButtonNames.add(spec.local.name);
            } else {
              importedOtherNames.add(spec.imported.name);
            }
          } else if (spec.type === 'ImportDefaultSpecifier') {
            importedButtonNames.add(spec.local.name);
          }
        });
      }
    });

    // If no Button imports found, skip transformation
    if (importedButtonNames.size === 0) {
      return null;
    }

    // 2. Add MUI imports if they don't exist
    let muiImportExists = false;
    const muiImportPath = root.find(j.ImportDeclaration, {
      source: { value: '@mui/material' }
    });

    if (muiImportPath.size() > 0) {
      muiImportExists = true;
      // Add Button/IconButton if not already there
      muiImportPath.forEach(path => {
        const existingSpecifiers = path.node.specifiers.map(s => s.imported ? s.imported.name : s.local.name);

        ['Button', 'IconButton'].forEach(spec => {
          if (!existingSpecifiers.includes(spec)) {
            path.node.specifiers.push(j.importSpecifier(j.identifier(spec)));
          }
        });
      });
    }

    if (!muiImportExists) {
      const muiImport = j.importDeclaration(
        [j.importSpecifier(j.identifier('Button')), j.importSpecifier(j.identifier('IconButton'))],
        j.literal('@mui/material')
      );
      // Insert after the last import or at the beginning
      const lastImport = root.find(j.ImportDeclaration).at(-1);
      if (lastImport.size() > 0) {
        lastImport.insertAfter(muiImport);
      } else {
        root.get().node.body.unshift(muiImport);
      }
    }

    // 3. Transform Button JSX elements
    importedButtonNames.forEach(buttonName => {
      root.find(j.JSXOpeningElement).filter(path => {
        return path.node.name &&
               path.node.name.type === 'JSXIdentifier' &&
               path.node.name.name === buttonName;
      }).forEach(path => {
        let isIconButton = false;
        let hasVariant = false;

        // Process attributes
        if (path.node.attributes) {
          path.node.attributes = path.node.attributes.map(attr => {
            if (attr.type !== 'JSXAttribute') return attr;

            const attrName = attr.name.name;

            if (attrName === 'variant') {
              hasVariant = true;
              if (attr.value && attr.value.type === 'Literal') {
                const value = attr.value.value;
                switch (value) {
                  case 'default':
                    attr.value = j.literal('contained');
                    break;
                  case 'destructive':
                    attr.value = j.literal('contained');
                    // Add color="error" prop
                    path.node.attributes.push(
                      j.jsxAttribute(j.jsxIdentifier('color'), j.literal('error'))
                    );
                    break;
                  case 'ghost':
                  case 'link':
                    attr.value = j.literal('text');
                    break;
                  case 'outline':
                    attr.value = j.literal('outlined');
                    break;
                }
              }
            }

            if (attrName === 'size') {
              if (attr.value && attr.value.type === 'Literal') {
                const value = attr.value.value;
                switch (value) {
                  case 'default':
                    attr.value = j.literal('medium');
                    break;
                  case 'sm':
                    attr.value = j.literal('small');
                    break;
                  case 'lg':
                    attr.value = j.literal('large');
                    break;
                  case 'icon':
                    isIconButton = true;
                    return null; // Remove the size="icon" prop
                }
              }
            }

            return attr;
          }).filter(Boolean);
        }

        // Handle IconButton transformation
        if (isIconButton) {
          path.node.name.name = 'IconButton';

          // Find the corresponding closing element and update it
          const parentElement = path.parentPath.node;
          if (parentElement && parentElement.closingElement) {
            parentElement.closingElement.name.name = 'IconButton';
          }

          // Remove variant prop from IconButton as it doesn't support it
          if (path.node.attributes) {
            path.node.attributes = path.node.attributes.filter(attr =>
              !(attr.type === 'JSXAttribute' && attr.name.name === 'variant')
            );
          }
        }
      });
    });

    // 4. Remove old import statements
    oldButtonImports.remove();

    return root.toSource({
      quote: 'single',
      reuseParsers: true,
      lineTerminator: '\n'
    });

  } catch (error) {
    console.warn(`Error transforming ${file.path}:`, error.message);
    return null; // Return null to skip this file instead of crashing
  }
};