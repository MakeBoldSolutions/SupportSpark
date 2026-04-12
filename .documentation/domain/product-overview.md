# SupportSpark Product Overview

SupportSpark is a private support-network application for people who need to keep trusted supporters informed during difficult periods without managing many separate conversations.

## Product Goal

Give one person a calm place to post updates once and let approved supporters follow along and respond in context.

## Primary Roles

| Role | Description | Primary Goals |
| --- | --- | --- |
| Member | Person sharing a journey or life update | Create conversations, post updates, invite supporters, read replies |
| Supporter | Trusted person following someone else's journey | Accept invitations, read updates, reply with encouragement |
| Visitor | Unauthenticated user exploring the product | Learn the purpose, sign up, or try demo mode |
| Demo User | Seeded sample account | Explore the product without creating a permanent account |

## Current Product Capabilities

### Public Experience

- Marketing-style home page with product framing and rotating quotes.
- Dedicated authentication page for registration and sign-in.
- Demo mode with seeded member and supporter experiences.

### Member Experience

- Create a conversation with an initial update.
- View personal conversations on the dashboard.
- Upload images to conversation messages.
- Invite supporters by email.
- Review supporter relationships and pending invitations.

### Supporter Experience

- View followed conversations after invitation acceptance.
- Read conversation history.
- Reply with threaded support messages.
- Accept or reject pending supporter invitations.

## Experience Boundaries

- SupportSpark is intentionally small-scope and file-backed in the current phase.
- Invitation flow currently works only for users who already registered in the system.
- Routing is hash-based in the client to support static preview hosting.
- Durable data is stored as JSON under `data/`, not in a database.

## Core User Journeys

1. A visitor lands on the home page, understands the product, and chooses sign-in or demo mode.
2. A new member registers, signs in, creates a conversation, and posts an initial update.
3. A member invites a supporter who already has an account.
4. A supporter accepts the invitation and reads the member's updates.
5. Either participant adds messages to the conversation thread, including optional images.

## Supporting Documents

- See `architecture.md` for system design.
- See `site-map.md` for route and page ownership.
- See `api-surface.md` for current backend endpoints.
- See `data-model.md` for entities and storage layout.