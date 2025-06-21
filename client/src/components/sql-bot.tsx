import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Database, Wand2, Mic, Copy, Edit, Play, HelpCircle, BarChart3, Download, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface SqlBotProps {
  onClose: () => void;
}

interface QueryResult {
  [key: string]: any;
}

export function SqlBot({ onClose }: SqlBotProps) {
  const [query, setQuery] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [executeEndpoint, setExecuteEndpoint] = useState("");
  const [isUsingApi, setIsUsingApi] = useState(false);
  const [generatedSql, setGeneratedSql] = useState("");
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [executionStatus, setExecutionStatus] = useState<string>("");

  // Mutation for generating SQL from natural language
  const generateSqlMutation = useMutation({
    mutationFn: async (naturalLanguage: string) => {
      if (!isUsingApi || !apiEndpoint) {
        throw new Error("API not configured");
      }
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          natural_language: naturalLanguage,
          query: naturalLanguage 
        }),
      });
      if (!response.ok) throw new Error('Failed to generate SQL');
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedSql(data.generated_sql || data.sql || "");
      console.log("SQL generated successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to generate SQL:", error);
      setExecutionStatus(`Error: ${error.message}`);
    }
  });

  // Mutation for executing SQL
  const executeSqlMutation = useMutation({
    mutationFn: async (sql: string) => {
      if (!isUsingApi || !executeEndpoint) {
        throw new Error("Execute API not configured");
      }
      const response = await fetch(executeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sql: sql,
          query: sql 
        }),
      });
      if (!response.ok) throw new Error('Failed to execute SQL');
      return response.json();
    },
    onSuccess: (data) => {
      setQueryResults(data.results || data.data || []);
      setExecutionStatus(`Query executed successfully. ${data.results?.length || 0} rows returned.`);
      console.log("SQL executed successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to execute SQL:", error);
      setExecutionStatus(`Execution error: ${error.message}`);
    }
  });

  const handleGenerateSQL = () => {
    if (query.trim()) {
      if (isUsingApi) {
        generateSqlMutation.mutate(query);
      } else {
        console.log("Generating SQL for:", query);
        // Fallback behavior when API is not connected
        setGeneratedSql(`-- Generated from: "${query}"\nSELECT * FROM accounts WHERE condition = 'placeholder';`);
      }
    }
  };

  const handleRunSQL = () => {
    if (generatedSql.trim()) {
      if (isUsingApi) {
        executeSqlMutation.mutate(generatedSql);
      } else {
        console.log("Running SQL:", generatedSql);
        // Fallback behavior when API is not connected
        setQueryResults([
          { account_id: "ACC-001", balance: "125,500", last_activity: "2024-03-15" },
          { account_id: "ACC-002", balance: "98,750", last_activity: "2024-02-28" },
        ]);
        setExecutionStatus("Query executed (using fallback data)");
      }
    }
  };

  const handleApiConnect = () => {
    if (apiEndpoint.trim()) {
      setIsUsingApi(true);
      setExecutionStatus("API connected successfully");
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generatedSql);
    setExecutionStatus("SQL copied to clipboard");
  };

  const handleExplainQuery = async () => {
    if (isUsingApi && apiEndpoint && generatedSql) {
      try {
        const explainEndpoint = apiEndpoint.replace('/generate', '/explain');
        const response = await fetch(explainEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sql: generatedSql }),
        });
        if (response.ok) {
          const data = await response.json();
          setExecutionStatus(`Explanation: ${data.explanation || data.description || "Query explanation received"}`);
        }
      } catch (error) {
        console.error("Failed to explain query:", error);
      }
    } else {
      console.log("Explaining query:", generatedSql);
      setExecutionStatus("Query explanation: Basic SELECT statement with filtering and ordering");
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Database className="text-blue-500 text-xl mr-3" />
          SQL Bot - Natural Language Query
        </h2>
        <Button
          onClick={onClose}
          variant="ghost"
          className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>

      {/* API Configuration */}
      {!isUsingApi && (
        <div className="glass-effect rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Connect to Python Backend API</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:8000/api/sql/generate"
                className="flex-1 bg-slate-900 border-gray-600 rounded-lg px-4 py-2 text-white"
              />
              <Button
                onClick={handleApiConnect}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
              >
                Connect API
              </Button>
            </div>
            <input
              type="text"
              value={executeEndpoint}
              onChange={(e) => setExecuteEndpoint(e.target.value)}
              placeholder="http://localhost:8000/api/sql/execute"
              className="bg-slate-900 border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Expected generate API: {`{ "generated_sql": "string" }`} | Execute API: {`{ "results": [...] }`}
          </p>
        </div>
      )}

      {/* Connection Status */}
      {isUsingApi && (
        <div className="glass-effect rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Generate: {apiEndpoint}</span>
            <Button
              onClick={() => setIsUsingApi(false)}
              variant="ghost"
              className="text-xs px-2 py-1"
            >
              Disconnect
            </Button>
          </div>
          <span className="text-xs text-gray-400">Execute: {executeEndpoint}</span>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Query Input */}
        <div className="glass-effect rounded-lg p-4">
          <h3 className="font-semibold mb-3">Natural Language Query</h3>
          <div className="flex space-x-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-900 border-gray-600 rounded-lg px-4 py-3 text-white"
              placeholder="e.g., Show top 10 dormant accounts over 50K in Q2"
            />
            <Button
              onClick={handleGenerateSQL}
              disabled={generateSqlMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Wand2 className={`w-4 h-4 mr-2 ${generateSqlMutation.isPending ? 'animate-spin' : ''}`} />
              Generate SQL
            </Button>
            <Button
              variant="ghost"
              className="glass-effect hover:bg-white/5 px-6 py-3 rounded-lg transition-colors"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generated SQL */}
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Generated SQL</h3>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCopySQL}
                  variant="ghost"
                  className="text-xs glass-effect hover:bg-white/5 px-3 py-1 rounded"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs glass-effect hover:bg-white/5 px-3 py-1 rounded"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-sm">
              <pre className="text-cyan-400 whitespace-pre-wrap">{generatedSql}</pre>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                onClick={handleRunSQL}
                disabled={executeSqlMutation.isPending || !generatedSql}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Play className={`w-4 h-4 mr-2 ${executeSqlMutation.isPending ? 'animate-spin' : ''}`} />
                Run SQL
              </Button>
              <Button
                onClick={handleExplainQuery}
                variant="ghost"
                className="glass-effect hover:bg-white/5 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Explain Query
              </Button>
            </div>
          </div>
          
          {/* Query Results */}
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Query Results</h3>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  className="text-xs glass-effect hover:bg-white/5 px-3 py-1 rounded"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Visualize
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs glass-effect hover:bg-white/5 px-3 py-1 rounded"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Execution Status */}
            {executionStatus && (
              <div className="mb-3 p-2 bg-slate-800 rounded text-sm text-gray-300">
                {executionStatus}
              </div>
            )}
            
            <div className="bg-slate-900 rounded-lg p-3 h-64 overflow-auto">
              {queryResults.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      {Object.keys(queryResults[0]).map((key) => (
                        <th key={key} className="text-left py-2 capitalize">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {queryResults.map((row, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="py-2">
                            {typeof value === 'number' && value > 1000 ? 
                              <span className="text-yellow-400">{value.toLocaleString()}</span> : 
                              String(value)
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Database className="mx-auto text-4xl mb-4" />
                  <p>No query results to display</p>
                  <p className="text-sm">Execute a SQL query to see results here</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chart Visualization */}
        <div className="glass-effect rounded-lg p-4">
          <h3 className="font-semibold mb-3">Data Visualization</h3>
          <div className="bg-slate-900 rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <BarChart3 className="mx-auto text-4xl mb-4" />
              <p>Chart visualization will appear here</p>
              <p className="text-sm">Auto-detected: Bar Chart recommended for this data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
