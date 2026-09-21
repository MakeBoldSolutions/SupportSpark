# Knowledge discovery — 2026-09-21

Scope: whole repository, `--bootstrap`. Installed using the main-branch payload required by the Codex quickstart; latest release stamp v4.3.0.

Created four high-confidence entities: supportspark-client, supportspark-api, supportspark-data, supportspark-build. Evidence includes README.md, package.json, client/src/App.tsx, client/src/lib/queryClient.ts, server/index.ts, server/routes.ts, server/storage.ts, shared/schema.ts, shared/routes.ts, script/build.ts, .github/workflows/deploy-preview.yml and existing domain documents. No existing entities required updating. Entity kinds use the closest available values in the framework schema, which currently lacks application/service kinds.

Copied the existing constitution unchanged into .knowledge/governance/constitution.md. AGENTS.md and all .documentation files remain unchanged as explicitly required by repository instructions. No archive was read or written; no files were moved. Relevant product/API/data/build facts were assimilated into source-backed entity architecture documents.

Codex shims preserve the repository's personal .documentation/{git-user}/commands, team .documentation/commands, then stock command resolution. The upstream personalize command now targets .knowledge/overrides; that path does not supersede this repository's explicit override order. Use the existing .documentation override locations until repository guidance is deliberately migrated.

Follow-up: older domain documentation and constitution technology versions can lag package.json. Governance was preserved without amendment. Historical reports and upgrade plans are not asserted as current implementation evidence. No owners or runtime test results were inferred. Application changes already present in the working tree were only inspected.

## Documentation classification

- Historical/generated: 7
- Durable documentation/governance: 9
- In-flight plan; status needs review: 1
- Legacy/team customization; retained: 20

| Source | Classification | Action |
| --- | --- | --- |
| `.documentation/copilot/audit/2026-04-12_prescan.json` | Historical/generated | Retained in place |
| `.documentation/copilot/audit/2026-04-12_results.md` | Historical/generated | Retained in place |
| `.documentation/copilot/audit/2026-08-27_prescan.json` | Historical/generated | Retained in place |
| `.documentation/copilot/audit/2026-08-27_results.md` | Historical/generated | Retained in place |
| `.documentation/domain/api-surface.md` | Durable documentation/governance | Retained in place |
| `.documentation/domain/architecture.md` | Durable documentation/governance | Retained in place |
| `.documentation/domain/data-model.md` | Durable documentation/governance | Retained in place |
| `.documentation/domain/deployment-iis.md` | Durable documentation/governance | Retained in place |
| `.documentation/domain/development-patterns.md` | Durable documentation/governance | Retained in place |
| `.documentation/domain/product-overview.md` | Durable documentation/governance | Retained in place |
| `.documentation/domain/site-map.md` | Durable documentation/governance | Retained in place |
| `.documentation/domain/UPGRADE_PLAN.md` | In-flight plan; status needs review | Retained in place |
| `.documentation/Guide.md` | Durable documentation/governance | Retained in place |
| `.documentation/memory/constitution.md` | Durable documentation/governance | Retained in place |
| `.documentation/repo-story/history.json` | Historical/generated | Retained in place |
| `.documentation/repo-story/repo-story-2026-03-29.md` | Historical/generated | Retained in place |
| `.documentation/repo-story/repo-story-2026-04-12.md` | Historical/generated | Retained in place |
| `.documentation/scripts/powershell/archive-context.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/check-prerequisites.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/common.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/create-new-feature.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/evolution-context.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/get-pr-context.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/harvest.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/migrate-to-documentation.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/quickfix-context.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/release-context.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/repo-story-context.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/setup-plan.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/site-audit.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/sync-upstream.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/scripts/powershell/update-agent-context.ps1` | Legacy/team customization; retained | Retained in place |
| `.documentation/templates/agent-file-template.md` | Legacy/team customization; retained | Retained in place |
| `.documentation/templates/checklist-template.md` | Legacy/team customization; retained | Retained in place |
| `.documentation/templates/plan-template.md` | Legacy/team customization; retained | Retained in place |
| `.documentation/templates/spec-template.md` | Legacy/team customization; retained | Retained in place |
| `.documentation/templates/tasks-template.md` | Legacy/team customization; retained | Retained in place |

## Verification

All 155 downloaded framework files match their upstream payload. All 33 stock commands have Codex shims; required write-spec skill files exist. Ontology --write and --check passed for four entities and zero decisions. Constitution copy is byte-identical; git diff confirms AGENTS.md and .documentation are unchanged. No application build or tests were needed for framework/documentation-only changes.
