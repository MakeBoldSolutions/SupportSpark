# SupportSpark API

The Express entry point requires SESSION_SECRET and registers the API. Passport local authentication and sessions support login; authentication endpoints have rate limits (ref: `server/index.ts`, `server/routes.ts`).

Conversation reads and image downloads require the owner or an accepted supporter. Uploads require the owner; authorized image responses use private, no-store caching (ref: `server/routes.ts`, `server/conversation-image-routes.ts`). Integration tests cover anonymous, unrelated, pending, rejected and accepted access, plus owner uploads and download payloads (ref: `server/conversation-api.test.ts`, `server/conversation-image-routes.test.ts`).

API request logs contain method, route template, response status and duration. They omit payloads, query strings and path identifiers (ref: `server/request-logger.ts`, `server/request-logger.test.ts`).

Messages are added to a fresh conversation snapshot inside the storage update lock, preserving simultaneous top-level and nested replies (ref: `server/routes.ts`, `server/conversation-api.test.ts`).
