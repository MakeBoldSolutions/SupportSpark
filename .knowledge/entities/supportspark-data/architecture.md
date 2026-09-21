# SupportSpark data model

Shared Zod schemas define users, conversations, recursive messages and supporter relationships with pending, accepted or rejected status (ref: `shared/schema.ts`).

The server IStorage interface covers user lookup and creation, conversations and supporter relationships. FileStorage uses filesystem persistence and in-memory maps (ref: `server/storage.ts`). Existing domain documentation describes the JSON storage layout (ref: `.documentation/domain/data-model.md`). Storage test source exists but was not executed during discovery (ref: `server/storage.test.ts`).
