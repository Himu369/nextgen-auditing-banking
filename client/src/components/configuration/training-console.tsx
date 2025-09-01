// client/src/components/configuration/training-console.tsx
"use client";
import React, { useState } from "react";
import { Send, Play, Copy, Download, Trash2, Sparkles } from "lucide-react";

interface TrainingConsoleProps {
  setMessage: (message: string | null) => void;
  setShowMessage: (show: boolean) => void;
}

export function TrainingConsole({
  setMessage,
  setShowMessage,
}: TrainingConsoleProps) {
  const [selectedSubOption, setSelectedSubOption] = useState<
    "Prompt" | "Fine Tune"
  >("Prompt");
  const [aiResponse, setAiResponse] = useState<string | null>(
    "• 12 incomplete contact attempts\n• 8 overdue compliance reviews\n• 3 high-value dormant accounts flagged"
  );
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleSendMessage = () => {
    setLoading(true);
    setMessage("Sending prompt...");
    setShowMessage(true);
    setTimeout(() => {
      setMessage("Prompt sent successfully!");
      setAiResponse(
        "• 15 policy violations detected\n• 6 overdue compliance checks\n• 4 high-risk accounts flagged"
      );
      setLoading(false);
    }, 1500);
  };

  const handleClearPrompt = () => {
    setMessage("Prompt cleared!");
    setShowMessage(true);
  };

  const handleRunQuery = () => {
    setMessage("Running query...");
    setShowMessage(true);
    setTimeout(() => {
      setMessage("Query executed!");
    }, 1500);
  };

  const handleCopyResponse = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      setMessage("AI Response copied!");
      setShowMessage(true);
    }
  };

  const handleDownloadResponse = () => {
    if (aiResponse) {
      const blob = new Blob([aiResponse], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ai-response.txt";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleClearResponse = () => {
    setAiResponse(null);
    setMessage("AI Response cleared!");
    setShowMessage(true);
  };

  return (
    <div className="flex-grow p-8 bg-white rounded-2xl shadow-lg overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        Optimize RAG Knowledge Base
      </h3>

      {/* Segmented Tabs */}
      <div className="flex space-x-4 mb-8">
        {["Prompt", "Fine Tune"].map((option) => (
          <button
            key={option}
            onClick={() =>
              setSelectedSubOption(option as "Prompt" | "Fine Tune")
            }
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 
            ${
              selectedSubOption === option
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Prompt Section */}
      {selectedSubOption === "Prompt" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col space-y-6">
            {/* Prompt Input */}
            <div className="bg-gray-200 border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Prompt
              </h4>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[120px] flex-grow"
                rows={4}
                placeholder="e.g., Show audit issues for Q1 2025..."
              ></textarea>
              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={handleSendMessage}
                  className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </button>
                <button
                  onClick={handleClearPrompt}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Test Query */}
            <div className="bg-gray-200 border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Test Query
              </h4>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg text-gray-900 placeholder-bg-gray-500 
                focus:outline-none focus:ring-2 focus:ring-green-500 resize-y min-h-[120px] flex-grow"
                rows={4}
                placeholder="SELECT * FROM audit_issues WHERE quarter = 'Q1 2025';"
              ></textarea>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleRunQuery}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Query
                </button>
              </div>
            </div>
          </div>

          {/* AI Response */}
          <div className="bg-gray-200 border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
              Response
            </h4>

            {/* Loading State */}
            {loading ? (
              <div className="animate-pulse bg-gray-100 rounded-lg p-4 h-40"></div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-sm flex-grow overflow-auto text-gray-900 whitespace-pre-line">
                {aiResponse ? aiResponse : "No response yet."}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCopyResponse}
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Copy className="w-4 h-4 mr-1" /> Copy
              </button>
              <button
                onClick={handleDownloadResponse}
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" /> Download
              </button>
              <button
                onClick={handleClearResponse}
                className="flex items-center text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fine Tune Section */}
      {selectedSubOption === "Fine Tune" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800">
              Fine Tune Options
            </h4>
            <p className="text-gray-600 mt-2">
              Adjust your model parameters and settings here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Parameter controls
            </div>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Training data upload
            </div>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Validation results
            </div>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Logs and metrics
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
