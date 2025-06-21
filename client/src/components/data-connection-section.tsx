import { convertToCSV } from "@/lib/csv";
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
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const handleUrlConnect = () => {
    setStatus(`🔗 Connecting to URL: ${jdbcUrl}`);
    setTimeout(() => {
      setStatus("✅ URL Connection Successful (mocked).");
    }, 1000);
  };

  const handleAzureConnect = () => {
    if (!azureResource) {
      setStatus("⚠️ Please select an Azure resource first.");
      return;
    }
    setStatus(`☁️ Connecting to Azure: ${azureResource}`);
    setTimeout(() => {
      setStatus("✅ Azure SQL Connection Successful (mocked).");
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const uploaded = Array.from(files).map((f) => f.name);
      setFileNames(uploaded);
      setStatus(`📂 Uploaded: ${uploaded.join(", ")}`);
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
        {fileNames.length > 0 ? (
          // Show Run and Download buttons
          <div className="flex justify-between gap-4 mt-14">
            <Button
              onClick={async () => {
                try {
                  setStatus("📥 Fetching data...");

                  const response = await fetch(
                    "https://banking-compliance-api-724464214717.us-central1.run.app/api/data"
                  );

                  if (!response.ok) throw new Error("Download failed");

                  const jsonData = await response.json();

                  // Ensure it's an array
                  // if (!Array.isArray(jsonData)) {
                  //   throw new Error("Expected an array of data");
                  // }

                  const csv = convertToCSV(jsonData);

                  const blob = new Blob([csv], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "exported-data.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);

                  setStatus("✅ CSV download started");
                } catch (error) {
                  console.error(error);
                  setStatus("❌ Download failed");
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm flex items-center justify-center gap-2 neon-glow"
            >
              ⬇️ Download
            </Button>

            <Button
              onClick={() => {
                setStatus("▶️ LLM operation started");
              }}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm flex items-center justify-center gap-2 neon-glow"
            >
              ▶️ LLM
            </Button>
          </div>
        ) : (
          // Upload UI
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
        )}
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

      {/* Status Message */}
      {status && (
        <div className="col-span-full mt-4 text-center text-sm text-white bg-slate-800 p-2 rounded-lg">
          {status}
        </div>
      )}
    </div>
  );
}
