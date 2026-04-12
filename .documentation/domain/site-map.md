# SupportSpark Site Map

This document maps the current UI surface area to the source files that own each route and feature.

## Client Routing

Client routing is defined in `client/src/App.tsx` and uses Wouter with `useHashLocation()` so the app can run in static preview environments.

## Route Inventory

| Route | Access | Page Component | Purpose |
| --- | --- | --- | --- |
| `/` | Public | `client/src/pages/Home.tsx` | Landing page and product entry point |
| `/auth` | Public | `client/src/pages/Auth.tsx` | Registration and sign-in |
| `/demo` | Public | `client/src/pages/Demo.tsx` | Demo account entry and preview experience |
| `/dashboard` | Authenticated | `client/src/pages/Dashboard.tsx` | Split view of member-owned and followed conversations |
| `/supporters` | Authenticated | `client/src/pages/Supporters.tsx` | Supporter management and invitation handling |
| `/conversation/:id` | Authenticated and authorized | `client/src/pages/ConversationView.tsx` | Full conversation thread and reply experience |
| fallback | Public | `client/src/pages/not-found.tsx` | Not found state |

## Layout and Shared UI

| File | Responsibility |
| --- | --- |
| `client/src/components/navbar.tsx` | Main navigation and auth-aware actions |
| `client/src/components/footer.tsx` | Footer for public pages |
| `client/src/components/preview-banner.tsx` | Static preview and demo context banner |
| `client/src/components/create-update-dialog.tsx` | Conversation creation flow |
| `client/src/components/invite-supporter-dialog.tsx` | Supporter invitation flow |

## Data Hooks

| Hook | Responsibility |
| --- | --- |
| `client/src/hooks/use-auth.ts` | Session-aware user loading, login, logout, registration |
| `client/src/hooks/use-conversations.ts` | Conversation list, conversation detail, add-message mutations |
| `client/src/hooks/use-supporters.ts` | Supporter list, invite flow, status updates |
| `client/src/hooks/use-toast.ts` | Toast helper state |

## Page Responsibilities

### Home

- Presents product story and call-to-action.
- Links visitors to sign-in or demo mode.
- Rotates quotes from attached asset data.

### Dashboard

- Shows member-created conversations.
- Shows conversations followed as a supporter.
- Links into supporter management and conversation detail.

### Conversation View

- Displays the initial update as the conversation header content.
- Displays later messages as support replies in chronological order.
- Allows markdown-style authoring and optional image upload.

### Supporters

- Shows both sides of the support relationship.
- Surfaces pending invitations and acceptance actions.
- Hosts the supporter invitation dialog.

## Documentation Notes

- Product-level behavior belongs in `product-overview.md`.
- Endpoint behavior belongs in `api-surface.md`.
- Data ownership and file layout belong in `data-model.md`.