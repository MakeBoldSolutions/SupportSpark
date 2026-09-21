# SupportSpark API

The Express entry point registers routes and requires SESSION_SECRET. Passport local authentication and session middleware support login; authentication endpoints have rate limiting (ref: `server/index.ts`, `server/routes.ts`).

The API exposes conversations, messages, supporter invitations, authentication, demo accounts, quotes and health endpoints. Shared resource contracts live in `shared/routes.ts`; image handlers also live in `server/conversation-image-routes.ts` (ref: `server/routes.ts`, `shared/routes.ts`, `server/conversation-image-routes.ts`).

Integration test source exists; no application tests were executed for this framework-only update (ref: `server/routes.test.ts`).
