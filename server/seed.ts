import { db } from "./db";
import { users, dormantAccounts, complianceItems, chatMessages, sqlQueries } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Create test users
  const [testUser] = await db.insert(users).values({
    username: "admin",
    password: "admin123",
    email: "admin@nextgenbanking.com"
  }).returning();

  console.log("✅ Created test user");

  // Create dormant accounts with realistic data
  const dormantAccountsData = [
    {
      accountId: "ACC-001-DRM",
      balance: "125500.00",
      lastActivity: new Date("2024-03-15"),
      customerName: "Mohammed Al-Rashid",
      category: "High Value Dormant",
      status: "flagged"
    },
    {
      accountId: "ACC-002-DRM", 
      balance: "89750.50",
      lastActivity: new Date("2024-02-28"),
      customerName: "Fatima Al-Zahra",
      category: "Safe Deposit Dormancy",
      status: "pending"
    },
    {
      accountId: "ACC-003-DRM",
      balance: "67300.25",
      lastActivity: new Date("2024-04-10"),
      customerName: "Ahmed bin Sultan",
      category: "Investment Account Inactivity",
      status: "complete"
    },
    {
      accountId: "ACC-004-DRM",
      balance: "156780.00",
      lastActivity: new Date("2024-01-20"),
      customerName: "Aisha Al-Mansoori",
      category: "Fixed Deposit Inactivity", 
      status: "flagged"
    },
    {
      accountId: "ACC-005-DRM",
      balance: "45620.75",
      lastActivity: new Date("2024-05-05"),
      customerName: "Omar Al-Maktoum",
      category: "Demand Deposit Inactivity",
      status: "pending"
    }
  ];

  await db.insert(dormantAccounts).values(dormantAccountsData);
  console.log("✅ Created dormant accounts");

  // Create compliance items with CBUAE regulations
  const complianceData = [
    {
      type: "Contact Attempts",
      description: "Incomplete contact attempts for 156 dormant accounts as per CBUAE Article 3.2",
      dueDate: new Date("2025-01-15"),
      status: "pending",
      priority: "high"
    },
    {
      type: "Flag Candidates",
      description: "67 accounts flagged for dormancy but not yet processed under CBUAE guidelines",
      dueDate: new Date("2025-01-20"),
      status: "flagged", 
      priority: "critical"
    },
    {
      type: "Internal Ledger Transfer",
      description: "234 accounts eligible for internal ledger transfer as per Article 3.5",
      dueDate: new Date("2025-02-01"),
      status: "complete",
      priority: "medium"
    },
    {
      type: "Statement Freeze",
      description: "89 accounts requiring statement freeze under Article 7.3",
      dueDate: new Date("2025-01-25"),
      status: "pending",
      priority: "high"
    },
    {
      type: "CBUAE Transfer",
      description: "123 accounts ready for CBUAE transfer under Article 8",
      dueDate: new Date("2025-02-15"),
      status: "flagged",
      priority: "urgent"
    }
  ];

  await db.insert(complianceItems).values(complianceData);
  console.log("✅ Created compliance items");

  // Create sample chat messages
  const chatData = [
    {
      userId: testUser.id,
      type: "user",
      message: "Show me all high-value dormant accounts above 100K AED"
    },
    {
      userId: testUser.id,
      type: "bot", 
      message: "I found 2 high-value dormant accounts above 100K AED. ACC-001-DRM with 125,500 AED (last activity: March 15, 2024) and ACC-004-DRM with 156,780 AED (last activity: January 20, 2024). Both accounts require immediate attention under CBUAE regulations."
    }
  ];

  await db.insert(chatMessages).values(chatData);
  console.log("✅ Created chat messages");

  // Create sample SQL queries
  const sqlData = [
    {
      userId: testUser.id,
      naturalLanguage: "Show top 10 dormant accounts with highest balance",
      generatedSQL: `SELECT account_id, customer_name, balance, last_activity 
FROM dormant_accounts 
WHERE status = 'flagged' 
ORDER BY CAST(balance AS DECIMAL) DESC 
LIMIT 10;`,
      executedAt: new Date()
    },
    {
      userId: testUser.id,
      naturalLanguage: "Find all compliance items due this month",
      generatedSQL: `SELECT type, description, due_date, priority 
FROM compliance_items 
WHERE due_date BETWEEN '2025-01-01' AND '2025-01-31' 
ORDER BY priority DESC, due_date ASC;`
    }
  ];

  await db.insert(sqlQueries).values(sqlData);
  console.log("✅ Created SQL queries");

  console.log("🎉 Database seeding completed successfully!");
}

seedDatabase().catch(console.error);