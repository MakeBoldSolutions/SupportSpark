# SupportSpark Documentation Guide

This repository uses the DevSpark documentation layout so durable product knowledge, feature work, and session output stay separated.

## Directory Map

| Path | Purpose | What belongs here |
| --- | --- | --- |
| `.documentation/memory/` | Governance memory | Constitution and long-lived operating rules |
| `.documentation/domain/` | Product and system knowledge | Architecture, deployment, data model, API surface, site map, development patterns |
| `.documentation/decisions/` | Architecture decision records | One document per decision with context, choice, and consequences |
| `.documentation/specs/` | Feature workspaces | Active feature specs, plans, research, contracts, tasks, and gates |
| `.documentation/copilot/session-YYYY-MM-DD/` | Session output | Copilot-authored investigations, reviews, migration notes, and one-off reports |
| `.documentation/commands/` | Team command overrides | Custom DevSpark command instructions |
| `.documentation/scripts/` | Team script overrides | Repository-specific DevSpark helper scripts |
| `.documentation/templates/` | Team template overrides | Customized spec, plan, task, and checklist templates |
| `.documentation/repo-story/` | Historical narrative | Repository history snapshots and story artifacts |
| `.archive/` | Historical archive | Completed and historical docs. Do not read from here during normal operations. |

## Current Canonical Documents

### Governance

- `.documentation/memory/constitution.md`: project rules and quality gates.

### Domain

- `.documentation/domain/product-overview.md`: site purpose, roles, and primary journeys.
- `.documentation/domain/site-map.md`: route inventory, page ownership, and UI map.
- `.documentation/domain/api-surface.md`: current HTTP endpoints and contract coverage.
- `.documentation/domain/data-model.md`: shared entities and file-storage layout.
- `.documentation/domain/architecture.md`: high-level architectural design.
- `.documentation/domain/development-patterns.md`: implementation conventions.
- `.documentation/domain/deployment-iis.md`: IIS deployment runbook.
- `.documentation/domain/UPGRADE_PLAN.md`: dependency upgrade roadmap.

## Working Rules

1. Put long-lived product knowledge in `.documentation/domain/`.
2. Put feature-specific planning in `.documentation/specs/<feature-id>/`.
3. Put ephemeral AI-generated analysis in `.documentation/copilot/session-YYYY-MM-DD/`.
4. Add ADR-style records to `.documentation/decisions/` when a decision needs durable rationale.
5. Keep README short; link to this guide and the domain documents for deeper detail.

## How To Use

- DevSpark stock command prompts resolve from `.devspark/defaults/commands/`.
- Team command overrides belong in `.documentation/commands/`.
- Team script overrides belong in `.documentation/scripts/`.
- Feature work should create artifacts under `.documentation/specs/<feature-id>/`.
- Copilot-generated one-off analysis belongs under `.documentation/copilot/` only while it is current.

## Recommended Next Documents

- Add ADRs in `.documentation/decisions/` when storage, auth, or routing strategy changes materially.
- Create new feature folders in `.documentation/specs/` instead of adding planning notes to domain docs.
- Archive completed or stale spec folders to `.archive/.documentation/specs/` after release.