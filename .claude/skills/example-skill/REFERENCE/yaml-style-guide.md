# YAML Style Guide

## Best Practices

### Basic Rules
- Use 2 spaces for indentation (no tabs)
- Use `key: value` format with a space after the colon
- Quote strings with special characters
- Use `-` for list items

### Example
```yaml
# Good
person:
  name: "John Doe"
  age: 30
  skills:
    - Python
    - JavaScript
    - YAML

# Bad
person: {name: John Doe, age: 30, skills: [Python, JavaScript, YAML]}
```

### Naming Conventions
- Use lowercase with hyphens for file names
- Use camelCase for keys
- Use UPPER_SNAKE_CASE for environment variables
