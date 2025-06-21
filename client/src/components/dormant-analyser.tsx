import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { X, Bed, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DormantAnalyserProps {
  onClose: () => void;
}

interface ModuleData {
  title: string;
  count: string;
  status: "pending" | "complete" | "flagged" | "urgent" | "critical";
  statusText: string;
}

export function DormantAnalyser({ onClose }: DormantAnalyserProps) {
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isUsingApi, setIsUsingApi] = useState(false);

  // Query for API data
  const { data: apiData, isLoading, error, refetch } = useQuery({
    queryKey: ['dormant-analyser-data'],
    queryFn: async () => {
      if (!apiEndpoint || !isUsingApi) return null;
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error('Failed to fetch dormant data');
      return response.json();
    },
    enabled: isUsingApi && !!apiEndpoint,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fallback static data
  const staticModuleData: ModuleData[] = [
    { title: "Safe Deposit Dormancy", count: "1,247", status: "pending", statusText: "Pending Review" },
    { title: "Investment Account Inactivity", count: "892", status: "flagged", statusText: "Action Required" },
    { title: "Fixed Deposit Inactivity", count: "543", status: "complete", statusText: "Up to Date" },
    { title: "Demand Deposit Inactivity", count: "2,156", status: "pending", statusText: "Processing" },
    { title: "Unclaimed Payment Instruments", count: "789", status: "flagged", statusText: "Critical" },
    { title: "Eligible for CBUAE Transfer", count: "234", status: "complete", statusText: "Ready" },
    { title: "Article 3 Process Needed", count: "167", status: "pending", statusText: "In Progress" },
    { title: "Contact Attempts Needed", count: "445", status: "flagged", statusText: "Urgent" },
    { title: "High Value Dormant (≥25K AED)", count: "89", status: "flagged", statusText: "Priority" },
    { title: "Dormant to Active Transitions", count: "312", status: "complete", statusText: "Monitored" },
  ];

  // Use API data if available, otherwise use static data
  const moduleData = apiData?.modules || staticModuleData;

  const handleModuleClick = async (title: string) => {
    console.log("Opening detailed view for:", title);
    
    // Make additional API call for detailed module data if endpoint is configured
    if (isUsingApi && apiEndpoint) {
      try {
        const detailEndpoint = apiEndpoint.replace('/dormant', `/dormant/details/${encodeURIComponent(title)}`);
        const response = await fetch(detailEndpoint);
        if (response.ok) {
          const detailData = await response.json();
          console.log("Detailed data:", detailData);
        }
      } catch (error) {
        console.error("Failed to fetch detailed data:", error);
      }
    }
  };

  const handleApiConnect = () => {
    if (apiEndpoint.trim()) {
      setIsUsingApi(true);
      refetch();
    }
  };

  const handleRefresh = () => {
    if (isUsingApi) {
      refetch();
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Bed className="text-yellow-500 text-xl mr-3" />
          Dormant Analyser Dashboard
        </h2>
        <div className="flex space-x-2">
          {isUsingApi && (
            <Button
              onClick={handleRefresh}
              variant="ghost"
              disabled={isLoading}
              className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
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
              placeholder="http://localhost:8000/api/dormant"
              className="flex-1 bg-slate-900 border-gray-600 rounded-lg px-4 py-2 text-white"
            />
            <Button
              onClick={handleApiConnect}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
            >
              Connect API
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Expected API response format: {`{ "modules": [{ "title": "string", "count": "string", "status": "pending|complete|flagged|urgent|critical", "statusText": "string" }] }`}
          </p>
        </div>
      )}

      {/* Connection Status */}
      {isUsingApi && (
        <div className="glass-effect rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">API Endpoint: {apiEndpoint}</span>
            <div className="flex items-center space-x-2">
              {isLoading && <span className="text-xs text-blue-400">Loading...</span>}
              {error && <span className="text-xs text-red-400">Connection Error</span>}
              {!isLoading && !error && apiData && <span className="text-xs text-green-400">Connected</span>}
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

      {/* Error Display */}
      {error && (
        <div className="glass-effect rounded-lg p-4 mb-4 border border-red-500">
          <p className="text-red-400 text-sm">
            Failed to connect to API: {error.message}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Using fallback data. Check your Python backend is running and the endpoint is correct.
          </p>
        </div>
      )}
      
      {/* Dormant Analysis Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleData.map((module, index) => (
          <div
            key={index}
            className="glass-effect rounded-lg p-4 module-card cursor-pointer"
            onClick={() => handleModuleClick(module.title)}
          >
            <h3 className="font-semibold mb-2 text-sm">{module.title}</h3>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${
                module.status === "complete" ? "text-green-400" :
                module.status === "flagged" ? "text-cyan-400" :
                "text-yellow-400"
              }`}>
                {module.count}
              </span>
              <StatusChip status={module.status}>
                {module.statusText}
              </StatusChip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
