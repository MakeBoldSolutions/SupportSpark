# Quickstart Guide: Static Preview Alpha

**Feature**: 002-static-preview-alpha  
**Date**: 2026-02-24  
**For**: Developers, Designers, Stakeholders

## Overview

This guide walks through building, running, and deploying the static preview version of SupportSpark. The preview runs entirely in the browser with no backend server — all data is stored in localStorage.

## Prerequisites

- Node.js 18+ and npm 8+
- Git
- A GitHub account with push access to `markhazleton/SupportSpark`

## Quick Setup (3 Minutes)

### 1. Clone and Switch Branch

```bash
cd C:\GitHub\MarkHazleton\SupportSpark
git checkout 002-static-preview-alpha
npm install
```

### 2. Run Local Development Server

```bash
npm run dev:static
```

Opens at `http://localhost:5173/SupportSpark/` with hot module replacement. All data stored in browser localStorage.

### 3. Build Static Site

```bash
npm run build:static
```

Output: `dist-static/` folder containing a fully self-contained static site.

### 4. Preview Built Site Locally

```bash
npx vite preview --config vite.config.static.ts
```

Opens at `http://localhost:4173/SupportSpark/` — exactly what GitHub Pages will serve.

## Development Workflow

### Key npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev:static` | Start dev server with static config |
| `npm run build:static` | Build static site for GitHub Pages |
| `npm test` | Run all tests |
| `npm run type-check` | TypeScript compilation check |
| `npm run lint` | ESLint check |

### File Structure (What to Edit)

| File | Purpose |
|------|---------|
| `client/src/lib/local-storage-adapter.ts` | localStorage CRUD — the core data layer |
| `client/src/lib/seed-data.ts` | Pre-seeded demo content |
| `client/src/components/preview-banner.tsx` | "Preview Alpha" banner + storage warning |
| `client/src/hooks/use-auth.ts` | Auth hook (uses adapter) |
| `client/src/hooks/use-conversations.ts` | Conversations hook (uses adapter) |
| `client/src/hooks/use-supporters.ts` | Supporters hook (uses adapter) |
| `vite.config.static.ts` | Vite build config for GitHub Pages |
| `.github/workflows/deploy-preview.yml` | Auto-deploy workflow |

### Testing the Preview

1. **Fresh experience**: Open browser DevTools → Application → Local Storage → clear all `supportSpark_*` keys
2. **Register**: Go to auth page, register with any email/password
3. **Verify seed data**: Dashboard should show "My Journey" (1-2 conversations) and "Following" (1-2 conversations from Alex Rivera)
4. **Create content**: Click "New Update", create a conversation, post a reply
5. **Refresh test**: Refresh the page — all data should persist
6. **Storage warning**: In DevTools Console, run:
   ```js
   // Simulate near-full storage to test warning
   localStorage.setItem('filler', 'x'.repeat(4 * 1024 * 1024));
   ```
   The warning bar should appear. Remove with `localStorage.removeItem('filler')`.
7. **Reset test**: Click "Reset Demo Data" — should clear all data and redirect to registration

## Deployment

### Automatic (GitHub Actions)

Push to the `002-static-preview-alpha` branch (or `main` after merge) triggers automatic deployment:

1. GitHub Actions runs `npm ci` + `npx vite build --config vite.config.static.ts`
2. Uploads `dist-static/` as a Pages artifact
3. Deploys to `https://markhazleton.github.io/SupportSpark/`

**First-time setup**: Enable GitHub Pages in repo Settings → Pages → Source: "GitHub Actions".

### Manual (if needed)

```bash
npm run build:static
npx gh-pages -d dist-static    # or push dist-static/ contents to gh-pages branch
```

### Verify Deployment

1. Navigate to `https://markhazleton.github.io/SupportSpark/`
2. Verify the "Preview Alpha" banner is visible
3. Register and test the full flow
4. Open DevTools Network tab — verify zero API calls to external servers
5. Check Console — verify zero errors

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page on GitHub Pages | Ensure `base: "/SupportSpark/"` in vite.config.static.ts matches repo name |
| Routes return 404 | Verify hash-based routing is active (URLs should start with `/#/`) |
| Data lost on refresh | Check localStorage isn't blocked (some strict privacy settings block it) |
| "Storage unavailable" warning | User is in private/incognito mode — localStorage is restricted |
| Build fails with import errors | Run `npm install` — shared/ schemas are resolved via path aliases |
| GitHub Actions fails | Check repo Settings → Actions → General → allow actions. Ensure Pages source is "GitHub Actions". |

## Validation Checklist

- [ ] Fresh browser shows registration page
- [ ] Registration creates user + seeds demo data
- [ ] Dashboard shows "My Journey" and "Following" sections with seed content
- [ ] New conversation creation works
- [ ] Reply to conversation works
- [ ] Supporter invitation works (auto-accepts, generates mock data)
- [ ] Logout preserves data, login restores session
- [ ] "Preview Alpha" banner visible on all authenticated pages
- [ ] "Reset Demo Data" clears everything and returns to registration
- [ ] Page refresh preserves all data
- [ ] No console errors related to API calls
- [ ] Build output is under 5MB
- [ ] GitHub Pages deployment loads and functions correctly
