// scripts/card-transformer.js
module.exports = function(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    // 1. Check if the old card component is imported in this file. If not, do nothing.
    const oldCardImport = root.find(j.ImportDeclaration).filter(path => {
        const source = path.node.source.value;
        return source === './components/ui/card' ||
               source === './ui/card' ||
               source === './card' ||
               source === '@/components/ui/card' ||
               source.endsWith('/ui/card');
    });
    if (oldCardImport.size() === 0) {
        return null; // No changes needed for this file.
    }

    // 2. Add necessary MUI imports if they don't exist
    let muiImportExists = false;
    const muiSpecifiers = ['Card', 'CardContent', 'CardHeader', 'CardActions', 'Typography', 'Box'];

    root.find(j.ImportDeclaration, { source: { value: '@mui/material' } }).forEach(path => {
        muiImportExists = true;
        muiSpecifiers.forEach(spec => {
            if (!path.node.specifiers.some(s => s.imported.name === spec)) {
                path.node.specifiers.push(j.importSpecifier(j.identifier(spec)));
            }
        });
    });

    if (!muiImportExists) {
        const muiImport = j.importDeclaration(
            muiSpecifiers.map(name => j.importSpecifier(j.identifier(name))),
            j.literal('@mui/material')
        );
        oldCardImport.at(0).insertAfter(muiImport);
    }

    // 3. Transform CardHeader to use title and subheader props
    root.find(j.JSXOpeningElement, { name: { name: 'CardHeader' } }).forEach(path => {
        const cardHeaderElement = path.parentPath.node;
        let titleNode, descriptionNode;

        const remainingChildren = cardHeaderElement.children.filter(child => {
            if (child.type === 'JSXElement') {
                if (child.openingElement.name.name === 'CardTitle') {
                    titleNode = child.children;
                    return false;
                }
                if (child.openingElement.name.name === 'CardDescription') {
                    descriptionNode = child.children;
                    return false;
                }
            }
            return true; // Keep other children (like whitespace or other elements)
        });

        if (titleNode) {
            path.node.attributes.push(j.jsxAttribute(
                j.jsxIdentifier('title'),
                j.jsxExpressionContainer(j.jsxElement(
                    j.jsxOpeningElement(j.jsxIdentifier('Typography'), [j.jsxAttribute(j.jsxIdentifier('variant'), j.literal('h3'))], false),
                    j.jsxClosingElement(j.jsxIdentifier('Typography')),
                    titleNode
                ))
            ));
        }

        if (descriptionNode) {
            path.node.attributes.push(j.jsxAttribute(
                j.jsxIdentifier('subheader'),
                j.jsxExpressionContainer(j.jsxElement(
                    j.jsxOpeningElement(j.jsxIdentifier('Typography'), [j.jsxAttribute(j.jsxIdentifier('variant'), j.literal('body2')), j.jsxAttribute(j.jsxIdentifier('color'), j.literal('text.secondary'))], false),
                    j.jsxClosingElement(j.jsxIdentifier('Typography')),
                    descriptionNode
                ))
            ));
        }

        cardHeaderElement.children = remainingChildren;
    });

    // 4. Perform simple component renames
    const componentMap = {
        'CardFooter': 'CardActions',
        'CardAction': 'Box', // CardAction becomes a simple Box for layout
    };

    Object.keys(componentMap).forEach(oldName => {
        root.find(j.JSXIdentifier, { name: oldName }).forEach(path => {
            const newName = componentMap[oldName];
            // Rename both opening and closing tags
            const parentElement = path.parentPath.node;
            if (parentElement.openingElement) parentElement.openingElement.name.name = newName;
            if (parentElement.closingElement) parentElement.closingElement.name.name = newName;
        });
    });

    // 5. Remove the old import statement
    oldCardImport.remove();

    return root.toSource({ quote: 'single' });
};
