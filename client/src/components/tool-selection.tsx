import { Button } from "@/components/ui/button";
import { Bed, Shield, MessageSquare, Database, Settings } from "lucide-react";

interface ToolSelectionProps {
  onToolSelect: (tool: "dormant" | "compliance" | "audit-chat" | "sql-bot") => void;
}

export function ToolSelection({ onToolSelect }: ToolSelectionProps) {
  return (
    <div className="glass-effect rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-green-400" />
        Analytics Tools
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Dormant Analyser */}
        <Button
          onClick={() => onToolSelect("dormant")}
          variant="ghost"
          className="glass-effect rounded-lg p-4 text-left hover:bg-white/5 transition-all module-card h-auto flex flex-col items-start"
        >
          <div className="flex items-center mb-2">
            <Bed className="text-yellow-500 text-xl mr-3" />
            <h3 className="font-semibold">Dormant Analyser</h3>
          </div>
          <p className="text-sm text-gray-400">Account dormancy tracking and analysis</p>
        </Button>
        
        {/* Compliance Analyser */}
        <Button
          onClick={() => onToolSelect("compliance")}
          variant="ghost"
          className="glass-effect rounded-lg p-4 text-left hover:bg-white/5 transition-all module-card h-auto flex flex-col items-start"
        >
          <div className="flex items-center mb-2">
            <Shield className="text-green-400 text-xl mr-3" />
            <h3 className="font-semibold">Compliance Analyser</h3>
          </div>
          <p className="text-sm text-gray-400">Regulatory compliance monitoring</p>
        </Button>
        
        {/* Internal Audit Chat */}
        <Button
          onClick={() => onToolSelect("audit-chat")}
          variant="ghost"
          className="glass-effect rounded-lg p-4 text-left hover:bg-white/5 transition-all module-card h-auto flex flex-col items-start"
        >
          <div className="flex items-center mb-2">
            <MessageSquare className="text-cyan-400 text-xl mr-3" />
            <h3 className="font-semibold">Internal Audit Chat</h3>
          </div>
          <p className="text-sm text-gray-400">AI-powered audit assistance</p>
        </Button>
        
        {/* SQL Bot */}
        <Button
          onClick={() => onToolSelect("sql-bot")}
          variant="ghost"
          className="glass-effect rounded-lg p-4 text-left hover:bg-white/5 transition-all module-card h-auto flex flex-col items-start"
        >
          <div className="flex items-center mb-2">
            <Database className="text-blue-500 text-xl mr-3" />
            <h3 className="font-semibold">SQL Bot</h3>
          </div>
          <p className="text-sm text-gray-400">Natural language to SQL converter</p>
        </Button>
      </div>
    </div>
  );
}
