# Research: Static Preview Alpha (Local-Storage Only)

**Feature**: 002-static-preview-alpha  
**Date**: 2026-02-24  
**Status**: Complete — all unknowns resolved

## Research Tasks

### R1: Wouter Hash-Based Routing

**Decision**: Use Wouter's built-in `useHashLocation` hook  
**Rationale**: Wouter 3.9+ exports `useHashLocation` from `wouter/use-hash-location`. Pass it as the `hook` prop to `<Router>` — all existing `<Route>` and `<Link>` components work unchanged. URLs become `/#/dashboard`, `/#/conversation/1`, etc.

**Implementation pattern**:
```tsx
import { Router, Switch, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" ... />
      </Switch>
    </Router>
  );
}
```

**Alternatives considered**:
- 404.html fallback: Requires copying index.html → 404.html, causes brief 404 flash on direct navigation. Rejected for reliability.
- Basename prefix with history API: Cleaner URLs but needs server cooperation. GitHub Pages doesn't support it natively.

### R2: Vite Static Build Configuration for GitHub Pages

**Decision**: Create `vite.config.static.ts` extending the existing config with `base` set to `/<repo-name>/`  
**Rationale**: GitHub Pages serves project sites from `https://<user>.github.io/<repo>/`. Vite's `base` option prefixes all asset URLs. The existing `vite.config.ts` builds to `dist/public/`; the static config builds to `dist-static/` with no server-side output.

**Implementation pattern**:
```ts
// vite.config.static.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/SupportSpark/",  // GitHub Pages repo name
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist-static"),
    emptyOutDir: true,
  },
});
```

**Alternatives considered**:
- Reuse existing vite.config.ts with environment variable: More complex, risks breaking production build. Rejected for isolation.
- Build to `docs/` for GitHub Pages: Pollutes repo root. Rejected.

### R3: GitHub Actions Workflow for Pages Deployment

**Decision**: Use `actions/deploy-pages@v4` with `actions/upload-pages-artifact@v3`  
**Rationale**: This is GitHub's official Pages deployment path. The workflow builds with Vite, uploads the artifact, and deploys to Pages. Auto-triggers on push to the feature branch.

**Implementation pattern**:
```yaml
name: Deploy Preview to GitHub Pages
on:
  push:
    branches: [002-static-preview-alpha, main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx vite build --config vite.config.static.ts
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist-static }
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Alternatives considered**:
- Manual `gh-pages` branch push: Requires manual intervention. Rejected for automation requirement.
- Deploy on release tags only: Too slow for iterative preview feedback. Rejected.

### R4: localStorage Quota Detection (Storage Warning)

**Decision**: Use `navigator.storage.estimate()` with fallback to try/catch on writes  
**Rationale**: The Storage API (`navigator.storage.estimate()`) returns `{usage, quota}` for the origin. Most modern browsers support it. For older browsers, the adapter catches `QuotaExceededError` on write attempts. The 80% threshold triggers a warning banner.

**Implementation pattern**:
```ts
async function getStorageUsagePercent(): Promise<number> {
  if (navigator.storage?.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    if (quota && usage) return (usage / quota) * 100;
  }
  // Fallback: estimate from localStorage string length
  let total = 0;
  for (const key of Object.keys(localStorage)) {
    total += localStorage.getItem(key)?.length ?? 0;
  }
  // Assume 5MB limit (conservative), 2 bytes per char
  return (total * 2) / (5 * 1024 * 1024) * 100;
}
```

**Alternatives considered**:
- Silently ignore: Poor UX when writes fail. Rejected.
- Hard cap at 4MB: Over-restrictive for a preview site. Rejected.

### R5: localStorage Adapter Design Pattern

**Decision**: Single `LocalStorageAdapter` module with typed CRUD methods matching the existing API contract shapes  
**Rationale**: The hooks (`use-auth`, `use-conversations`, `use-supporters`) currently call `fetch()` against API endpoints. The adapter provides the same data shapes but reads/writes localStorage. Hooks swap their `queryFn` and `mutationFn` implementations. React Query still manages cache, loading states, and invalidation — only the data source changes.

**Key design decisions**:
- Storage keys: `supportSpark_users`, `supportSpark_conversations`, `supportSpark_supporters`, `supportSpark_session`
- All keys prefixed with `supportSpark_` to avoid collisions
- Data serialized as JSON strings
- IDs: Users get UUID strings, conversations get auto-incrementing numbers (matching existing schema), messages get UUID strings
- Seed data injected on first registration (check for `supportSpark_initialized` flag)

**Alternatives considered**:
- IndexedDB: More powerful but unnecessarily complex for this scope. Principle X: YAGNI.
- Service Worker with mock API: Would preserve fetch() calls but adds massive complexity. Rejected.
- sessionStorage: Does not persist across browser sessions. Rejected (FR-011 requires persistence).
