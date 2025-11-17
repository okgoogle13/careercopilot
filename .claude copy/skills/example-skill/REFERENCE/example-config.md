# Example Configuration

## Required Fields

```yaml
required:
  - name
  - version
  - description
```

## Optional Fields

```yaml
optional:
  tags: []  # List of strings
  config:   # Nested configuration
    enabled: true
    timeout: 30s
    max_retries: 3
```
