import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dormantAccounts = pgTable("dormant_accounts", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull().unique(),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull(),
  lastActivity: timestamp("last_activity").notNull(),
  customerName: text("customer_name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complianceItems = pgTable("compliance_items", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'user' or 'bot'
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sqlQueries = pgTable("sql_queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  naturalLanguage: text("natural_language").notNull(),
  generatedSQL: text("generated_sql").notNull(),
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertDormantAccountSchema = createInsertSchema(dormantAccounts).pick({
  accountId: true,
  balance: true,
  lastActivity: true,
  customerName: true,
  category: true,
  status: true,
});

export const insertComplianceItemSchema = createInsertSchema(complianceItems).pick({
  type: true,
  description: true,
  dueDate: true,
  status: true,
  priority: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  type: true,
  message: true,
});

export const insertSqlQuerySchema = createInsertSchema(sqlQueries).pick({
  userId: true,
  naturalLanguage: true,
  generatedSQL: true,
  executedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DormantAccount = typeof dormantAccounts.$inferSelect;
export type InsertDormantAccount = z.infer<typeof insertDormantAccountSchema>;
export type ComplianceItem = typeof complianceItems.$inferSelect;
export type InsertComplianceItem = z.infer<typeof insertComplianceItemSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type SqlQuery = typeof sqlQueries.$inferSelect;
export type InsertSqlQuery = z.infer<typeof insertSqlQuerySchema>;
