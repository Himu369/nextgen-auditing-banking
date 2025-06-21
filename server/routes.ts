import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertDormantAccountSchema, 
  insertComplianceItemSchema,
  insertChatMessageSchema,
  insertSqlQuerySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (user && user.password === password) {
        res.json({ success: true, user: { id: user.id, username: user.username } });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        res.status(400).json({ success: false, message: "Username already exists" });
        return;
      }

      const user = await storage.createUser(userData);
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  });

  // Dormant accounts routes
  app.get("/api/dormant-accounts", async (req, res) => {
    try {
      const accounts = await storage.getDormantAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dormant accounts" });
    }
  });

  app.post("/api/dormant-accounts", async (req, res) => {
    try {
      const accountData = insertDormantAccountSchema.parse(req.body);
      const account = await storage.createDormantAccount(accountData);
      res.json(account);
    } catch (error) {
      res.status(400).json({ message: "Invalid account data" });
    }
  });

  app.patch("/api/dormant-accounts/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const account = await storage.updateDormantAccountStatus(id, status);
      
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update account status" });
    }
  });

  // Compliance items routes
  app.get("/api/compliance-items", async (req, res) => {
    try {
      const items = await storage.getComplianceItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance items" });
    }
  });

  app.post("/api/compliance-items", async (req, res) => {
    try {
      const itemData = insertComplianceItemSchema.parse(req.body);
      const item = await storage.createComplianceItem(itemData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid compliance item data" });
    }
  });

  app.patch("/api/compliance-items/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const item = await storage.updateComplianceItemStatus(id, status);
      
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: "Compliance item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update compliance item status" });
    }
  });

  // Chat messages routes
  app.get("/api/chat-messages/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      
      // Simulate AI response
      if (messageData.type === "user") {
        const botResponse = await storage.createChatMessage({
          userId: messageData.userId,
          type: "bot",
          message: "I'm processing your request. Here's what I found..."
        });
        res.json([message, botResponse]);
      } else {
        res.json(message);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // SQL queries routes
  app.get("/api/sql-queries/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const queries = await storage.getSqlQueries(userId);
      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SQL queries" });
    }
  });

  app.post("/api/sql-queries/generate", async (req, res) => {
    try {
      const { naturalLanguage, userId } = req.body;
      
      // Simple SQL generation logic (in real app, this would use AI)
      let generatedSQL = "SELECT * FROM accounts WHERE 1=1";
      
      if (naturalLanguage.toLowerCase().includes("dormant")) {
        generatedSQL = `SELECT account_id, balance, last_activity_date, customer_name 
FROM dormant_accounts 
WHERE last_activity_date < DATE_SUB(NOW(), INTERVAL 6 MONTH)
ORDER BY balance DESC`;
      }
      
      if (naturalLanguage.toLowerCase().includes("high value") || naturalLanguage.toLowerCase().includes("50k")) {
        generatedSQL += " AND balance >= 50000";
      }

      const queryData = insertSqlQuerySchema.parse({
        userId,
        naturalLanguage,
        generatedSQL
      });
      
      const query = await storage.createSqlQuery(queryData);
      res.json(query);
    } catch (error) {
      res.status(400).json({ message: "Failed to generate SQL" });
    }
  });

  app.post("/api/sql-queries/execute", async (req, res) => {
    try {
      const { sqlQuery } = req.body;
      
      // Mock execution results (in real app, this would execute against actual DB)
      const mockResults = [
        { account_id: "ACC-001", balance: 125500, last_activity_date: "2024-03-15", customer_name: "John Doe" },
        { account_id: "ACC-002", balance: 98750, last_activity_date: "2024-02-28", customer_name: "Jane Smith" },
        { account_id: "ACC-003", balance: 87300, last_activity_date: "2024-04-10", customer_name: "Bob Johnson" }
      ];
      
      res.json({ results: mockResults, rowCount: mockResults.length });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute SQL query" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
