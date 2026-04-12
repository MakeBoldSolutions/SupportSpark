# Repository Story: SupportSpark

> Generated 2026-04-12 | Window: 12 months | Scope: full

## Executive Summary

SupportSpark is a TypeScript application for private, supporter-centered communication during difficult life events. The repository combines a React 19 frontend, an Express 5 backend, JSON-backed storage, and a static preview path so the product can be explored both as a hosted web app and as a browser-only demo. The current README and package metadata show a product that is intentionally narrow: members post updates once, supporters follow along and respond, and the platform avoids the noise of public social software.

The repository is still young but no longer in its first construction burst. Over a 69-day history window, the project has accumulated 48 commits from 2 contributors, with the first commit on 2026-02-01 and the latest commit on 2026-04-12. The development record shows 25 commits in February, 18 in March, and 5 in April, which reads as a classic arc of initial build-out followed by stabilization, dependency maintenance, and documentation hardening.

Delivery evidence is strongest in pull request and merge history rather than in formal release tags. The repository has 8 merged pull requests, including one very large compliance-oriented merge at 23,649 total changed lines and a second substantial static preview merge at 5,437 total changed lines. There are still 0 tags, so SupportSpark looks like a maturing pre-release product rather than a formally versioned service.

Process maturity is high relative to the repository size. The commit history reports 32 conventional commits and 0 informal commits, a living constitution is present, and the documentation tree has been actively curated into durable domain guidance, archived artifacts, and repo-story records. In plain terms, this is a small project being run with more operational discipline than many larger teams apply.

## Technical Analysis

### Development Velocity

The monthly trend is front-loaded but not erratic. February accounts for 25 of 48 commits, March for 18, and April for 5, which suggests the product moved from initial implementation into a smaller maintenance cadence rather than stalling completely. The latest commit on 2026-04-12 shows that the repository is still active.

The largest delivery bursts were concentrated in a few merges. The audit-compliance pull request changed 138 files with 19,478 additions and 4,171 deletions, while the static preview pull request changed 73 files with 4,854 additions and 583 deletions. Those numbers indicate heavy early construction with significant follow-up refinement rather than a long series of small incremental changes.

Overall churn still looks like greenfield development with selective cleanup. Additions materially exceed deletions in the largest merges, while March and April activity shifted toward docs, dependency upgrades, and archive normalization. That pattern usually means the core feature set has been established and the team is investing in structure, clarity, and maintainability.

### Contributor Dynamics

The contributor census shows a highly concentrated ownership model. The Lead Architect accounts for 40 of 48 commits, or roughly 83.3% of the repository history, while Developer A accounts for 8 of 48 commits, or roughly 16.7%. That is effectively a bus factor of 1 for product intent and architectural continuity.

The month-by-month split reinforces that interpretation. The Lead Architect contributed 23 commits in February, 13 in March, and 4 in April, while Developer A contributed 2, 5, and 1 respectively. The secondary contributor pattern matches dependency automation and maintenance help more than shared product ownership.

For a product at this stage, this is workable but important. The repo is coherent because decision-making is centralized, but onboarding additional maintainers would still require transferring a large amount of context that currently lives with one primary contributor.

### Quality Signals

Commit hygiene is strong. The history reports 32 conventional commits and 0 informal commits, which implies 100% conventional formatting across authored commits tracked by the history script. Prefix distribution is still feature-heavy, with the subject estimates showing 21 feature commits, 7 CI or build commits, 6 docs commits, 2 fixes, and 2 chores.

Testing signals are mixed but credible. The history script reports 7 test-related commits, and the current repository contains 10 user-authored test files across server routes, storage, React hooks, client pages, and local-storage support modules. That is enough to show testing discipline exists, but not enough to conclude broad end-to-end coverage across every feature.

Documentation investment is unusually high. Markdown files are the most-touched file type at 331 touches, ahead of JSON at 232, TSX at 153, TypeScript at 73, and PowerShell at 50. That balance says SupportSpark is being developed as both a product and a governed artifact, with process, guides, and scripts evolving alongside the application code.

### Governance & Process Maturity

SupportSpark shows strong governance signals for a 48-commit repository. A constitution is present, there are 0 active specs and 4 archived spec directories, and the governance artifact count in the history snapshot is 2. That indicates the team has already moved some completed work out of active planning and into historical record, which is a sign of documentation maintenance rather than simple accumulation.

The pull request workflow is also visible. The repository has 8 merged pull requests, including feature work, compliance hardening, static preview delivery, and dependency maintenance. Even without tag discipline, that merge structure shows the repository is not being managed as an unreviewed pile of direct commits.

The main governance gap is release formalization. There are still 0 tags, so the project has no durable release markers despite already having meaningful milestones in February, March, and April. That makes the changelog and repo-story documents more important because they are currently carrying most of the project history.

### Architecture & Technology

The technical stack is clear and modern. Current package metadata shows React 19, Express 5, TypeScript 6, Vite 8, Vitest 4, Tailwind CSS 4, TanStack React Query, Passport, bcrypt, multer, and Zod. The history snapshot also detects TypeScript, JavaScript, PowerShell, shell, markdown, and some Python usage in repository tooling, with `package.json`, GitHub Actions, and a Dockerfile all present.

The architecture remains intentionally simple. The repository keeps shared contracts and schemas under `shared/`, server code under `server/`, client code under `client/src/`, and file-backed data under `data/`. That lines up closely with the constitution's simplicity-first rule and with the product goal of staying lightweight enough to run both on IIS-backed Node hosting and as a static preview build.

Operational maturity is stronger than the application size alone would suggest. There are explicit scripts for development, build, static build, linting, formatting, type checking, test coverage, and full validation, plus a GitHub Pages deploy workflow. The repo therefore looks like a product being prepared for repeatable maintenance, not just a local prototype.

## Change Patterns

The hotspot list shows where the repository absorbs the most change:

| File | Changes | What It Suggests |
|------|---------|------------------|
| `package-lock.json` | 14 | Dependency churn remains the most frequent maintenance activity. |
| `package.json` | 10 | Tooling, scripts, and dependency definitions are still evolving. |
| `data/users.json` | 8 | Runtime fixture or sample data continues to change during product iteration. |
| `specs/001-audit-compliance-fixes/tasks.md` | 7 | The compliance sprint was managed actively through task tracking rather than only code edits. |
| `data/conversations/meta.json` | 7 | Conversation structure and seeded content have been refined multiple times. |

Two patterns stand out from the broader hotspot set. First, README and documentation files are still active change targets, with `README.md` at 6 changes and markdown as the dominant touched file type overall. Second, the active code hotspots are concentrated in foundational files such as `server/storage.ts`, `server/index.ts`, `shared/routes.ts`, `client/src/pages/Home.tsx`, and the data JSON files, which suggests the project is still refining its platform edges and core user flows rather than adding entirely new subsystems.

The hotspot list also points to complexity boundaries. `server/storage.ts`, `server/index.ts`, and the data metadata files are the places most likely to accumulate incidental complexity because they sit at the junction of persistence, bootstrapping, and demo-state behavior. Those are reasonable refactoring watchpoints if the project grows, but the current history still reads more like active product shaping than instability.

## Milestone Timeline

There are 0 tags in the history snapshot, so the repository does not yet have formal release milestones. The best available milestone narrative comes from major merges and recent documentation pivots.

| Date | Tag | Description |
|------|-----|-------------|
| 2026-02-01 | None | Project begins with the first feature commit adding server-side static file serving and storage management. |
| 2026-02-02 | None | Pull request #1 lands with 138 files changed and 23,649 total lines touched, establishing the core compliance-oriented foundation. |
| 2026-02-24 | None | Pull request #3 lands with 73 files changed and 5,437 total lines touched, delivering the static preview alpha path. |
| 2026-03-29 | None | Documentation normalization, spec harvest work, and the first repo story signal a shift from raw feature build-out to curation and maintenance. |
| 2026-04-12 | None | DevSpark updates, archive work, README clarification, and the repository story itself continue the move toward cleaner long-term project stewardship. |

Velocity clearly spiked before the February milestone merges and then tapered into maintenance. That is consistent with a repository that has already built its core experience and is now strengthening the surrounding process, deployment, and documentation systems.

## Constitution Alignment

The commit history reflects the constitution well, especially in areas where the principles are concrete and observable. TypeScript, Zod-based shared contracts, PowerShell deployment automation, file-backed storage, and disciplined project structure all align with the constitution's emphasis on type safety, deployment standards, and simplicity-first architecture.

Testing alignment is positive but partial. The repository clearly contains tests and test scripts, and the history shows 7 test-related commits, but the current evidence is stronger for unit and integration coverage in selected areas than for complete feature-level verification across the whole product. That means Principle II is visibly taken seriously, but the history alone does not prove exhaustive coverage.

The strongest alignment is with Principle X, simplicity first. The repository still centers JSON storage, a lightweight React plus Express architecture, and a limited feature surface focused on updates, supporters, and conversations. The absence of unnecessary subsystems is not a gap here; it is one of the clearest signs that the repository is following its own rules.

The clearest gap is release discipline. With 0 tags and no formal release markers in git history, the repository's operational maturity currently depends more on docs and changelog practice than on tagged delivery artifacts. If formal release management becomes important, that is the next governance layer to strengthen.

## Developer FAQ

### What does this project do?

SupportSpark is a private support-network platform for sharing journey updates with a trusted circle. The README describes it as a calm, distraction-free space where members post updates and supporters read and respond through threaded conversations. The code layout and package dependencies reinforce that model: a React frontend, an Express backend, shared schemas, and JSON-backed runtime data.

### What tech stack does it use?

The current stack is TypeScript-first across the repo, with React 19 and Vite on the client, Express 5 on the server, Tailwind CSS 4 for styling, Vitest for tests, Zod for schemas, Passport plus sessions for auth, bcrypt for password hashing, and TanStack React Query for server-state management. The history snapshot also detects PowerShell, shell, markdown, JavaScript, and some Python usage in tooling. GitHub Actions and a Dockerfile are both present, so the project supports more than one operational path.

### Where do I start?

Start with the README for setup and product context, then move into `server/index.ts`, `server/routes.ts`, `server/storage.ts`, `shared/schema.ts`, and `shared/routes.ts` to understand the backend contract and persistence model. On the frontend side, `client/src/App.tsx`, `client/src/pages/Home.tsx`, `client/src/pages/Dashboard.tsx`, and the hooks under `client/src/hooks/` are the fastest route into the user flows. The hotspot data backs this up because storage, server entry, shared routes, and core pages are among the most frequently changed files.

### How do I run it locally?

The repository uses npm scripts defined in `package.json`. The standard local development command is `npm run dev`, which starts the server through `tsx server/index.ts`, and the application is documented in the README as running on `http://localhost:5000`. For production-style output, use `npm run build` and `npm start`; for the static preview path, use `npm run build:static` or `npm run dev:static`.

### How do I run the tests?

Use `npm test` for the default Vitest run, `npm run test:ui` for the interactive UI, and `npm run test:coverage` for coverage output. The repository currently has 10 user-authored test files, including `server/routes.test.ts`, `server/storage.test.ts`, hook tests, page tests, and tests around the local-storage adapter and seed data. The broader validation path is `npm run validate`, which chains type checking, linting, format checks, and tests.

### What is the branching and PR workflow?

The history shows 8 merged pull requests across 48 commits, including major feature and maintenance merges plus dependency automation. That suggests a pull-request-based workflow on `main`, even though the repository does not yet use formal git tags for releases. In practice, the repo appears to rely on PR merges and changelog-style documentation more than on release tagging.

### Who do I ask when I'm stuck?

The contributor census makes the answer clear: ask the Lead Architect first. That role owns 40 of 48 commits, or roughly 83.3% of the repository history, so most architectural intent and project context sit there. Developer A contributes useful maintenance activity, but not enough of the total history to represent equal ownership.

### What areas of the code change most often?

The hottest areas are dependency metadata, seeded or runtime JSON data, and core platform files. `package-lock.json` has 14 changes, `package.json` has 10, `data/users.json` has 8, `specs/001-audit-compliance-fixes/tasks.md` has 7, and `data/conversations/meta.json` has 7. Among active application code, `server/storage.ts`, `server/index.ts`, `shared/routes.ts`, and `client/src/pages/Home.tsx` are the places to watch first.

### Are there coding standards I must follow?

Yes. The repository has a formal constitution, ESLint, Prettier, TypeScript checking, and a `validate` script that runs type checking, linting, format checks, and tests together. The history also shows 32 conventional commits and 0 informal commits, so commit messages are expected to follow conventional commit format rather than ad hoc wording.

### What version is currently released?

There is no formal git-tagged release in the repository history yet. The history snapshot reports 0 tags, so the best version signal comes from the changelog and the documented milestones such as the static preview alpha and the April archive and documentation cleanup work. If you need a precise release boundary, use the changelog until git tags are introduced.
