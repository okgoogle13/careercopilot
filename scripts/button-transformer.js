// scripts/button-transformer.js
module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 1. Find the import declaration for the old button
  const oldButtonImport = root.find(j.ImportDeclaration, {
    source: { value: './components/ui/button' }
  });

  if (oldButtonImport.size() === 0) {
    return null; // This file doesn't use the old button, no changes needed.
  }

  // 2. Add MUI imports if they don't exist
  let muiImportExists = false;
  root.find(j.ImportDeclaration, {
    source: { value: '@mui/material' }
  }).forEach(path => {
    muiImportExists = true;
    // Add Button/IconButton if not already there
    ['Button', 'IconButton'].forEach(spec => {
        if (!path.node.specifiers.some(s => s.imported.name === spec)) {
            path.node.specifiers.push(j.importSpecifier(j.identifier(spec)));
        }
    });
  });

  if (!muiImportExists) {
      const muiImport = j.importDeclaration(
          [j.importSpecifier(j.identifier('Button')), j.importSpecifier(j.identifier('IconButton'))],
          j.literal('@mui/material')
      );
      oldButtonImport.at(0).insertAfter(muiImport);
  }


  // 3. Find and transform all instances of the old Button component
  root.find(j.JSXOpeningElement, { name: { name: 'Button' } }).forEach(path => {
    // Check if this Button comes from the old import
    const scope = path.scope;
    const binding = scope.lookup('Button');
    if (!binding || binding.getBindings()['Button'][0].parentPath.node !== oldButtonImport.at(0).get().node) {
        return; // This is not our button, maybe it's already an MUI button
    }

    let isIconButton = false;

    // Map props
    path.node.attributes = path.node.attributes.map(attr => {
      if (attr.type === 'JSXAttribute') {
        if (attr.name.name === 'variant') {
          const value = attr.value.value;
          if (value === 'default') attr.value = j.literal('contained');
          if (value === 'destructive') {
            attr.value = j.literal('contained');
            path.node.attributes.push(j.jsxAttribute(j.jsxIdentifier('color'), j.literal('error')));
          }
          if (value === 'ghost' || value === 'link') attr.value = j.literal('text');
        }

        if (attr.name.name === 'size') {
          const value = attr.value.value;
          if (value === 'default') attr.value = j.literal('medium');
          if (value === 'sm') attr.value = j.literal('small');
          if (value === 'lg') attr.value = j.literal('large');
          if (value === 'icon') {
            isIconButton = true;
            return null; // Remove the size="icon" prop
          }
        }
      }
      return attr;
    }).filter(Boolean);

    // If it's an icon button, update both opening and closing tags
    if (isIconButton) {
      path.node.name.name = 'IconButton';
      const parentElement = path.parentPath.node;
      if (parentElement.closingElement) {
        parentElement.closingElement.name.name = 'IconButton';
      }
      // Remove variant prop from IconButton as it's not standard
      path.node.attributes = path.node.attributes.filter(attr => attr.name.name !== 'variant');
    }
  });

  // 4. Remove the old import statement
  oldButtonImport.remove();

  return root.toSource({ quote: 'single' });
};
