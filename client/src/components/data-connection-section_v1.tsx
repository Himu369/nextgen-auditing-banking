import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, Upload, Cloud, Database } from "lucide-react";

export function DataConnectionSection() {
  const [jdbcUrl, setJdbcUrl] = useState("");
  const [azureResource, setAzureResource] = useState("");

  const handleUrlConnect = () => {
    console.log("Connecting to URL:", jdbcUrl);
  };

  const handleAzureConnect = () => {
    console.log("Connecting to Azure resource:", azureResource);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log(
        "Files uploaded:",
        Array.from(files).map((f) => f.name)
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* URL Connection */}
      <div className="glass-effect rounded-xl p-6 module-card">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
            <Link className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-semibold">URL Connection</h3>
            <p className="text-sm text-gray-400">JDBC, APIs, Endpoints</p>
          </div>
        </div>
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="jdbc://server:port/database"
            value={jdbcUrl}
            onChange={(e) => setJdbcUrl(e.target.value)}
            className="w-full bg-slate-900 border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
          />
          <Button
            onClick={handleUrlConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm transition-colors"
          >
            <Link className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <div className="glass-effect rounded-xl p-6 module-card">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
            <Upload className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-semibold">File Upload</h3>
            <p className="text-sm text-gray-400">CSV, Excel, JSON</p>
          </div>
        </div>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.json"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto text-2xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">
              Drop files or click to browse
            </p>
          </label>
        </div>
      </div>

      {/* Azure SQL */}
      <div className="glass-effect rounded-xl p-6 module-card">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center mr-4">
            <Database className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-semibold">Azure SQL Database</h3>
            <p className="text-sm text-gray-400">Cloud Database</p>
          </div>
        </div>
        <div className="space-y-3">
          <Select value={azureResource} onValueChange={setAzureResource}>
            <SelectTrigger className="w-full bg-slate-900 border-gray-600 rounded-lg px-3 py-2 text-sm text-white">
              <SelectValue placeholder="Select Azure Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banking-analytics">
                Banking-Analytics-DB
              </SelectItem>
              <SelectItem value="compliance-warehouse">
                Compliance-Data-Warehouse
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleAzureConnect}
            className="w-full bg-cyan-400 hover:bg-cyan-500 py-2 rounded-lg text-sm transition-colors"
          >
            <Cloud className="w-4 h-4 mr-2" />
            Connect Azure
          </Button>
        </div>
      </div>
    </div>
  );
}
