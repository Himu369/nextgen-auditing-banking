export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface DormantAccount {
  id: string;
  accountId: string;
  balance: number;
  lastActivity: string;
  customerName: string;
  category: string;
  status: "pending" | "flagged" | "complete";
}

export interface ComplianceItem {
  id: string;
  type: string;
  description: string;
  dueDate: string;
  status: "pending" | "complete" | "flagged" | "urgent" | "critical";
  priority: "low" | "medium" | "high";
}

export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

export interface SQLQuery {
  id: string;
  naturalLanguage: string;
  generatedSQL: string;
  results?: any[];
  executedAt?: Date;
}
