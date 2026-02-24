import type { User, Conversation, Supporter } from "@shared/schema";

const KEYS = {
  users: "supportSpark_users",
  conversations: "supportSpark_conversations",
  supporters: "supportSpark_supporters",
  nextConversationId: "supportSpark_nextConversationId",
  nextSupporterId: "supportSpark_nextSupporterId",
} as const;

function getItem<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  return JSON.parse(raw) as T;
}

function setItem(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Inject seed data for a newly registered user.
 * Creates:
 * - Alex Rivera (seed supporter)
 * - 2 "My Journey" conversations for the registered user
 * - 2 "Following" conversations for Alex
 * - Bidirectional supporter relationship
 */
export function injectSeedData(registeredUserId: string): void {
  const now = new Date().toISOString();
  const earlier = new Date(Date.now() - 86400000).toISOString(); // yesterday

  // Seed supporter user
  const seedSupporter: User = {
    id: "seed-supporter-001",
    email: "alex.supporter@example.com",
    password: "preview123",
    firstName: "Alex",
    lastName: "Rivera",
    createdAt: earlier,
    updatedAt: earlier,
  };

  const existingUsers = getItem<User[]>(KEYS.users, []);
  if (!existingUsers.some((u) => u.id === seedSupporter.id)) {
    setItem(KEYS.users, [...existingUsers, seedSupporter]);
  }

  // Registered user info for message author names
  const regUser = existingUsers.find((u) => u.id === registeredUserId);
  const regName = regUser?.firstName || regUser?.email || "You";

  // Seed conversations
  const seedConversations: Conversation[] = [
    // My Journey — owned by registered user
    {
      id: 1,
      memberId: registeredUserId,
      title: "Starting My Recovery Journey",
      data: {
        messages: [
          {
            id: "seed-msg-001",
            authorId: registeredUserId,
            authorName: regName,
            content:
              "Today I decided to start sharing my journey. It feels good to have a space where I can be honest about how things are going. One step at a time.",
            timestamp: earlier,
          },
          {
            id: "seed-msg-002",
            authorId: registeredUserId,
            authorName: regName,
            content:
              "Had a follow-up appointment today. The doctor says things are looking better. Small progress, but it counts.",
            timestamp: now,
          },
        ],
      },
      createdAt: earlier,
      memberName: regName,
    },
    {
      id: 2,
      memberId: registeredUserId,
      title: "Grateful for Small Wins",
      data: {
        messages: [
          {
            id: "seed-msg-003",
            authorId: registeredUserId,
            authorName: regName,
            content:
              "Managed to cook a full meal for the first time in weeks. It's the little things that remind me I'm getting stronger.",
            timestamp: now,
          },
        ],
      },
      createdAt: now,
      memberName: regName,
    },
    // Following — owned by Alex
    {
      id: 3,
      memberId: "seed-supporter-001",
      title: "Managing Daily Challenges",
      data: {
        messages: [
          {
            id: "seed-msg-004",
            authorId: "seed-supporter-001",
            authorName: "Alex",
            content:
              "Some days are harder than others, but I'm learning to take things one moment at a time. Grateful for everyone cheering me on.",
            timestamp: earlier,
          },
          {
            id: "seed-msg-005",
            authorId: "seed-supporter-001",
            authorName: "Alex",
            content:
              "Tried a new routine today. Morning walks have been surprisingly helpful for clearing my head.",
            timestamp: now,
          },
        ],
      },
      createdAt: earlier,
      memberName: "Alex",
    },
    {
      id: 4,
      memberId: "seed-supporter-001",
      title: "Finding Community Support",
      data: {
        messages: [
          {
            id: "seed-msg-006",
            authorId: "seed-supporter-001",
            authorName: "Alex",
            content:
              "Joined a local support group this week. It's comforting to know I'm not alone in this. Building connections one conversation at a time.",
            timestamp: now,
          },
        ],
      },
      createdAt: now,
      memberName: "Alex",
    },
  ];

  const existing = getItem<Conversation[]>(KEYS.conversations, []);
  setItem(KEYS.conversations, [...existing, ...seedConversations]);
  // Reserve IDs 1-10 for seed data; user-created start at 100
  setItem(KEYS.nextConversationId, 100);

  // Bidirectional supporter relationships
  const seedSupporters: Supporter[] = [
    {
      id: 1,
      memberId: registeredUserId,
      supporterId: "seed-supporter-001",
      status: "accepted",
      createdAt: earlier,
    },
    {
      id: 2,
      memberId: "seed-supporter-001",
      supporterId: registeredUserId,
      status: "accepted",
      createdAt: earlier,
    },
  ];

  const existingSupporters = getItem<Supporter[]>(KEYS.supporters, []);
  setItem(KEYS.supporters, [...existingSupporters, ...seedSupporters]);
  setItem(KEYS.nextSupporterId, 100);
}
