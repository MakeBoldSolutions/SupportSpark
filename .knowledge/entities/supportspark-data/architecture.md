# SupportSpark data model

Shared Zod schemas describe users, conversations, recursive messages and supporter relationships with pending, accepted or rejected status (ref: `shared/schema.ts`). FileStorage persists JSON and maintains process-local indexes and user/supporter maps (ref: `server/storage.ts`).

Conversation mutation uses updateConversation(id, mutate), which acquires an exclusive filesystem directory lock before reading the current conversation, applying the synchronous mutation and atomically replacing the file. The lock is released on success or failure. This serializes message updates across storage instances that share the filesystem (ref: `server/storage.ts`, `server/conversation-concurrency.test.ts`).

A contended lock returns a retryable HTTP 503 after five seconds. A process crash can leave a `<conversation-id>.lock` directory under the conversations data directory. Stop all writers and verify no mutation is active before an operator removes that specific empty lock directory; the application deliberately does not steal an existing lock (ref: `server/storage.ts`). The lock protects conversation mutations, not all cached user/index state; it does not make the entire storage implementation suitable for a multi-process deployment.

Tests verify concurrent top-level/nested replies, persisted content, and lock release after rejected mutations and write failures (ref: `server/conversation-concurrency.test.ts`, `server/storage.test.ts`).
