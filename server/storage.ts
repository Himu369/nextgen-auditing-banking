import { 
  users, 
  dormantAccounts, 
  complianceItems, 
  chatMessages, 
  sqlQueries,
  type User, 
  type InsertUser,
  type DormantAccount,
  type InsertDormantAccount,
  type ComplianceItem,
  type InsertComplianceItem,
  type ChatMessage,
  type InsertChatMessage,
  type SqlQuery,
  type InsertSqlQuery
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dormant account operations
  getDormantAccounts(): Promise<DormantAccount[]>;
  getDormantAccount(id: number): Promise<DormantAccount | undefined>;
  createDormantAccount(account: InsertDormantAccount): Promise<DormantAccount>;
  updateDormantAccountStatus(id: number, status: string): Promise<DormantAccount | undefined>;

  // Compliance operations
  getComplianceItems(): Promise<ComplianceItem[]>;
  getComplianceItem(id: number): Promise<ComplianceItem | undefined>;
  createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem>;
  updateComplianceItemStatus(id: number, status: string): Promise<ComplianceItem | undefined>;

  // Chat operations
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // SQL query operations
  getSqlQueries(userId: number): Promise<SqlQuery[]>;
  createSqlQuery(query: InsertSqlQuery): Promise<SqlQuery>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getDormantAccounts(): Promise<DormantAccount[]> {
    return await db.select().from(dormantAccounts);
  }

  async getDormantAccount(id: number): Promise<DormantAccount | undefined> {
    const [account] = await db.select().from(dormantAccounts).where(eq(dormantAccounts.id, id));
    return account || undefined;
  }

  async createDormantAccount(insertAccount: InsertDormantAccount): Promise<DormantAccount> {
    const [account] = await db
      .insert(dormantAccounts)
      .values(insertAccount)
      .returning();
    return account;
  }

  async updateDormantAccountStatus(id: number, status: string): Promise<DormantAccount | undefined> {
    const [account] = await db
      .update(dormantAccounts)
      .set({ status })
      .where(eq(dormantAccounts.id, id))
      .returning();
    return account || undefined;
  }

  async getComplianceItems(): Promise<ComplianceItem[]> {
    return await db.select().from(complianceItems);
  }

  async getComplianceItem(id: number): Promise<ComplianceItem | undefined> {
    const [item] = await db.select().from(complianceItems).where(eq(complianceItems.id, id));
    return item || undefined;
  }

  async createComplianceItem(insertItem: InsertComplianceItem): Promise<ComplianceItem> {
    const [item] = await db
      .insert(complianceItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateComplianceItemStatus(id: number, status: string): Promise<ComplianceItem | undefined> {
    const [item] = await db
      .update(complianceItems)
      .set({ status })
      .where(eq(complianceItems.id, id))
      .returning();
    return item || undefined;
  }

  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getSqlQueries(userId: number): Promise<SqlQuery[]> {
    return await db.select().from(sqlQueries).where(eq(sqlQueries.userId, userId));
  }

  async createSqlQuery(insertQuery: InsertSqlQuery): Promise<SqlQuery> {
    const [query] = await db
      .insert(sqlQueries)
      .values(insertQuery)
      .returning();
    return query;
  }
}

export const storage = new DatabaseStorage();
