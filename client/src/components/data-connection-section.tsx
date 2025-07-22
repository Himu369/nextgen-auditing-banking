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
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [selectedUploadMethod, setSelectedUploadMethod] = useState<
    string | null
  >("fileUpload"); // Default to fileUpload

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", "");

    try {
      setStatus("📤 Uploading file...");
      const res = await fetch(
        "https://banking-compliance-api-724464214717.us-central1.run.app/upload/file",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      if (json.success && json.file_id) {
        setUploadedFileId(json.file_id);
        setFileNames([file.name]);
        setStatus(`✅ Uploaded: ${file.name}`);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setStatus("❌ File upload failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {" "}
        {/* Use flex-row for side-by-side */}
        {/* Data Connection Hub (left column) */}
        <div className="glass-effect rounded-xl p-4 module-card flex-1">
          {" "}
          {/* flex-1 allows it to grow */}
          {/* URL Connection */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center mr-4">
              <Database className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Data Connection Hub
            </h2>
          </div>
          <h3 className="font-semibold mb-4">Select upload method:</h3>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="uploadMethod"
                value="fileUpload"
                checked={selectedUploadMethod === "fileUpload"}
                onChange={() => setSelectedUploadMethod("fileUpload")}
                className="form-radio h-4 w-4 text-yellow-500 transition-colors duration-200"
              />
              <span className="ml-2 text-white">
                Upload File (CSV/XLSX/JSON)
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="uploadMethod"
                value="urlConnection"
                checked={selectedUploadMethod === "urlConnection"}
                onChange={() => setSelectedUploadMethod("urlConnection")}
                className="form-radio h-4 w-4 text-blue-600 transition-colors duration-200"
              />
              <span className="ml-2 text-white">Upload via URL</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="uploadMethod"
                value="azureSql"
                checked={selectedUploadMethod === "azureSql"}
                onChange={() => setSelectedUploadMethod("azureSql")}
                className="form-radio h-4 w-4 text-cyan-400 transition-colors duration-200"
              />
              <span className="ml-2 text-white">
                Load Data from Azure SQL Database
              </span>
            </label>
          </div>
        </div>
        {/* Dynamic Content (right column) */}
        <div className="flex-1">
          {" "}
          {/* This div will hold the selected component */}
          {selectedUploadMethod === "urlConnection" && (
            <div className="glass-effect rounded-xl p-6 module-card h-full">
              {" "}
              {/* Added h-full for consistent height */}
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
          )}
          {/* File upload */}
          {selectedUploadMethod === "fileUpload" && (
            <div className="glass-effect rounded-xl p-6 module-card h-full">
              {" "}
              {/* Added h-full for consistent height */}
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
                <div className="flex justify-between gap-4 mt-14">
                  <Button
                    onClick={async () => {
                      try {
                        if (!uploadedFileId) {
                          setStatus("⚠️ No uploaded file to download.");
                          return;
                        }

                        setStatus("⬇️ Downloading file...");
                        const res = await fetch(
                          `https://banking-compliance-api-724464214717.us-central1.run.app/download/${uploadedFileId}`
                        );

                        if (!res.ok) throw new Error("❌ File download failed");

                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `${uploadedFileId}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);

                        setStatus("✅ CSV downloaded successfully!");
                      } catch (err) {
                        console.error("❌ Download error:", err);
                        setStatus("❌ Failed to download CSV");
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm flex items-center justify-center gap-2 neon-glow"
                  >
                    ⬇️ Download
                  </Button>

                  <Button
                    onClick={async () => {
                      try {
                        setStatus("🤖 Running LLM analysis...");
                        const res = await fetch(
                          "https://banking-compliance-api-724464214717.us-central1.run.app/mapping/analyze"
                        );

                        if (!res.ok) {
                          const errorText = await res.text();
                          console.error(
                            "❌ Server error:",
                            res.status,
                            errorText
                          );
                          throw new Error("Failed to fetch LLM analysis");
                        }

                        const data = await res.json();

                        if (!data.success) {
                          setStatus("⚠️ LLM API responded with failure");
                          return;
                        }

                        setStatus(
                          `✅ LLM Analysis: ${data.mapped_columns} mapped, ${data.unmapped_columns} unmapped.`
                        );
                      } catch (err) {
                        console.error("❌ LLM operation failed:", err);
                        setStatus("❌ LLM operation failed");
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm flex items-center justify-center gap-2 neon-glow"
                  >
                    ▶️ LLM
                  </Button>
                </div>
              ) : (
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
          )}
          {/* Azure SQL */}
          {selectedUploadMethod === "azureSql" && (
            <div className="glass-effect rounded-xl p-6 module-card h-full">
              {" "}
              {/* Added h-full for consistent height */}
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
          )}
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
