# SupportSpark Data Model

SupportSpark uses shared Zod schemas in `shared/schema.ts` and persists data to JSON files in `data/`.

## Core Entities

### User

Represents a registered person in the system, whether they act as a member or supporter.

Key attributes:

- `id`: string identifier.
- `email`: unique email address.
- `password`: bcrypt hash.
- `passwordVersion`: current password migration marker.
- `firstName`, `lastName`, `profileImageUrl`: optional profile data.
- `createdAt`, `updatedAt`: optional ISO timestamps.

### Conversation

Represents a member-owned update thread.

Key attributes:

- `id`: numeric conversation identifier.
- `memberId`: owner user id.
- `title`: conversation title.
- `createdAt`: ISO timestamp.
- `memberName`: optional denormalized display name.
- `data.messages`: threaded message tree for the conversation.

### Message

Represents either the initial update or a reply within a conversation.

Key attributes:

- `id`: string identifier.
- `authorId`: author user id.
- `authorName`: display name.
- `content`: markdown-capable message content.
- `timestamp`: ISO timestamp.
- `images`: optional image URLs.
- `replies`: optional recursive child messages.

### Supporter Relationship

Represents a connection between a member and a supporter.

Key attributes:

- `id`: numeric relationship identifier.
- `memberId`: user being supported.
- `supporterId`: invited user.
- `status`: `pending`, `accepted`, or `rejected`.
- `createdAt`: ISO timestamp.

## Storage Layout

| Path | Contents |
| --- | --- |
| `data/users.json` | Registered users |
| `data/supporters.json` | Supporter relationships |
| `data/conversations/index.json` | Conversation index for lightweight listing |
| `data/conversations/meta.json` | Last-used conversation id metadata |
| `data/conversations/<member-id>/<conversation-id>.json` | Full conversation payload |
| `data/conversations/conv-<id>/images/` | Uploaded conversation images |
| `data/quotes.json` | Quote content for the UI |

## Storage Strategy

- The storage implementation lives in `server/storage.ts`.
- `FileStorage` maintains in-memory maps backed by JSON persistence.
- Demo accounts and starter conversation data are seeded during storage initialization.
- Atomic writes are used to reduce corruption risk during file updates.

## Modeling Notes

- Conversations are intentionally denormalized for simple file reads.
- Message replies are recursive and stored inline with the parent conversation payload.
- Supporter relationships model access control between members and supporters.
- The current design favors transparency and simple operations over database normalization.