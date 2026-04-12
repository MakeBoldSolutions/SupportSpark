# SupportSpark API Surface

This document captures the current backend HTTP surface as implemented in `server/routes.ts`.

## Contract Coverage

The shared contract file `shared/routes.ts` currently covers the conversation and supporter resource APIs. Authentication, demo, quote, and image upload endpoints are implemented directly in `server/routes.ts` and should move into shared contracts only when that surface stabilizes.

## Authentication Endpoints

| Method | Path | Auth Required | Notes |
| --- | --- | --- | --- |
| `POST` | `/api/login` | No | Local email/password login with Passport |
| `POST` | `/api/register` | No | Creates a user, hashes password with bcrypt, then logs in |
| `POST` | `/api/logout` | Yes | Ends current session |
| `GET` | `/api/auth/user` | Yes | Returns the current authenticated user without sensitive fields |

## Conversation Endpoints

| Method | Path | Auth Required | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/conversations` | Yes | Returns conversations the user owns or follows |
| `GET` | `/api/conversations/:id` | Yes | Requires owner access or accepted supporter relationship |
| `POST` | `/api/conversations` | Yes | Creates a conversation with title and initial message |
| `POST` | `/api/conversations/:id/messages` | Yes | Adds a top-level message or nested reply |
| `POST` | `/api/conversations/:id/images` | Yes and member-only | Uploads image files for a conversation |

## Supporter Endpoints

| Method | Path | Auth Required | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/supporters` | Yes | Returns both supporter lists: `mySupporters` and `supporting` |
| `POST` | `/api/supporters/invite` | Yes | Invites an already-registered user by email |
| `PATCH` | `/api/supporters/:id/status` | Yes | Accepts or rejects a pending invitation |

## Demo and Utility Endpoints

| Method | Path | Auth Required | Notes |
| --- | --- | --- | --- |
| `POST` | `/api/demo/login/patient` | No | Logs in as the seeded demo member |
| `POST` | `/api/demo/login/supporter` | No | Logs in as the seeded demo supporter |
| `GET` | `/api/demo/info` | No | Returns summary information about demo identities |
| `GET` | `/api/quotes` | No | Returns quote data used by the experience |

## Validation and Security Notes

- Session handling is backed by `express-session`, Passport, and `memorystore`.
- Passwords are hashed with bcrypt before persistence.
- Authentication endpoints use rate limiting.
- Uploads accept JPEG, PNG, GIF, and WebP files up to 5 MB each.
- Conversation access checks distinguish conversation owners from accepted supporters.

## Related Source Files

- `server/routes.ts`: HTTP handlers and middleware.
- `shared/routes.ts`: shared contracts for conversations and supporters.
- `shared/schema.ts`: request and response entity shapes.