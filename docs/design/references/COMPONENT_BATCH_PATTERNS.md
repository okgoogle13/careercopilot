# Component Batch Patterns

Reference guide for common batch processing scenarios in the Kerala Rage design workflow.

## 1. The "Sprint Starter" (New Components)
**Scenario**: Beginning a sprint with 3-5 new features.
**Batch Type**: Pure Creation (`mode: new`)

```json
{
  "batch_id": "sprint-25-onboarding",
  "components": [
    {
      "name": "OnboardingCarousel",
      "mode": "new",
      "context": "Main swipable container for user welcome flow"
    },
    {
      "name": "PreferenceToggle",
      "mode": "new",
      "context": "Custom switch for user settings"
    },
    {
      "name": "ProgressStepper",
      "mode": "new",
      "context": "Visual indicator of onboarding steps"
    }
  ]
}
```

## 2. The "Legacy Migration" (Refactoring)
**Scenario**: Updating older Material 2 or custom components to Northcote M3.
**Batch Type**: Pure Migration (`mode: migrate`)

```json
{
  "batch_id": "migration-auth-forms",
  "components": [
    {
      "name": "LoginForm",
      "mode": "migrate",
      "context": "Update inputs and buttons to M3 density and tokens"
    },
    {
      "name": "RegisterForm",
      "mode": "migrate",
      "context": "Ensure validation errors use new error-state tokens"
    },
    {
      "name": "SocialLoginRow",
      "mode": "migrate",
      "context": "Replace icon buttons with M3 standard variations"
    }
  ]
}
```

## 3. The "Hybrid Feature" (Mixed)
**Scenario**: Building a feature that needs new components but relies on updating an existing shared one.
**Batch Type**: Mixed (`mode: new` + `mode: migrate`)

```json
{
  "batch_id": "feature-paywall",
  "components": [
    {
      "name": "SubscriptionCard",
      "mode": "new",
      "context": "New pricing tier display"
    },
    {
      "name": "PaymentModal",
      "mode": "migrate",
      "context": "Update existing modal to support new subscription props"
    }
  ]
}
```

## Best Practices

### Batch Size
*   **Optimal**: 3-5 Components.
*   **Max**: 8 Components (Risk of cognitive load during review gates).
*   **Min**: 2 Components (Below this, use single-component workflow).

### Dependency Management
*   Do not include interdependent components (e.g., Parent + Child) in the same batch if the Child strictly depends on the Parent's *new* API being finished first.
*   **Workaround**: Batch the leaf nodes (Children) first, then batch the containers (Parents) in a subsequent run.
