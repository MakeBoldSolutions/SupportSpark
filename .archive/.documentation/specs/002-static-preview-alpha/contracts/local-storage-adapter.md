# Contract: LocalStorage Adapter Interface

**Feature**: 002-static-preview-alpha  
**Date**: 2026-02-24  
**Replaces**: Server API endpoints (`/api/*`) → client-side localStorage operations

## Overview

The localStorage adapter replaces all server API calls. Each method maps to an existing API endpoint's behavior. The adapter is consumed by React hooks (`use-auth`, `use-conversations`, `use-supporters`) which swap their `fetch()` calls for adapter method calls.

## Adapter Interface

```typescript
// client/src/lib/local-storage-adapter.ts

import type { User, InsertUser, Conversation, Message, Supporter } from "@shared/schema";

export interface LocalStorageAdapter {
  // === AUTH ===
  /** Register new user, seed demo data on first registration, set session */
  register(data: InsertUser): User;
  
  /** Authenticate user against stored credentials, set session */
  login(credentials: { email: string; password: string }): User;
  
  /** Clear session (preserve all data) */
  logout(): void;
  
  /** Get current logged-in user from session, or null */
  getCurrentUser(): User | null;

  // === CONVERSATIONS ===
  /** Get all conversations visible to current user (own + supporters') */
  getConversations(): Conversation[];
  
  /** Get single conversation by ID (with access check) */
  getConversation(id: number): Conversation | null;
  
  /** Create new conversation owned by current user */
  createConversation(data: { title: string; initialMessage: string }): Conversation;
  
  /** Add message to existing conversation */
  addMessage(conversationId: number, data: {
    content: string;
    parentMessageId?: string;
    images?: string[];
  }): Conversation;

  // === SUPPORTERS ===
  /** Get supporter lists for current user */
  getSupporters(): {
    mySupporters: (Supporter & { supporterName?: string; supporterEmail?: string })[];
    supporting: (Supporter & { memberName?: string; memberEmail?: string })[];
  };
  
  /** Invite supporter by email (auto-accept, create mock user + conversations) */
  inviteSupporter(data: { email: string }): Supporter;
  
  /** Update supporter status (always "accepted" in preview) */
  updateSupporterStatus(id: number, status: "accepted" | "rejected"): Supporter;

  // === STORAGE MANAGEMENT ===
  /** Get storage usage as percentage (0-100) */
  getStorageUsagePercent(): Promise<number>;
  
  /** Reset all data to initial seeded state (requires re-registration) */
  resetAllData(): void;
  
  /** Check if localStorage is available */
  isStorageAvailable(): boolean;
}
```

## Method → API Endpoint Mapping

| Adapter Method | Replaces API Endpoint | HTTP Method |
|----------------|----------------------|-------------|
| `register()` | `POST /api/register` | POST |
| `login()` | `POST /api/login` | POST |
| `logout()` | `POST /api/logout` | POST |
| `getCurrentUser()` | `GET /api/auth/user` | GET |
| `getConversations()` | `GET /api/conversations` | GET |
| `getConversation(id)` | `GET /api/conversations/:id` | GET |
| `createConversation()` | `POST /api/conversations` | POST |
| `addMessage()` | `POST /api/conversations/:id/messages` | POST |
| `getSupporters()` | `GET /api/supporters` | GET |
| `inviteSupporter()` | `POST /api/supporters/invite` | POST |
| `updateSupporterStatus()` | `PATCH /api/supporters/:id/status` | PATCH |
| `getStorageUsagePercent()` | N/A (new) | — |
| `resetAllData()` | N/A (new) | — |
| `isStorageAvailable()` | N/A (new) | — |

## Error Handling

All adapter methods throw standard `Error` objects with descriptive messages:

| Error Condition | Message | Triggered By |
|----------------|---------|-------------|
| Email already registered | `"A user with this email already exists"` | `register()` |
| Invalid credentials | `"Invalid email or password"` | `login()` |
| Not authenticated | `"Not authenticated"` | Any method requiring session |
| Conversation not found | `"Conversation not found"` | `getConversation()`, `addMessage()` |
| Access denied | `"You do not have access to this conversation"` | `getConversation()` |
| Supporter not found | `"Supporter relationship not found"` | `updateSupporterStatus()` |
| Storage unavailable | `"Local storage is not available"` | `isStorageAvailable()` returning false |

## Hook Integration Pattern

Hooks replace `fetch()` calls with adapter calls. React Query still manages state:

```typescript
// Before (use-conversations.ts)
queryFn: async () => {
  const res = await fetch("/api/conversations", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return api.conversations.list.responses[200].parse(await res.json());
}

// After (use-conversations.ts)
queryFn: () => {
  return storage.getConversations();
}
```

Mutations follow the same pattern — swap `fetch()` for adapter method, keep `onSuccess` invalidation logic.

## Seed Data Trigger

The `register()` method checks `supportSpark_initialized`:
- If absent: creates seed user, seed conversations, seed supporter relationships, then sets flag
- If present: skips seeding (user data already exists from prior session)

This ensures seed data is created exactly once per browser, tied to the first registration.
