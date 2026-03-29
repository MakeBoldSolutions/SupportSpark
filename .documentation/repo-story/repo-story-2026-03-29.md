# Repository Story: SupportSpark

> Generated 2026-03-29 | Window: 12 months | Scope: full
>
> Enriched with author narrative from [The Birth of SupportSpark: A Compassionate Tech Journey](https://markhazleton.com/blog/the-birth-of-supportspark-a-compassionate-tech-journey)

## Executive Summary

SupportSpark is a lightweight, privacy-focused support network platform born from a simple observation: when someone is going through a tough time — an illness, a loss, a major life change — every existing tool for sharing updates comes loaded with baggage. Ads, algorithms, engagement optimization, and commercial platforms that treat difficult moments as content to drive metrics. SupportSpark asks whether we can build something simpler — a clean, focused process where one person posts an update and everyone who needs to see it just sees it.

The project launched on **February 1, 2026** and has accumulated **42 commits** across **55 days** of active development by **2 contributors**. Built with React 19, Express 5, and TypeScript in strict mode, the codebase reflects a deliberate philosophy: start simple, earn complexity through demonstrated need, and resist the urge to add features that don't serve the core use case.

Development velocity has been steady — **25 commits in February** during the initial build-out, followed by **17 commits in March** focused on dependency maintenance, documentation normalization, and infrastructure hardening. The project has processed **7 merged pull requests**, including a major audit-compliance PR that touched 138 files with 19,478 additions. This pattern — intensive early construction followed by careful maintenance — signals a project that built its foundation deliberately and is now stabilizing for production readiness.

Governance is unusually mature for a project this young. A 10-principle constitution was documented before any code was written, conventional commits account for **100% of authored messages** (28 of 28 non-merge commits), and the project uses spec-driven development with formal specification, planning, and task-tracking artifacts. There are no tagged releases yet, reflecting the project's pre-production status — it's in beta, with a [live preview on GitHub Pages](https://markhazleton.github.io/SupportSpark/) using localStorage to demonstrate the full UI experience without a backend.

SupportSpark is part of the author's **Spark series** of projects — alongside ArtSpark, MuseumSpark, and TeachSpark — each exploring a focused problem with a lightweight solution. Its constraint is its entire point: no public feed, no follower counts, no sharing buttons, no recommendation engine. The person at the center controls who's in and who's out.

## The Origin Story

> *"When someone is going through a tough time, there's an immediate coordination problem. Friends and family want to know what's happening. The person at the center doesn't have the energy to send individual updates to thirty different people."*

The concept is deliberately narrow. A member creates a "journey" — a named context for their situation. They post updates when they have something to share. Supporters who've been invited can read those updates and leave responses in threaded conversations. That's essentially it. No public feed. No engagement metrics. No algorithmic amplification.

This design philosophy drove every technical decision in the repository. The commit history tells the story of a project that made its architectural decisions *before* writing code, then executed with discipline.

## Technical Analysis

### Development Velocity

The repository spans 55 days of history, from February 1 to March 29, 2026.

| Month | Commits | Character |
|-------|---------|-----------|
| 2026-02 | 25 | Foundation building — core features, audit compliance, static preview |
| 2026-03 | 17 | Stabilization — dependency upgrades, documentation, infrastructure |

**February** was the construction phase. The first day alone (Feb 1) produced 12 commits — from the initial server-side static file serving through security hardening, IIS deployment guides, ESLint configuration, and environment variable management. By Feb 2, PR #1 (audit-compliance-fixes) landed: **138 files changed, 19,478 additions, 4,171 deletions**. This single merge represents the bulk of the application's core implementation.

The last week of February (Feb 24) delivered the **static preview alpha** (PR #3): 73 files changed, 4,854 additions. This gave the project its GitHub Pages demo — a complete UI experience running entirely in the browser with localStorage.

**March** shifted to maintenance and hardening. Dependabot contributed dependency bumps for rollup, minimatch, multer, express-rate-limit, flatted, picomatch, and path-to-regexp. The Lead Architect focused on documentation normalization, harvesting completed specs into the changelog, and implementing a local storage adapter for user data management.

The **churn ratio** is characteristic of greenfield development with deliberate refactoring: the audit-compliance merge alone shows significant additions outpacing deletions, while later commits show balanced changes as the codebase matures.

### Contributor Dynamics

| Role | Commits | Percentage |
|------|---------|------------|
| Lead Architect | 35 | 83.3% |
| Developer A | 7 | 16.7% |

This is fundamentally a **solo-developer project with automated assistance**. Developer A's 7 commits are exclusively Dependabot dependency bumps (rollup, minimatch, multer, express-rate-limit, flatted, picomatch, path-to-regexp). All architectural decisions, feature implementation, testing, and documentation come from the Lead Architect.

**Bus factor: 1.** The entire domain knowledge and implementation capability rests with a single contributor. This is appropriate for a personal project in beta, but would need addressing before any team expansion.

The Lead Architect's contribution pattern shows focused development sessions:
- **Feb 1**: 12 commits in a single day (initial buildout)
- **Feb 24**: 6 commits (static preview sprint)
- **Mar 29**: 10 commits (dependency maintenance + documentation cleanup)

This "burst" pattern is typical of a project where the primary developer has dedicated blocks of time rather than continuous daily commits.

### Quality Signals

**Commit Message Quality:**
- 28 of 28 authored commits (non-merge) use **conventional commit prefixes** — a 100% adoption rate
- Prefix distribution: `feat:` (21), `build:` (6), `docs:` (3), `chore:` (2), `fix:` (2)
- The dominance of `feat:` commits reflects the project's construction phase
- 1 commit references a spec document, showing spec-driven development traces

**Testing:**
- **7 test-related commits** are recorded in the history
- Test files exist for routes (`routes.test.ts`), storage (`storage.test.ts`), and React hooks (`use-auth.test.tsx`, `use-supporters.test.tsx`)
- The constitution mandates tests for every feature (Principle II: NON-NEGOTIABLE)
- Vitest is configured as the test runner with a dedicated `vitest.config.ts`

**File Type Distribution** (by touch frequency):
| Type | Touches | Interpretation |
|------|---------|----------------|
| `.md` | 234 | Heavy documentation investment — specs, constitution, plans |
| `.json` | 225 | Data files + package management (users, conversations, package-lock) |
| `.tsx` | 153 | Frontend component development |
| `.ts` | 73 | Backend + shared TypeScript code |
| `.ps1` | 35 | PowerShell deployment and automation scripts |

The **documentation-to-code ratio** is striking. Markdown files are the most-touched file type, reflecting the spec-driven development approach described in the blog: *"Every technical choice was documented with rationale before implementation."*

### Governance & Process Maturity

**PR Workflow:**
- **7 merged pull requests** in 42 total commits
- PR #1: `001-audit-compliance-fixes` (138 files, 23,649 total lines changed)
- PR #3: `002-static-preview-alpha` (73 files, 5,437 total lines changed)
- PRs #4–9: Dependabot dependency bumps (automated)
- This shows a disciplined branch-per-feature workflow for significant changes, with automated dependency management

**Constitution:**
- A formal constitution exists at `.documentation/memory/constitution.md` (v1.3.0)
- 10 core principles documented, 6 marked NON-NEGOTIABLE
- The constitution was created *before* the first feature commit — a governance-first approach rarely seen in projects this size

**Spec-Driven Development:**
- 4 archived specification directories under `.documentation/specs/`
- Specs include formal `spec.md`, `plan.md`, `tasks.md`, and implementation checklists
- This is far more process maturity than typical for a 42-commit project

**Tag Discipline:**
- **0 tagged releases** — the project hasn't cut a formal version yet
- This aligns with the author's stated position: *"The honest answer is: it depends on whether people actually use it."*

### Architecture & Technology

**Language & Framework Signals:**
- TypeScript (strict mode) as the primary language
- React 19 with functional components for the frontend
- Express 5 for the backend API
- Vite for build tooling
- Tailwind CSS for styling

**Configuration Maturity:**
| Signal | Present | Notes |
|--------|---------|-------|
| `package.json` | ✅ | npm-based dependency management |
| `Dockerfile` | ✅ | Container deployment option available |
| GitHub Actions | ✅ | CI pipeline configured |
| TypeScript strict | ✅ | Enforced via constitution |
| ESLint | ✅ | Configured for TypeScript + React |
| Vitest | ✅ | Dedicated test configuration |
| `web.config` | ✅ | IIS deployment ready |

**Deployment Target — Windows + IIS:**
The blog describes this as a deliberate choice: *"Most modern web tutorials assume Linux and Docker. SupportSpark targets Windows Server with IIS — partly because that's the existing infrastructure, partly to see what the developer experience looks like in 2026."* CommonJS builds, `web.config` files, and PowerShell deployment scripts (35 `.ps1` file touches) support this.

**Data Storage:**
File-based JSON storage (`data/` directory with `users.json`, `conversations.json`, `supporters.json`, `quotes.json`). The blog explains: *"File-based storage instead of Postgres. No real-time WebSocket notifications. No image uploads. Every feature request gets filtered through 'does this serve the core use case?'"*

## Change Patterns

**Top Modified Files:**

| File | Changes | Significance |
|------|---------|-------------|
| `package-lock.json` | 13 | Frequent dependency updates (Dependabot + manual) |
| `package.json` | 9 | Dependency additions during buildout |
| `data/users.json` | 8 | Active user data during development/testing |
| `data/conversations/meta.json` | 7 | Conversation metadata evolving with features |
| `specs/001-audit-compliance-fixes/tasks.md` | 7 | Iterative task tracking during compliance sprint |
| `.github/copilot-instructions.md` | 6 | AI-assisted development configuration evolving |
| `server/storage.ts` | 5 | Core storage layer refinement |
| `client/src/pages/Home.tsx` | 5 | Main landing page iterations |
| `server/index.ts` | 5 | Express server entry point evolution |
| `README.md` | 5 | Documentation keeping pace with features |

**Key Patterns:**

1. **Spec files are hotspots** — `tasks.md` (7 changes), `plan.md` (6 changes), `spec.md` (4 changes) for the audit compliance spec show the spec-driven workflow in action, with plans and tasks being updated as implementation progressed.

2. **Data files churn** — `users.json` (8), `conversations/meta.json` (7), `supporters.json` (6) reflect active testing with real-ish data during development. This is expected for file-based storage where the data files are versioned.

3. **Agent configuration is active** — Multiple `.github/agents/*.agent.md` files show 4–5 changes each, indicating active refinement of AI-assisted development workflows (Spec Kit Spark framework).

4. **Frontend page churn is moderate** — `Home.tsx` (5), `Demo.tsx` (4), `Dashboard.tsx` (4), `Auth.tsx` (4) suggest the UI reached stability relatively quickly after initial implementation.

5. **80%+ of application changes concentrate in `client/`, `server/`, `shared/`, and `data/`** — the active development core. Documentation and spec files form a parallel, equally active track.

## Milestone Timeline

The project has **no tagged releases** yet. However, the commit and PR history reveals clear informal milestones:

| Date | Event | Evidence |
|------|-------|----------|
| 2026-02-01 | **Project Genesis** | First commit: server-side static file serving and storage management. 12 commits in one day establish the foundation — security docs, IIS deployment, ESLint, environment variables. |
| 2026-02-02 | **PR #1: Audit Compliance** | 138 files changed, 19,478 additions. The application's core — authentication, journeys, conversations, supporter management — lands as a single, audited PR. |
| 2026-02-03 | **Testing & Documentation Sprint** | Tests for Auth, Dashboard, and Supporters pages. File storage tests. Documentation path refactoring. |
| 2026-02-24 | **PR #3: Static Preview Alpha** | 73 files changed. GitHub Pages deployment with localStorage-only operation. The project becomes publicly demonstrable. |
| 2026-02-25 | **Blog Post Published** | [The Birth of SupportSpark](https://markhazleton.com/blog/the-birth-of-supportspark-a-compassionate-tech-journey) announces the project to the author's audience. |
| 2026-02-28 – 03-21 | **Dependency Maintenance Window** | Dependabot opens PRs for rollup, minimatch, multer, express-rate-limit, flatted, picomatch, path-to-regexp. |
| 2026-03-29 | **Spring Maintenance Session** | 10 commits: merge all pending Dependabot PRs, implement local storage adapter, update dependencies, normalize documentation, harvest completed specs. |

**Velocity around milestones:**
- The Feb 1–2 burst (13 commits in 2 days) represents the core construction sprint
- Feb 24 (6 commits) is the static preview delivery sprint
- A **3-week quiet period** (Feb 25 – Mar 28) where only Dependabot commits appeared — consistent with the author's stated "it depends on whether people actually use it" approach
- Mar 29 saw renewed activity with cleanup, dependency merges, and documentation

## Constitution Alignment

The project constitution (v1.3.0) defines 10 principles. Here's how the commit history reflects stated values:

### Strong Alignment ✅

| Principle | Evidence |
|-----------|----------|
| **I. Type Safety** | TypeScript strict mode enforced. Zod schemas in `shared/schema.ts`. Path aliases configured. No evidence of `any` type escape hatches in commit subjects. |
| **VII. Code Style** | ESLint configured on day 1 (commit `72870d3`). 100% conventional commit adoption. Consistent formatting across the codebase. |
| **VIII. Data Storage** | JSON file-based storage used throughout — exactly what the constitution prescribes for alpha/beta phases. No premature database migration. |
| **IX. Deployment** | IIS deployment guide and PowerShell automation script added on day 1 (commit `dae5eaf`). `web.config` present. CommonJS build output configured. 35 `.ps1` file touches show active automation investment. |
| **X. Simplicity First** | The entire project philosophy embodies YAGNI. No WebSockets, no image uploads, no database, no caching layer. As the blog states: *"Every feature request gets filtered through 'does this serve the core use case?'"* |

### Moderate Alignment ⚠️

| Principle | Evidence | Gap |
|-----------|----------|-----|
| **II. Testing** | 7 test-related commits. Test files for hooks, routes, and storage. Vitest configured. | Test commits are concentrated in Feb 2–3 and Feb 24. March shows no test-related commits — testing may not be keeping pace during maintenance phase. |
| **III. UI Components** | shadcn/ui and Tailwind CSS in use. Framer Motion present. | Component library discipline is hard to assess from commit metadata alone. |
| **V. API Contracts** | `shared/routes.ts` modified 4 times. Contracts exist. | Constitution allows prototyping exceptions — appropriate for current phase. |
| **VI. State Management** | TanStack React Query hooks present (`use-auth.ts`, `use-supporters.test.tsx`). | Adoption level consistent with constitution's RECOMMENDED status. |

### Gaps to Watch 🔍

| Principle | Concern |
|-----------|---------|
| **IV. Security** | Constitution outlines a progressive security timeline (alpha → beta → production). The audit-compliance PR addressed alpha requirements (bcrypt, env variables). Rate limiting and CSRF protection should be verified before public deployment. The blog confirms this progressive approach: *"Alpha: bcrypt and environment variables. Beta: add rate limiting. Production: full CSRF protection."* |
| **Releases** | Zero tagged releases despite a functioning beta with a public preview. Cutting a `v0.1.0-beta` would formalize the current state and enable governance tracking. |

### Overall Assessment

The commit history strongly reflects the constitution's values. The governance-first approach — writing the constitution before code, using spec-driven development, maintaining 100% conventional commit discipline — is exceptional for a project of this size and age. The "Simplicity First" principle (X) is perhaps the best-evidenced across the entire history: every architectural choice favors the minimal viable solution.

---

## Key Takeaways

**Strongest Signal:** Governance maturity far exceeding project age — a constitution, spec-driven development, and 100% conventional commit adoption in a 42-commit repository demonstrate that process discipline scales down effectively.

**Most Distinctive Choice:** Targeting Windows + IIS deployment in 2026, with 35 PowerShell script touches and a production `web.config`, while the rest of the Node.js ecosystem assumes Linux containers.

**Biggest Risk:** Single-contributor bus factor (83.3% of commits from Lead Architect). All domain knowledge, architectural decisions, and implementation capability rest with one person.

**Blog ↔ Code Alignment:** The blog post narrative and the commit history tell the same story. Claims made in the blog ("constitution before code," "file-based storage," "three weeks to working application," "progressive security") are all directly verified by the commit timeline and change patterns.

**Recommended Next Steps:**
1. Cut a `v0.1.0-beta` tag to formalize the current state
2. Verify rate limiting and CSRF protection are in place before wider beta access
3. Run `speckit.site-audit` for a code-quality deep dive beyond commit metadata

---
*Generated by /speckit.repo-story | Spec Kit Spark — Adaptive System Life Cycle Development*
