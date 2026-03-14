---
title: Replace Prettier with Nuxt ESLint
type: refactor
status: active
date: 2026-03-14
---

# Replace Prettier with Nuxt ESLint

## Overview

Replace Prettier with the new `@nuxt/eslint` module using ESLint v9 flat config. The project already has `@nuxt/eslint` installed but needs proper configuration to enable stylistic rules that replace Prettier's formatting functionality.

## Current State

- **@nuxt/eslint**: Already installed (^1.15.2)
- **eslint**: Version ^10.0.3 (old, needs upgrade to v9)
- **prettier**: Still installed (^3.8.1)
- **eslint.config.js**: Minimal config, only ignores

## Problem

1. ESLint v10 is installed but flat config requires ESLint v9
2. Prettier is still used for formatting but can be replaced with ESLint Stylistic
3. Format scripts in package.json still use Prettier

## Solution

1. Upgrade ESLint from v10 to v9
2. Configure `@nuxt/eslint-config` with flat config
3. Enable stylistic features to replace Prettier
4. Remove Prettier from dependencies
5. Update package.json scripts

## Implementation

### Step 1: Update Dependencies

```bash
# Remove Prettier, add ESLint v9
bun remove prettier eslint
bun add -D eslint@^9.0.0 @eslint/js
```

### Step 2: Update eslint.config.js

```javascript
// eslint.config.js
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: true
  }
})
```

### Step 3: Update package.json

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "eslint . --fix",
    "format:check": "eslint . --check"
  }
}
```

Remove:
- `"format": "prettier --write ."`
- `"format:check": "prettier --check ."`

## Files to Modify

- `package.json` - Remove prettier, update scripts
- `eslint.config.js` - Add Nuxt ESLint config with stylistic

## Acceptance Criteria

- [ ] ESLint v9 installed
- [ ] Prettier removed from dependencies
- [ ] eslint.config.js configured with Nuxt ESLint
- [ ] Format scripts use ESLint instead of Prettier
- [ ] `bun run lint` works
- [ ] `bun run format` works

## References

- [Nuxt ESLint Blog Post](https://nuxt.com/blog/eslint)
- [eslint.nuxt.com](https://eslint.nuxt.com)
- [@nuxt/eslint-config](https://github.com/nuxt/eslint/tree/main/packages/eslint-config)
