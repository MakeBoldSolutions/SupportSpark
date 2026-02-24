# Implementation Plan: Static Preview Alpha (Local-Storage Only)

**Branch**: `002-static-preview-alpha` | **Date**: 2026-02-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-static-preview-alpha/spec.md`

## Summary

Create a fully client-side version of SupportSpark that runs entirely from localStorage, with no backend API dependencies. The existing React UI (pages, components, hooks) is reused with the data layer swapped from HTTP API calls to a localStorage-backed storage adapter. The app builds as a static site and auto-deploys to GitHub Pages via GitHub Actions. A persistent "Preview Alpha" banner communicates the preview nature. Pre-seeded demo data populates both "My Journey" and "Following" sections on first registration.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode)  
**Primary Dependencies**: React 19, Vite 7, Wouter 3, TanStack React Query 5, shadcn/ui, Zod 4  
**Storage**: Browser localStorage (no server, no file-based JSON)  
**Testing**: Vitest with jsdom, React Testing Library  
**Target Platform**: GitHub Pages (static HTML/CSS/JS, no server runtime)  
**Project Type**: Web (client-only SPA)  
**Performance Goals**: < 5MB static build, instant localStorage reads  
**Constraints**: Offline-capable after initial load, single-user-per-browser, ~5MB localStorage limit  
**Scale/Scope**: 6 pages (Home, Auth, Dashboard, ConversationView, Supporters, Demo), 3 hooks to replace, 1 new storage adapter, 1 GitHub Actions workflow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Applies? | Status | Notes |
|-----------|----------|--------|-------|
| I. Type Safety | YES | ✅ PASS | Shared Zod schemas reused; localStorage adapter typed to same interfaces |
| II. Testing | YES | ✅ PASS | Tests included in tasks.md: localStorage adapter unit tests + hook integration tests |
| III. UI Components | YES | ✅ PASS | Existing shadcn/ui components reused; only new component is PreviewBanner |
| IV. Security | PARTIAL | ✅ PASS | No backend = no bcrypt/rate-limiting needed. Plaintext passwords acceptable per spec (client-only preview, documented in banner). Constitution IV timeline: this is pre-alpha preview. |
| V. API Contracts | N/A | ✅ PASS | No API — localStorage adapter replaces server routes. Shared schemas still used for validation. |
| VI. State Management | YES | ✅ PASS | React Query still used; queryFn implementations swapped to localStorage reads |
| VII. Code Style | YES | ✅ PASS | ESLint + Prettier enforced on new code |
| VIII. Data Storage | YES | ✅ PASS | localStorage is simpler than files — aligns with Principle X. No server needed. |
| IX. Deployment | MODIFIED | ✅ PASS (justified) | Target is GitHub Pages, not IIS. This is a preview deployment; production IIS deployment unchanged. See Complexity Tracking. |
| X. Simplicity First | YES | ✅ PASS | Core design principle of this feature — simplest possible deployment |

**Pre-research gate: PASSED** — no blocking violations.

## Project Structure

### Documentation (this feature)

```text
.documentation/specs/002-static-preview-alpha/
├── plan.md              # This file
├── spec.md              # Feature specification (complete)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (local storage adapter interface)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
client/
├── index.html                         # Entry point (unchanged)
├── src/
│   ├── App.tsx                        # MODIFIED: wrap with HashRouter, add PreviewBanner
│   ├── main.tsx                       # Entry (unchanged)
│   ├── components/
│   │   ├── preview-banner.tsx         # NEW: persistent alpha banner + storage indicator
│   │   ├── ui/                        # Existing shadcn/ui (unchanged)
│   │   └── ...                        # Existing components (unchanged)
│   ├── hooks/
│   │   ├── use-auth.ts                # MODIFIED: swap API calls → localStorage adapter
│   │   ├── use-conversations.ts       # MODIFIED: swap API calls → localStorage adapter
│   │   ├── use-supporters.ts          # MODIFIED: swap API calls → localStorage adapter
│   │   └── use-toast.ts               # Unchanged
│   ├── lib/
│   │   ├── local-storage-adapter.ts   # NEW: localStorage CRUD operations for all entities
│   │   ├── seed-data.ts               # NEW: pre-seeded demo conversations, users, supporters
│   │   ├── queryClient.ts             # MODIFIED: remove server fetch, use localStorage queryFn
│   │   └── utils.ts                   # Unchanged
│   └── pages/
│       ├── Home.tsx                   # MODIFIED: replace /api/quotes fetch with static import of bundled quote data
│       ├── Auth.tsx                   # Unchanged (form logic stays, auth hook handles storage)
│       ├── Dashboard.tsx              # Unchanged
│       ├── ConversationView.tsx       # Unchanged
│       ├── Supporters.tsx             # Unchanged
│       └── Demo.tsx                   # Unchanged
├── vite.config.static.ts              # NEW: static build config for GitHub Pages
└── public/                            # Unchanged

.github/
└── workflows/
    └── deploy-preview.yml             # NEW: GitHub Actions workflow for Pages deployment

shared/
├── schema.ts                          # Unchanged (Zod schemas reused client-side)
└── routes.ts                          # Referenced for types only, not for HTTP calls
```

**Structure Decision**: Client-only SPA. No server/ directory changes needed. The existing `client/src/` structure is preserved. New files are added for the localStorage adapter, seed data, preview banner, static Vite config, and GitHub Actions workflow. Hooks are modified in-place to swap their data source. Home.tsx is modified to replace the `/api/quotes` fetch with a static import of bundled quote data (FR-017).

## Complexity Tracking

> Deviation from Constitution IX (Deployment target is GitHub Pages instead of IIS)

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| IX. GitHub Pages instead of IIS | Preview-alpha needs zero-infrastructure hosting for stakeholder review | IIS requires Windows server setup, which defeats the purpose of a quick preview. Production IIS deployment is unchanged and unaffected. |
