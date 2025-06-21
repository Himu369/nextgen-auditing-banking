import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageSquare, Send, Mic, Fan, Download, FileText, BarChart3, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface AuditChatProps {
  onClose: () => void;
}

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
  timestamp?: Date;
}

export function AuditChat({ onClose }: AuditChatProps) {
  const [question, setQuestion] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isUsingApi, setIsUsingApi] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Mutation for sending chat messages to API
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!isUsingApi || !apiEndpoint) {
        throw new Error("API not configured");
      }
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message,
          query: message,
          conversation_history: chatHistory.slice(-10) // Send last 10 messages for context
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: (data, message) => {
      const botResponse = data.response || data.message || data.answer || "I've processed your request.";
      setChatHistory(prev => [
        ...prev,
        { type: 'user', message, timestamp: new Date() },
        { type: 'bot', message: botResponse, timestamp: new Date() }
      ]);
    },
    onError: (error, message) => {
      console.error("Chat API error:", error);
      setChatHistory(prev => [
        ...prev,
        { type: 'user', message, timestamp: new Date() },
        { type: 'bot', message: `Error: ${error.message}. Using fallback response.`, timestamp: new Date() }
      ]);
    }
  });

  const handleSendMessage = () => {
    if (question.trim()) {
      if (isUsingApi) {
        chatMutation.mutate(question);
      } else {
        // Fallback behavior when API is not connected
        setChatHistory(prev => [
          ...prev,
          { type: 'user', message: question, timestamp: new Date() },
          { type: 'bot', message: 'I understand your audit inquiry. Currently in offline mode - please connect to your Python backend for AI-powered responses.', timestamp: new Date() }
        ]);
      }
      setQuestion("");
    }
  };

  const handleApiConnect = () => {
    if (apiEndpoint.trim()) {
      setIsUsingApi(true);
      setChatHistory([
        { type: 'bot', message: 'AI Audit Assistant connected. How can I help you with your audit analysis today?', timestamp: new Date() }
      ]);
    }
  };

  const handleQuickAction = (action: string) => {
    setQuestion(action);
  };

  const handleClear = () => {
    setChatHistory([]);
    setQuestion("");
  };

  const handleExport = () => {
    const chatData = chatHistory.map(msg => `[${msg.type.toUpperCase()}] ${msg.message}`).join('\n');
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-chat-export.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-effect rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <MessageSquare className="text-cyan-400 text-xl mr-3" />
          Internal Audit Chat Assistant
        </h2>
        <div className="flex space-x-2">
          <Button
            onClick={handleExport}
            variant="ghost"
            className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Chat
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      {!isUsingApi && (
        <div className="glass-effect rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Connect to Python Backend API</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="http://localhost:8000/api/chat"
              className="flex-1 bg-slate-900 border-gray-600 rounded-lg px-4 py-2 text-white"
            />
            <Button
              onClick={handleApiConnect}
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition-colors"
            >
              Connect API
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Expected API response format: {`{ "response": "string" }`} or {`{ "message": "string" }`}
          </p>
        </div>
      )}

      {/* Connection Status */}
      {isUsingApi && (
        <div className="glass-effect rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Chat API: {apiEndpoint}</span>
            <div className="flex items-center space-x-2">
              {chatMutation.isPending && <span className="text-xs text-blue-400">Sending...</span>}
              <span className="text-xs text-green-400">Connected</span>
              <Button
                onClick={() => setIsUsingApi(false)}
                variant="ghost"
                className="text-xs px-2 py-1"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Input Panel */}
        <div className="space-y-4">
          <div className="glass-effect rounded-lg p-4">
            <h3 className="font-semibold mb-3">Ask Your Question</h3>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-slate-900 border-gray-600 rounded-lg p-3 text-white resize-none"
              rows={4}
              placeholder="e.g., Show audit issues for Q1 2025..."
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={chatMutation.isPending || !question.trim()}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <Send className={`w-4 h-4 mr-2 ${chatMutation.isPending ? 'animate-pulse' : ''}`} />
                  {chatMutation.isPending ? 'Sending...' : 'Send'}
                </Button>
                <Button
                  variant="ghost"
                  className="glass-effect hover:bg-white/5 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Voice
                </Button>
              </div>
              <Button
                onClick={handleClear}
                variant="ghost"
                className="glass-effect hover:bg-white/5 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Fan className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="glass-effect rounded-lg p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => handleQuickAction("Generate Q1 audit summary")}
                variant="ghost"
                className="text-left glass-effect hover:bg-white/5 p-3 rounded-lg text-sm justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2 text-cyan-400" />
                Generate Q1 audit summary
              </Button>
              <Button
                onClick={() => handleQuickAction("Show critical findings")}
                variant="ghost"
                className="text-left glass-effect hover:bg-white/5 p-3 rounded-lg text-sm justify-start"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                Show critical findings
              </Button>
              <Button
                onClick={() => handleQuickAction("List completed audits")}
                variant="ghost"
                className="text-left glass-effect hover:bg-white/5 p-3 rounded-lg text-sm justify-start"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                List completed audits
              </Button>
            </div>
          </div>
        </div>
        
        {/* Chat Results Panel */}
        <div className="glass-effect rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">AI Response</h3>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                className="text-xs glass-effect hover:bg-white/5 px-3 py-1 rounded"
              >
                <FileText className="w-3 h-3 mr-1" />
                CSV
              </Button>
              <Button
                variant="ghost"
                className="text-xs glass-effect hover:bg-white/5 px-3 py-1 rounded"
              >
                <FileText className="w-3 h-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-lg p-4 h-80 overflow-y-auto space-y-4">
            {chatHistory.map((item, index) => (
              <div key={index} className={`${item.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs ${
                  item.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  {item.message}
                </div>
              </div>
            ))}
            
            <div className="glass-effect rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2">Critical Findings Summary:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 12 incomplete contact attempts</li>
                <li>• 8 overdue compliance reviews</li>
                <li>• 3 high-value dormant accounts flagged</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
