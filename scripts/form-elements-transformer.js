// scripts/form-elements-transformer.js
module.exports = function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // --- CONFIGURATION ---
  const oldImportPaths = [
    "./components/ui/input",
    "./components/ui/textarea",
    "./components/ui/label",
    "./components/ui/select",
    "./components/ui/checkbox",
    "./components/ui/radio-group",
    "./components/ui/switch",
    "./components/ui/slider",
  ];

  const componentMap = {
    Input: "TextField",
    Textarea: "TextField",
    Label: "InputLabel",
    Select: "Select",
    SelectTrigger: "Button", // Becomes part of the Select, but we'll rename to a placeholder
    SelectContent: "Menu",
    SelectItem: "MenuItem",
    SelectValue: null, // This gets removed and handled by Select's `value` prop
    Checkbox: "Checkbox",
    RadioGroup: "RadioGroup",
    RadioGroupItem: "Radio",
    Switch: "Switch",
    Slider: "Slider",
  };

  const muiImportsNeeded = new Set();

  // --- SCRIPT LOGIC ---

  // 1. Find all imports from the old UI library
  const oldImports = root.find(j.ImportDeclaration, (node) =>
    oldImportPaths.includes(node.source.value),
  );
  if (oldImports.size() === 0) {
    return null; // No changes needed for this file.
  }

  // 2. Transform the components
  Object.keys(componentMap).forEach((oldName) => {
    root.find(j.JSXIdentifier, { name: oldName }).forEach((path) => {
      const newName = componentMap[oldName];

      // Check if this identifier is from our old import
      const scope = path.scope;
      const binding = scope.lookup(oldName);
      const isTargetComponent =
        binding &&
        binding
          .getBindings()
          [oldName].some((b) => oldImports.paths().includes(b.parentPath.parentPath.node));

      if (!isTargetComponent) return;

      if (newName) {
        muiImportsNeeded.add(newName);
        path.node.name = newName;
        const parentElement = path.parentPath.node;
        if (parentElement.closingElement) {
          parentElement.closingElement.name.name = newName;
        }

        // Add specific props for components that need them
        if (oldName === "Input") {
          parentElement.attributes.push(
            j.jsxAttribute(j.jsxIdentifier("variant"), j.literal("outlined")),
          );
        }
        if (oldName === "Textarea") {
          parentElement.attributes.push(
            j.jsxAttribute(
              j.jsxIdentifier("multiline"),
              j.jsxExpressionContainer(j.booleanLiteral(true)),
            ),
          );
          parentElement.attributes.push(
            j.jsxAttribute(j.jsxIdentifier("rows"), j.jsxExpressionContainer(j.numericLiteral(4))),
          );
        }
      } else {
        // Remove the element if newName is null (e.g., SelectValue)
        j(path.parentPath.parentPath).remove();
      }
    });
  });

  // 3. Handle Checkbox/Switch + Label pattern -> FormControlLabel
  root.find(j.JSXElement, { openingElement: { name: { name: "Checkbox" } } }).forEach((path) => {
    const nextSibling = path.nextSibling;
    if (
      nextSibling &&
      nextSibling.type === "JSXElement" &&
      nextSibling.openingElement.name.name === "InputLabel"
    ) {
      const checkboxId = path.node.openingElement.attributes.find(
        (a) => a.name && a.name.name === "id",
      )?.value.value;
      const labelFor = nextSibling.openingElement.attributes.find(
        (a) => a.name && a.name.name === "htmlFor",
      )?.value.value;

      if (checkboxId && checkboxId === labelFor) {
        muiImportsNeeded.add("FormControlLabel");
        const labelText = j(nextSibling)
          .find(j.JSXText)
          .nodes()
          .map((t) => t.value.trim())
          .join("");

        const formControlLabel = j.jsxElement(
          j.jsxOpeningElement(
            "FormControlLabel",
            [
              j.jsxAttribute(j.jsxIdentifier("control"), j.jsxExpressionContainer(path.node)),
              j.jsxAttribute(j.jsxIdentifier("label"), j.literal(labelText)),
            ],
            true,
          ),
        );

        j(path).replaceWith(formControlLabel);
        j(nextSibling).remove();
      }
    }
  });
  // Repeat for Switch
  root.find(j.JSXElement, { openingElement: { name: { name: "Switch" } } }).forEach((path) => {
    const nextSibling = path.nextSibling;
    if (
      nextSibling &&
      nextSibling.type === "JSXElement" &&
      nextSibling.openingElement.name.name === "InputLabel"
    ) {
      const switchId = path.node.openingElement.attributes.find(
        (a) => a.name && a.name.name === "id",
      )?.value.value;
      const labelFor = nextSibling.openingElement.attributes.find(
        (a) => a.name && a.name.name === "htmlFor",
      )?.value.value;

      if (switchId && switchId === labelFor) {
        muiImportsNeeded.add("FormControlLabel");
        const labelText = j(nextSibling)
          .find(j.JSXText)
          .nodes()
          .map((t) => t.value.trim())
          .join("");

        const formControlLabel = j.jsxElement(
          j.jsxOpeningElement(
            "FormControlLabel",
            [
              j.jsxAttribute(j.jsxIdentifier("control"), j.jsxExpressionContainer(path.node)),
              j.jsxAttribute(j.jsxIdentifier("label"), j.literal(labelText)),
            ],
            true,
          ),
        );

        j(path).replaceWith(formControlLabel);
        j(nextSibling).remove();
      }
    }
  });

  // 4. Add the new MUI import and remove all old ones
  if (muiImportsNeeded.size > 0) {
    const newImport = j.importDeclaration(
      Array.from(muiImportsNeeded)
        .sort()
        .map((name) => j.importSpecifier(j.identifier(name))),
      j.literal("@mui/material"),
    );
    oldImports.at(0).insertBefore(newImport);
  }
  oldImports.remove();

  return root.toSource({ quote: "single", trailingComma: true });
};
