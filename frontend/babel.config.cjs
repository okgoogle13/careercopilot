// Simplified Babel config for Jest with only essential presets
// Note: Vite handles compilation for the actual build, this is only for Jest
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-typescript', {}],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    // Custom plugin to replace import.meta.env with process.env for Jest
    function () {
      return {
        visitor: {
          MemberExpression(path) {
            // Check for import.meta.env pattern
            if (
              path.node.object.type === 'MetaProperty' &&
              path.node.object.meta.name === 'import' &&
              path.node.object.property.name === 'meta' &&
              path.node.property.name === 'env'
            ) {
              // Replace with process.env
              path.replaceWith({
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'process' },
                property: { type: 'Identifier', name: 'env' },
              });
            }
            // Check for import.meta.env.VARIABLE pattern
            if (
              path.node.object.type === 'MemberExpression' &&
              path.node.object.object &&
              path.node.object.object.type === 'MetaProperty' &&
              path.node.object.object.meta.name === 'import' &&
              path.node.object.object.property.name === 'meta' &&
              path.node.object.property.name === 'env'
            ) {
              // Replace import.meta.env.X with process.env.X
              const varName = path.node.property.name;
              path.replaceWith({
                type: 'MemberExpression',
                object: { type: 'MemberExpression', object: { type: 'Identifier', name: 'process' }, property: { type: 'Identifier', name: 'env' } },
                property: { type: 'Identifier', name: varName },
              });
            }
          },
        },
      };
    },
  ],
};
