# Alignment Audit: Prompts, Scripts, Agents & Constitution

**Date**: 2026-02-24  
**Scope**: Full cross-artifact review for Windows 11 + VS Code Copilot / Claude Code compatibility

## Summary

Reviewed all 16 agent definitions, 16 prompt stubs, 9 PowerShell scripts, constitution, and copilot-instructions for path consistency, Windows compatibility, and cross-reference alignment.

**Issues Found**: 7 distinct issues  
**Issues Fixed**: 6  
**Action Required**: 1 (manual file move)

---

## Issues Found & Fixed

### 1. CRITICAL: Double Path Separator in Agent Files

**Problem**: 9 agent files referenced `/.documentation.documentation/memory/constitution.md` (doubled `.documentation` segment) instead of `/.documentation/memory/constitution.md`.

**Files Fixed** (25 occurrences total):
- `speckit.analyze.agent.md` (2)
- `speckit.constitution.agent.md` (4)
- `speckit.critic.agent.md` (2)
- `speckit.discover-constitution.agent.md` (4)
- `speckit.evolve-constitution.agent.md` (6)
- `speckit.plan.agent.md` (1)
- `speckit.pr-review.agent.md` (2)
- `speckit.quickfix.agent.md` (2)
- `speckit.site-audit.agent.md` (2)

**Fix**: Global replace `/.documentation.documentation/` → `/.documentation/`

---

### 2. CRITICAL: Specs Directory Mismatch in create-new-feature.ps1

**Problem**: `create-new-feature.ps1` created feature directories in `specs/` (repo root), but `common.ps1` and ALL other scripts/agents reference `.documentation/specs/`.

**File Fixed**: `.documentation/scripts/powershell/create-new-feature.ps1`  
**Change**: `Join-Path $repoRoot 'specs'` → `Join-Path $repoRoot '.documentation/specs'`

---

### 3. HIGH: Wrong Root Path in get-pr-context.ps1

**Problem**: Script used `$scriptPath\..\..` which resolves to `.documentation/` instead of the repo root. The script is at `.documentation/scripts/powershell/`, so it needs 3 levels up, not 2.

**File Fixed**: `.documentation/scripts/powershell/get-pr-context.ps1`  
**Change**: `Resolve-Path "$scriptPath\..\..\"` → `Resolve-Path "$scriptPath\..\..\.."`

---

### 4. HIGH: Bash Syntax in Agent Files (Windows Incompatible)

**Problem**: Several agent files contained bash-specific commands that fail in PowerShell.

**Files Fixed**:
| File | Old (Bash) | New (PowerShell) |
|------|-----------|-----------------|
| `speckit.implement.agent.md` | `` ```sh`` + `2>/dev/null` | `` ```powershell`` + `2>$null` |
| `speckit.quickfix.agent.md` | `2>/dev/null` | `2>$null` |
| `speckit.specify.agent.md` | `grep -E 'pattern'` | `Select-String -Pattern 'pattern'` |

---

### 5. MEDIUM: Wrong Copilot Instructions Path in update-agent-context.ps1

**Problem**: Script referenced `.github/agents/copilot-instructions.md` but the actual file is at `.github/copilot-instructions.md`.

**File Fixed**: `.documentation/scripts/powershell/update-agent-context.ps1`  
**Change**: `.github/agents/copilot-instructions.md` → `.github/copilot-instructions.md`

---

### 6. LOW: Incomplete Folder Structure in copilot-instructions.md

**Problem**: The `.documentation/` folder structure diagram was missing `specs/`, `scripts/`, and `templates/` directories.

**File Fixed**: `.github/copilot-instructions.md`  
**Change**: Added missing directories to the structure diagram.

---

### 7. ACTION REQUIRED: Orphaned `specs/` Directory at Repo Root

**Problem**: The old buggy `create-new-feature.ps1` created `specs/001-audit-compliance-fixes/` at the repo root. Now that the script is fixed to use `.documentation/specs/`, this directory is orphaned.

**Recommended Action**:
```powershell
# Move existing specs to correct location
New-Item -ItemType Directory -Path ".documentation/specs" -Force
Move-Item -Path "specs/001-audit-compliance-fixes" -Destination ".documentation/specs/001-audit-compliance-fixes"
Remove-Item -Path "specs" -Recurse -Force  # Only after confirming move
```

---

## Verification Summary

| Check | Status |
|-------|--------|
| All 16 prompts have matching agents | ✅ |
| All 16 agents have matching prompts | ✅ |
| No `.documentation.documentation` double separators | ✅ |
| No bash `2>/dev/null` syntax | ✅ |
| No bash `grep -E` syntax | ✅ |
| All PowerShell scripts reference `.documentation/specs/` | ✅ |
| `get-pr-context.ps1` resolves repo root correctly | ✅ |
| `copilot-instructions.md` folder structure complete | ✅ |
| Constitution path consistent across all files | ✅ |
| Template files exist at referenced paths | ✅ |
| Referenced documentation files exist | ✅ |

## Files Not Modified (Already Correct)

- `common.ps1` - Already uses `.documentation/specs/`
- `check-prerequisites.ps1` - Sources `common.ps1` correctly
- `setup-plan.ps1` - Sources `common.ps1` correctly
- `evolution-context.ps1` - Paths correct
- `release-context.ps1` - Paths correct
- `quickfix-context.ps1` - Paths correct
- `site-audit.ps1` - Paths correct
- All 16 `.prompt.md` files - Correctly configured as YAML stubs
- Constitution (`constitution.md`) - No changes needed
