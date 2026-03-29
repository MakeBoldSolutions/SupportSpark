# Data Model: Static Preview Alpha (Local-Storage Only)

**Feature**: 002-static-preview-alpha  
**Date**: 2026-02-24  
**Source**: [spec.md](./spec.md) entities + [shared/schema.ts](../../shared/schema.ts) Zod schemas

## Entity Overview

All entities reuse the existing Zod schemas from `shared/schema.ts`. No schema changes are required — only the storage backend changes from server-side JSON files to client-side localStorage.

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│    User      │──1:N──│  Conversation     │──1:N──│   Message    │
│              │       │                  │       │  (nested)    │
└──────┬───────┘       └──────────────────┘       └─────────────┘
       │
       │ 1:N (as member)
       │ 1:N (as supporter)
       ▼
┌─────────────┐
│  Supporter   │
│ (member ↔    │
│  supporter)  │
└─────────────┘

┌─────────────┐
│   Session    │  (separate key — current logged-in userId)
└─────────────┘
```

## Entities

### User

**Schema**: `userSchema` from `shared/schema.ts` (unchanged)  
**localStorage key**: `supportSpark_users`  
**Format**: JSON array of User objects

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Generated via `crypto.randomUUID()` |
| email | string | Validated via Zod `.email()` |
| password | string | Stored as plaintext in preview (no bcrypt — client-only) |
| passwordVersion | string? | Omitted in preview (no hashing) |
| firstName | string? | Optional |
| lastName | string? | Optional |
| profileImageUrl | string? | Not used in preview |
| createdAt | string (ISO) | Set on registration |
| updatedAt | string (ISO) | Set on registration |

**Validation**: `insertUserSchema` for registration input, `userSchema` for stored records.

### Conversation

**Schema**: `conversationSchema` from `shared/schema.ts` (unchanged)  
**localStorage key**: `supportSpark_conversations`  
**Format**: JSON array of Conversation objects

| Field | Type | Notes |
|-------|------|-------|
| id | number | Auto-incrementing (tracked via `supportSpark_nextConversationId`) |
| memberId | string | Foreign key → User.id |
| title | string | Provided by user |
| data.messages | Message[] | Array of messages (see below) |
| createdAt | string (ISO) | Set on creation |
| memberName | string? | Denormalized from User.firstName for display |

### Message

**Schema**: `messageSchema` from `shared/schema.ts` (unchanged)  
**Storage**: Embedded within Conversation.data.messages (not stored separately)

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Generated via `crypto.randomUUID()` |
| authorId | string | Foreign key → User.id |
| authorName | string | Denormalized from User name |
| content | string | Markdown-formatted text |
| timestamp | string (ISO) | Set on creation |
| images | string[]? | Not used in preview |
| replies | Message[]? | Recursive — not used in preview v1 |

### Supporter

**Schema**: `supporterSchema` from `shared/schema.ts` (unchanged)  
**localStorage key**: `supportSpark_supporters`  
**Format**: JSON array of Supporter objects

| Field | Type | Notes |
|-------|------|-------|
| id | number | Auto-incrementing (tracked via `supportSpark_nextSupporterId`) |
| memberId | string | Foreign key → User.id (person being supported) |
| supporterId | string | Foreign key → User.id (person providing support) |
| status | "accepted" | Always "accepted" in preview (auto-accept) |
| createdAt | string (ISO) | Set on creation |

### Session

**localStorage key**: `supportSpark_session`  
**Format**: JSON string (userId) or `null`

Represents the currently logged-in user. Set on login/register, cleared on logout. Checked on page load to restore auth state.

### Metadata

**localStorage key**: `supportSpark_initialized`  
**Format**: `"true"` or absent

Flag indicating seed data has been injected. Set after first registration completes and seed data is created. Checked before seeding to prevent duplicates.

**localStorage key**: `supportSpark_nextConversationId`  
**Format**: JSON number

Auto-incrementing counter for conversation IDs. Seed data uses IDs 1-10 (reserved range). User-created conversations start at 100.

**localStorage key**: `supportSpark_nextSupporterId`  
**Format**: JSON number

Auto-incrementing counter for supporter IDs. Seed data uses IDs 1-10 (reserved range). User-created supporters start at 100.

## Seed Data

On first registration, the following demo data is created:

### Seed User (Supporter)
- id: `seed-supporter-001`
- email: `alex.supporter@example.com`
- firstName: `Alex`
- lastName: `Rivera`
- password: `preview123` (plaintext)

### Seed Conversations (My Journey — owned by registered user)
1. **"Starting My Recovery Journey"** — 2 messages from the user describing their initial experience
2. **"Grateful for Small Wins"** — 1 message from the user celebrating progress

### Seed Conversations (Following — owned by seed supporter)
1. **"Managing Daily Challenges"** — 2 messages from Alex describing their experience
2. **"Finding Community Support"** — 1 message from Alex about building connections

### Seed Supporter Relationship
- memberId: registered user's ID, supporterId: `seed-supporter-001`, status: `"accepted"`
- memberId: `seed-supporter-001`, supporterId: registered user's ID, status: `"accepted"` (bidirectional)

## localStorage Key Summary

| Key | Type | Purpose |
|-----|------|---------|
| `supportSpark_users` | User[] | All registered users |
| `supportSpark_conversations` | Conversation[] | All conversations with embedded messages |
| `supportSpark_supporters` | Supporter[] | All supporter relationships |
| `supportSpark_session` | string \| null | Current user ID |
| `supportSpark_initialized` | "true" | Seed data flag |
| `supportSpark_nextConversationId` | number | ID counter |
| `supportSpark_nextSupporterId` | number | ID counter |

**Estimated size**: ~15-20KB for seed data. Well within 5MB localStorage limit.
