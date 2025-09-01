// client/src/pages/landing.tsx
"use client";

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  University,
  Bell,
  UserCircle,
  LogOut,
  Database,
  Settings,
} from "lucide-react";
import { DataConnectionSection } from "@/components/data-connection-section";
import { ToolSelection } from "@/components/tool-selection";
import { DormantAnalyser } from "@/components/dormant-analyser";
import { ComplianceAnalyser } from "@/components/compliance-analyser";
import { AuditChat } from "@/components/audit-chat";
import { SqlBot } from "@/components/sql-bot";
import { Configuration } from "@/components/configuration/configuration";
import { DataProvider } from "@/components/data-context"; // CORRECTED: Based on your file structure

type Tool = "dormant" | "compliance" | "audit-chat" | "sql-bot" | null;

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [currentTool, setCurrentTool] = useState<Tool>(null);
  const [showConfiguration, setShowConfiguration] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const showTool = (tool: Tool) => {
    setCurrentTool(tool);
    setShowConfiguration(false);
  };

  const hideTool = () => {
    setCurrentTool(null);
  };

  const handleShowConfiguration = () => {
    setShowConfiguration(true);
    setCurrentTool(null);
  };

  const handleCloseConfiguration = () => {
    setShowConfiguration(false);
  };

  return (
    // Wrap the entire application content that needs access to the data context
    <DataProvider>
      <div className="min-h-screen p-6">
        {/* Header Navigation */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <University className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  NextGen Auditing
                </h1>
                <p className="text-gray-400 text-sm">
                  Enterprise Analytics Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>

              <Button
                variant="ghost"
                className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
                onClick={handleShowConfiguration}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </Button>

              <Button
                variant="ghost"
                className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Conditional rendering for Configuration or other sections */}
        {showConfiguration ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Configuration onClose={handleCloseConfiguration} />
          </div>
        ) : (
          <>
            {/* Data Connection Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-cyan-400" />
                Data Connection Hub
              </h2>
              <DataConnectionSection />
            </section>

            {/* Tool Selection */}
            <section className="mb-8">
              <ToolSelection onToolSelect={showTool} />
            </section>

            {/* Tool Views */}
            {currentTool === "dormant" && (
              <div className="slide-in">
                <DormantAnalyser onClose={hideTool} />
              </div>
            )}

            {currentTool === "compliance" && (
              <div className="slide-in">
                <ComplianceAnalyser onClose={hideTool} />
              </div>
            )}

            {currentTool === "audit-chat" && (
              <div className="slide-in">
                <AuditChat onClose={hideTool} />
              </div>
            )}

            {currentTool === "sql-bot" && (
              <div className="slide-in">
                <SqlBot onClose={hideTool} />
              </div>
            )}
          </>
        )}
      </div>
    </DataProvider>
  );
}
