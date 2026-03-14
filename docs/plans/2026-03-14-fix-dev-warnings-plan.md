---
title: Fix dev server warnings and errors
type: fix
status: active
date: 2026-03-14
---

# Fix Dev Server Warnings and Errors

## Issues

1. **Port conflict**: "Unable to find an available port (tried 3000)" - Need to configure port or handle better
2. **CSS @import warning**: "@import must precede all other statements" - Google Fonts @import is in wrong position
3. **Punycode deprecation warning**: "The punycode module is deprecated"

## Solution

### Fix 1: Use Nuxt Fonts instead of manual CSS @import

Install @nuxt/fonts and remove the manual Google Fonts import from main.css.

```bash
bun add @nuxt/fonts
```

Update nuxt.config.ts:
```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/fonts'],
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' }
    ]
  }
})
```

Remove the @import line from main.css:
```css
/* Remove this line: */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

### Fix 2: Configure dev server port

In nuxt.config.ts, add:
```typescript
devServer: {
  port: 3000,
  strictPort: false,
}
```

Or use environment variable to find available port.

### Fix 3: Update Node.js or suppress punycode warning

The punycode warning is a Node.js deprecation. Can be suppressed in package.json:
```json
"overrides": {
  "undici": "^6.0.0"
}
```

Or update Node.js version.

## Files to Modify

- `nuxt.config.ts` - Add @nuxt/fonts module, configure devServer
- `assets/css/main.css` - Remove manual @import for Google Fonts

## Acceptance Criteria

- [ ] No more CSS @import warnings
- [ ] Dev server starts on port 3000 without conflict warnings
- [ ] Fonts still load correctly via Nuxt Fonts
