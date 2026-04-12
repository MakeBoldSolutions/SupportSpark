# Architecture Documentation Arrangement

## Summary

Reorganized repository documentation around the DevSpark layout without moving product code or changing governance artifacts.

## Changes Made

- Added `.documentation/Guide.md` as the documentation entry point.
- Added durable domain guides for product overview, site map, API surface, and data model.
- Corrected README documentation links to point at the active `.documentation/` tree.
- Corrected README API examples to match the current server implementation.

## Rationale

The repository already had a DevSpark-compatible folder structure, but it lacked a clear documentation hub and did not document the full application surface. Existing README content had drifted from the implemented routes, which made it a weak source of truth.

## Follow-up Opportunities

- Add ADRs under `.documentation/decisions/` when routing, storage, or authentication strategy changes.
- Create feature-specific specs under `.documentation/specs/` instead of extending domain docs with temporary planning notes.
- Consider moving the remaining uncontracted endpoints into `shared/routes.ts` once their behavior stabilizes.
