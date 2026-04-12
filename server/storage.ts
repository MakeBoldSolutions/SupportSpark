import {
  type User,
  type InsertUser,
  type Conversation,
  type Supporter,
  type Message,
} from "@shared/schema";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  buildDemoSeedData,
  DEMO_MEMBER_ID,
  DEMO_SUPPORTER_ID,
} from "./demo-seed";

export interface IStorage {
  // User Operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversation Operations
  getConversationsForUser(userId: string): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(
    memberId: string,
    title: string,
    initialMessage: Message
  ): Promise<Conversation>;
  updateConversation(id: number, conversation: Conversation): Promise<Conversation>;

  // Supporter Operations
  getSupportersForMember(memberId: string): Promise<Supporter[]>;
  getSupportingMembers(supporterId: string): Promise<Supporter[]>;
  createSupporter(memberId: string, supporterId: string): Promise<Supporter>;
  updateSupporterStatus(id: number, status: "accepted" | "rejected"): Promise<Supporter>;
  getSupporterRecord(memberId: string, supporterId: string): Promise<Supporter | undefined>;
}

interface ConversationIndex {
  id: number;
  memberId: string;
  title: string;
  createdAt: string;
}

interface ConversationMeta {
  lastConversationId: number;
}

export class FileStorage implements IStorage {
  private dataDir: string;
  private usersFile: string;
  private supportersFile: string;
  private conversationsDir: string;
  private conversationIndexFile: string;
  private conversationMetaFile: string;

  // In-memory cache
  private users: Map<string, User> = new Map();
  private conversationIndex: Map<number, ConversationIndex> = new Map();
  private supporters: Map<number, Supporter> = new Map();
  private currentConversationId = 1;
  private currentSupporterId = 1;
  private initialized = false;

  constructor(dataDir = path.join(process.cwd(), process.env.NODE_ENV === "test" ? "data-test" : "data")) {
    this.dataDir = dataDir;
    this.usersFile = path.join(this.dataDir, "users.json");
    this.supportersFile = path.join(this.dataDir, "supporters.json");
    this.conversationsDir = path.join(this.dataDir, "conversations");
    this.conversationIndexFile = path.join(this.conversationsDir, "index.json");
    this.conversationMetaFile = path.join(this.conversationsDir, "meta.json");
    this.init();
  }

  // Demo account IDs (deterministic for easy lookup)
  static DEMO_MEMBER_ID = DEMO_MEMBER_ID;
  static DEMO_SUPPORTER_ID = DEMO_SUPPORTER_ID;

  private async init() {
    if (this.initialized) return;
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(this.conversationsDir, { recursive: true });
      await this.loadData();
      await this.ensureDemoData();
      this.initialized = true;
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  }

  private async ensureDemoData() {
    const demoPasswordBlocker = `DEMO_ONLY_${randomUUID()}`;
    const demoSeed = buildDemoSeedData({
      password: demoPasswordBlocker,
      startingConversationId: this.currentConversationId,
      supporterRelationshipId: this.currentSupporterId,
    });

    let usersChanged = false;

    for (const demoUser of demoSeed.users) {
      if (!this.users.has(demoUser.id)) {
        this.users.set(demoUser.id, demoUser);
        usersChanged = true;
      }
    }

    if (usersChanged) {
      await this.persistUsers();
    }

    const existingRelation = Array.from(this.supporters.values()).find(
      (s) =>
        s.memberId === FileStorage.DEMO_MEMBER_ID && s.supporterId === FileStorage.DEMO_SUPPORTER_ID
    );

    if (!existingRelation) {
      this.supporters.set(demoSeed.supporter.id, demoSeed.supporter);
      this.currentSupporterId = demoSeed.nextSupporterId;
      await this.persistSupporters();
    }

    const demoConversations = Array.from(this.conversationIndex.values()).filter(
      (c) => c.memberId === FileStorage.DEMO_MEMBER_ID
    );

    if (demoConversations.length === 0) {
      for (const conv of demoSeed.conversations) {
        this.conversationIndex.set(conv.id, {
          id: conv.id,
          memberId: FileStorage.DEMO_MEMBER_ID,
          title: conv.title,
          createdAt: conv.createdAt,
        });
        await this.writeConversationFile(conv);
      }

      this.currentConversationId = demoSeed.nextConversationId;
      await this.persistConversationIndex();
      await this.persistConversationMeta();
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  private async loadData() {
    try {
      // Load Users
      const usersData = await this.readFile<User[]>(this.usersFile, []);
      this.users = new Map(usersData.map((u) => [u.id, u]));

      // Load Conversation Index
      const indexData = await this.readFile<ConversationIndex[]>(this.conversationIndexFile, []);
      this.conversationIndex = new Map(indexData.map((c) => [c.id, c]));

      // Load Conversation Meta
      const metaData = await this.readFile<ConversationMeta>(this.conversationMetaFile, {
        lastConversationId: 0,
      });
      this.currentConversationId = metaData.lastConversationId + 1;

      // Load Supporters
      const supportersData = await this.readFile<Supporter[]>(this.supportersFile, []);
      this.supporters = new Map(supportersData.map((s) => [s.id, s]));
      if (supportersData.length > 0) {
        this.currentSupporterId = Math.max(...supportersData.map((s) => s.id)) + 1;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  private async readFile<T>(filePath: string, defaultValue: T): Promise<T> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === "ENOENT") {
        await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
        return defaultValue;
      }
      throw error;
    }
  }

  private async persistUsers() {
    await this.atomicWrite(this.usersFile, Array.from(this.users.values()));
  }

  private async persistConversationIndex() {
    await this.atomicWrite(
      this.conversationIndexFile,
      Array.from(this.conversationIndex.values())
    );
  }

  private async persistConversationMeta() {
    const meta: ConversationMeta = { lastConversationId: this.currentConversationId - 1 };
    await this.atomicWrite(this.conversationMetaFile, meta);
  }

  private async persistSupporters() {
    await this.atomicWrite(
      this.supportersFile,
      Array.from(this.supporters.values())
    );
  }

  /**
   * Atomic write operation using temp file + rename strategy
   * Prevents data corruption from concurrent writes (STORAGE1 fix)
   */
  private async atomicWrite(filePath: string, data: unknown): Promise<void> {
    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}`;
    
    try {
      // Write to temp file
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      
      // Atomic rename (POSIX guarantees atomicity)
      await fs.rename(tempPath, filePath);
    } catch (error) {
      // Cleanup temp file on error
      try {
        await fs.unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  private getConversationFilePath(memberId: string, conversationId: number): string {
    return path.join(this.conversationsDir, memberId, `${conversationId}.json`);
  }

  private async ensureMemberDir(memberId: string) {
    const memberDir = path.join(this.conversationsDir, memberId);
    await fs.mkdir(memberDir, { recursive: true });
  }

  private async writeConversationFile(conversation: Conversation) {
    await this.ensureMemberDir(conversation.memberId);
    const filePath = this.getConversationFilePath(conversation.memberId, conversation.id);
    await this.atomicWrite(filePath, conversation);
  }

  private async readConversationFile(
    memberId: string,
    conversationId: number
  ): Promise<Conversation | undefined> {
    try {
      const filePath = this.getConversationFilePath(memberId, conversationId);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === "ENOENT") {
        return undefined;
      }
      throw error;
    }
  }

  // === User Operations ===

  async getUser(id: string): Promise<User | undefined> {
    await this.ensureInitialized();
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      passwordVersion: "bcrypt-10", // Set password version for new users
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    await this.persistUsers();
    return user;
  }

  // === Conversation Operations ===

  async getConversationsForUser(userId: string): Promise<Conversation[]> {
    await this.ensureInitialized();

    // Get accepted supporter relationships
    const supporting = await this.getSupportingMembers(userId);
    const acceptedMemberIds = supporting
      .filter((s) => s.status === "accepted")
      .map((s) => s.memberId);

    // Include own conversations (as member)
    acceptedMemberIds.push(userId);

    // Get conversation IDs from index that belong to these members
    const relevantIndexEntries = Array.from(this.conversationIndex.values()).filter((c) =>
      acceptedMemberIds.includes(c.memberId)
    );

    // Load full conversations from individual files
    const conversations: Conversation[] = [];
    for (const entry of relevantIndexEntries) {
      const conversation = await this.readConversationFile(entry.memberId, entry.id);
      if (conversation) {
        conversations.push(conversation);
      }
    }

    return conversations;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    await this.ensureInitialized();

    // Look up member ID from index
    const indexEntry = this.conversationIndex.get(id);
    if (!indexEntry) return undefined;

    return this.readConversationFile(indexEntry.memberId, id);
  }

  async createConversation(
    memberId: string,
    title: string,
    initialMessage: Message
  ): Promise<Conversation> {
    await this.ensureInitialized();

    const id = this.currentConversationId++;
    const conversation: Conversation = {
      id,
      memberId,
      title,
      data: {
        messages: [initialMessage],
      },
      createdAt: new Date().toISOString(),
    };

    // Add to index
    this.conversationIndex.set(id, {
      id,
      memberId,
      title,
      createdAt: conversation.createdAt,
    });

    // Persist conversation file, index, and meta
    await this.writeConversationFile(conversation);
    await this.persistConversationIndex();
    await this.persistConversationMeta();

    return conversation;
  }

  async updateConversation(id: number, conversation: Conversation): Promise<Conversation> {
    await this.ensureInitialized();

    // Update index if title changed
    const indexEntry = this.conversationIndex.get(id);
    if (indexEntry && indexEntry.title !== conversation.title) {
      indexEntry.title = conversation.title;
      this.conversationIndex.set(id, indexEntry);
      await this.persistConversationIndex();
    }

    // Write the updated conversation file
    await this.writeConversationFile(conversation);

    return conversation;
  }

  // === Supporter Operations ===

  async getSupportersForMember(memberId: string): Promise<Supporter[]> {
    await this.ensureInitialized();
    return Array.from(this.supporters.values()).filter((s) => s.memberId === memberId);
  }

  async getSupportingMembers(supporterId: string): Promise<Supporter[]> {
    await this.ensureInitialized();
    return Array.from(this.supporters.values()).filter((s) => s.supporterId === supporterId);
  }

  async createSupporter(memberId: string, supporterId: string): Promise<Supporter> {
    await this.ensureInitialized();
    const id = this.currentSupporterId++;
    const supporter: Supporter = {
      id,
      memberId,
      supporterId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.supporters.set(id, supporter);
    await this.persistSupporters();
    return supporter;
  }

  async updateSupporterStatus(id: number, status: "accepted" | "rejected"): Promise<Supporter> {
    await this.ensureInitialized();
    const supporter = this.supporters.get(id);
    if (!supporter) throw new Error("Supporter record not found");

    supporter.status = status;
    this.supporters.set(id, supporter);
    await this.persistSupporters();
    return supporter;
  }

  async getSupporterRecord(memberId: string, supporterId: string): Promise<Supporter | undefined> {
    await this.ensureInitialized();
    return Array.from(this.supporters.values()).find(
      (s) => s.memberId === memberId && s.supporterId === supporterId
    );
  }
}

export const storage = new FileStorage();
