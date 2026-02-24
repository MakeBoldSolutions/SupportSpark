# Tasks: Static Preview Alpha (Local-Storage Only)

**Input**: Design documents from `/specs/002-static-preview-alpha/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included per constitution Principle II (NON-NEGOTIABLE). localStorage adapter unit tests and hook integration tests are in Phase 9.

**Organization**: Tasks grouped by user story (5 stories from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Configuration)

**Purpose**: Create static build configuration, npm scripts, and CI/CD workflow for GitHub Pages deployment.

- [ ] T001 Create static Vite build configuration with base "/SupportSpark/", React plugin, path aliases, root client/, and output to dist-static/ in vite.config.static.ts
- [ ] T002 [P] Add dev:static and build:static npm scripts referencing vite.config.static.ts to package.json
- [ ] T003 [P] Create GitHub Actions auto-deploy workflow with pages permissions, Node 20 setup, npm ci, Vite build, upload-pages-artifact, and deploy-pages steps in .github/workflows/deploy-preview.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer, seed data, preview UI, hash routing, and cleaned query client that MUST be complete before any user story hooks can be modified.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 [P] Create localStorage adapter implementing all 14 methods per contracts/local-storage-adapter.md — auth (register, login, logout, getCurrentUser), conversations (getConversations, getConversation, createConversation, addMessage), supporters (getSupporters, inviteSupporter, updateSupporterStatus), and storage management (getStorageUsagePercent, resetAllData, isStorageAvailable) — using supportSpark_ prefixed keys in client/src/lib/local-storage-adapter.ts
- [ ] T005 [P] Create seed data module with demo user Alex Rivera (seed-supporter-001), 2 "My Journey" conversations (Starting My Recovery Journey, Grateful for Small Wins), 2 "Following" conversations (Managing Daily Challenges, Finding Community Support), and bidirectional supporter relationships per data-model.md in client/src/lib/seed-data.ts
- [ ] T006 [P] Create preview banner component with persistent "Preview Alpha" notice visible on all pages (including Home and Auth per FR-003), passive storage usage warning at 80% threshold via navigator.storage.estimate() with fallback, and Reset Demo Data action calling adapter.resetAllData() — conditionally show Reset Demo Data button only when adapter.getCurrentUser() is non-null (unauthenticated visitors see banner text only) — in client/src/components/preview-banner.tsx
- [ ] T007 Modify client/src/App.tsx to wrap all routes with Router hook={useHashLocation} imported from wouter/use-hash-location and render PreviewBanner component on all pages (not just authenticated — FR-003 requires "every page")
- [ ] T007a [P] Modify client/src/pages/Home.tsx to replace the /api/quotes useQuery fetch with a static import of data/quotes.json bundled via Vite, preserving the existing quote carousel rotation logic (FR-017)
- [ ] T007b [P] Modify client/src/pages/Demo.tsx to replace server API calls (/api/demo/info, /api/demo/login/patient, /api/demo/login/supporter) and apiRequest import with localStorage adapter equivalents — demo login buttons call adapter.login() with pre-seeded credentials, demo info sourced from adapter data (SC-004 requires all 6 pages render correctly)
- [ ] T008 Modify client/src/lib/queryClient.ts to remove all server-dependent utilities — apiRequest(), getQueryFn(), and throwIfResNotOk (no remaining call sites after adapter swap) — preserving only the QueryClient instance

**Checkpoint**: Foundation ready — localStorage adapter, seed data, preview banner, hash routing, and cleaned queryClient are in place. User story hook modifications can now begin.

---

## Phase 3: User Story 1 — First-Time Visitor Registers and Explores (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor registers, sees seed demo data in both "My Journey" and "Following" sections, and explores the full interface without network requests.

**Independent Test**: Visit the site in a fresh browser, complete registration with email/name/password, verify dashboard shows seeded conversations in both sections. Refresh the page and confirm all data persists.

### Implementation for User Story 1

- [ ] T009 [US1] Modify client/src/hooks/use-auth.ts — replace register mutation to call adapter.register() with InsertUser data, replace user query to call adapter.getCurrentUser() synchronously, ensure first registration triggers seed data injection per data-model.md. Verify Zod validation errors (email format, password length per FR-016) surface correctly on the Auth page

**Checkpoint**: Registration flow works end-to-end. New users see seeded "My Journey" and "Following" content. Session persists across page refreshes.

---

## Phase 4: User Story 2 — User Creates and Manages Conversations (Priority: P1)

**Goal**: Logged-in users create conversations, view message threads, and post replies — all persisted via localStorage.

**Independent Test**: Log in, create a new conversation with title and message, verify it appears on dashboard under "My Journey", open it, post a reply message, navigate away and return to verify reply persists.

### Implementation for User Story 2

- [ ] T010 [US2] Modify client/src/hooks/use-conversations.ts — replace conversations list query with adapter.getConversations(), single conversation query with adapter.getConversation(id), create mutation with adapter.createConversation(), and add-message mutation with adapter.addMessage()

**Checkpoint**: Full conversation lifecycle (create → view → reply → persist) works entirely via localStorage.

---

## Phase 5: User Story 3 — User Manages Support Network (Priority: P2)

**Goal**: Users invite supporters by email, which auto-accept instantly with generated mock profiles and sample conversations.

**Independent Test**: Navigate to Supporters page, invite a supporter by email, verify supporter appears with "accepted" status and a generated mock user profile. Navigate to dashboard and confirm mock supporter's conversations appear in "Following".

### Implementation for User Story 3

- [ ] T011 [US3] Modify client/src/hooks/use-supporters.ts — replace supporters query with adapter.getSupporters(), invite mutation with adapter.inviteSupporter() which auto-accepts and generates mock user profile with sample conversations, and status mutation with adapter.updateSupporterStatus()

**Checkpoint**: Supporter invitation flow works. Auto-accept generates mock user profile and 1-2 sample conversations visible in "Following".

---

## Phase 6: User Story 4 — User Logs In and Out (Priority: P2)

**Goal**: Returning users log in with stored credentials and log out with session-only cleanup.

**Independent Test**: Register a user, log out, log back in with correct credentials (verify dashboard shows all previous data). Try logging in with wrong password and verify error. Verify logout clears session but preserves data.

### Implementation for User Story 4

- [ ] T012 [US4] Complete login and logout mutations in client/src/hooks/use-auth.ts — replace login mutation to call adapter.login() with email/password credential validation against localStorage, replace logout mutation to call adapter.logout() which clears session only while preserving all stored data. Verify Zod validation errors (email format per FR-016) surface correctly on the login form, not just generic "wrong credentials"

**Checkpoint**: Login validates against localStorage credentials (correct → dashboard, incorrect → error). Logout clears session only. Re-login restores full access to all data.

---

## Phase 7: User Story 5 — Static Site Deployment on GitHub Pages (Priority: P1)

**Goal**: Application builds as a fully static site and deploys to GitHub Pages with no server runtime, zero API errors, and correct hash-based routing.

**Independent Test**: Run npm run build:static, verify dist-static/ contains only client-side assets (index.html, JS, CSS). Preview with npx vite preview --config vite.config.static.ts. Verify all routes resolve via hash routing with no console errors.

### Implementation for User Story 5

- [ ] T013 [US5] Add .nojekyll marker file to client/public/.nojekyll to prevent GitHub Pages Jekyll processing of underscore-prefixed Vite asset files
- [ ] T014 [US5] Validate static build by running npm run build:static — confirm dist-static/ contains index.html with hash-based routing, no server-side artifacts, total output under 5MB, and all 6 pages (Home, Auth, Dashboard, ConversationView, Supporters, Demo) render without console errors per SC-004

**Checkpoint**: Static build produces clean client-only output under 5MB. GitHub Actions workflow in deploy-preview.yml is ready for auto-deployment on push.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validation, linting, and documentation improvements across all stories.

- [ ] T015 [P] Run TypeScript type-check (npm run type-check) and fix any errors in all modified and new files
- [ ] T016 [P] Run ESLint and Prettier (npm run lint) and fix style violations in all modified and new files
- [ ] T017 Run quickstart.md validation checklist to confirm all items pass across the complete application
- [ ] T018 Update README.md with preview-alpha section linking to the GitHub Pages URL https://markhazleton.github.io/SupportSpark/ and brief usage instructions

---

## Phase 9: Tests (Constitution Principle II)

**Purpose**: Automated tests for the localStorage adapter and modified hooks per constitution Principle II (NON-NEGOTIABLE: "All new features MUST have accompanying test files before merge").

- [ ] T019 [P] Create unit tests for localStorage adapter — test register (success + duplicate email), login (success + wrong password), logout, getCurrentUser, CRUD conversations, CRUD supporters, seed data injection on first registration, resetAllData, and isStorageAvailable in client/src/lib/local-storage-adapter.test.ts
- [ ] T020 [P] Create unit tests for seed data module — verify seed user, seed conversations (My Journey + Following), and bidirectional supporter relationships are created correctly in client/src/lib/seed-data.test.ts
- [ ] T021 [P] Create integration tests for use-auth hook — test register flow with React Query cache update, login/logout session management, and getCurrentUser restoration on mount in client/src/hooks/use-auth.test.ts
- [ ] T022 [P] Create integration tests for use-conversations hook — test getConversations returns own + supporter conversations, createConversation, and addMessage in client/src/hooks/use-conversations.test.ts
- [ ] T023 [P] Create integration tests for use-supporters hook — test getSupporters, inviteSupporter (auto-accept + mock user generation), and updateSupporterStatus in client/src/hooks/use-supporters.test.ts

**Checkpoint**: All tests pass. localStorage adapter and hooks verified automatically. Safe to merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–7)**: All depend on Foundational phase completion
  - US1, US2, US3, US5 can start in parallel after Foundational
  - US4 depends on US1 (T012 modifies same file as T009 — use-auth.ts)
- **Polish (Phase 8)**: Depends on all user stories being complete
- **Tests (Phase 9)**: Depends on Foundational (Phase 2) completion. Can run in parallel with user stories or after.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no dependencies on other stories
- **US2 (P1)**: Can start after Foundational — independent of US1
- **US3 (P2)**: Can start after Foundational — independent of US1/US2
- **US4 (P2)**: Depends on US1 completion (T009 modifies use-auth.ts first, T012 adds to same file)
- **US5 (P1)**: Can start after Foundational — validates build output independently

### Within Each User Story

- Single implementation task per story (hook modification or file operation)
- Each story's checkpoint verifies it works independently
- Story complete before moving to next priority

### Parallel Opportunities

#### Phase 1 (Setup)
```
T001 (vite config) → then:
  T002 (npm scripts) ║ T003 (GH Actions workflow)
```

#### Phase 2 (Foundational — new files in parallel, then sequential edits)
```
T004 (adapter) ║ T005 (seed data) ║ T006 (banner)
  → then sequentially:
    T007 (App.tsx hash routing + banner)
    T007a (Home.tsx quotes)  ║  T007b (Demo.tsx adapter swap)
    T008 (queryClient.ts cleanup)
```

#### Phases 3–7 (User story hooks — maximum parallelism)
```
After Foundational:
  T009 (US1: auth register)  ──→  T012 (US4: auth login/logout)
  T010 (US2: conversations)   ║
  T011 (US3: supporters)      ║
  T013 (US5: .nojekyll)       ║
  T014 (US5: build validation) ← after all other stories complete
```

#### Phase 9 (Tests — all in parallel after Phase 2)
```
T019 (adapter tests) ║ T020 (seed tests) ║ T021 (auth hook tests) ║ T022 (conv hook tests) ║ T023 (supporters hook tests)
```

#### Phase 8 (Polish)
```
T015 (type-check) ║ T016 (lint)
  → then:
    T017 (quickstart validation)
    T018 (README update)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T008) — CRITICAL, blocks all stories
3. Complete Phase 3: US1 — Registration + Explore (T009)
4. **STOP and VALIDATE**: Register in browser, verify seed data appears, verify persistence
5. Deploy preview if ready (run build:static, verify output)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Registration) → Test independently → Deploy (**MVP!**)
3. Add US2 (Conversations) → Test independently → Deploy
4. Add US3 (Supporters) → Test independently → Deploy
5. Add US4 (Login/Logout) → Test independently → Deploy
6. Add US5 (Build Validation) → Final deployment validation
7. Polish → Type-check, lint, README update
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (T009) → US4 (T012)
   - Developer B: US2 (T010)
   - Developer C: US3 (T011) + US5 (T013–T014)
3. Stories complete and integrate independently

---

## Notes

- **25 total tasks** across 9 phases covering 5 user stories + tests
- **[P] tasks** = different files, no unresolved dependencies — safe to parallelize
- **[Story] labels** map tasks to spec.md user stories (US1–US5) for traceability
- **Test tasks T019–T023** satisfy constitution Principle II (NON-NEGOTIABLE)
- Passwords stored as plaintext in localStorage — acceptable per spec for client-only preview
- All localStorage keys prefixed with `supportSpark_` per data-model.md
- Seed data IDs reserved in range 1–10; user-created IDs start at 100 per data-model.md
- Commit after each task or logical group for clean version history
