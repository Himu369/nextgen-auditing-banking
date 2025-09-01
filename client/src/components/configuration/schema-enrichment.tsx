// client/src/components/configuration/schema-enrichment.tsx
"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Download, Database, Link } from "lucide-react";
import axios from "axios";
import { useDataInsights } from "@/components/data-context";

interface SchemaEnrichmentProps {
  setMessage: (message: string | null) => void;
  setShowMessage: (show: boolean) => void;
}

export function SchemaEnrichment({
  setMessage,
  setShowMessage,
}: SchemaEnrichmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = React.useState<"file" | "url">(
    "file"
  );
  const [urlInput, setUrlInput] = React.useState<string>("");

  const {
    recordsProcessed,
    setRecordsProcessed,
    missingValuePercentage,
    setMissingValuePercentage,
    qualityScore,
    setQualityScore,
    aiKeyFindings,
    setAiKeyFindings,
    aiRecommendations,
    setAiRecommendations,
    currentWorkflowId,
    setCurrentWorkflowId,
    resetInsights,
  } = useDataInsights();

  const fetchAIInsights = async (workflowId: string) => {
    try {
      const aiInsightsUrl = `https://upload-api-lpl4aen32q-uc.a.run.app/api/ai-insights/${workflowId}`;
      const response = await axios.get(aiInsightsUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.data && response.data.ai_analysis) {
        setAiKeyFindings(response.data.ai_analysis.key_findings || []);
        setAiRecommendations(response.data.ai_analysis.recommendations || []);
      } else {
        console.error(
          "Failed to retrieve AI insights or ai_analysis data is missing for workflowId:",
          workflowId
        );
        setAiKeyFindings([]);
        setAiRecommendations([]);
      }
    } catch (error: any) {
      console.error("Error fetching AI insights:", error);
      setAiKeyFindings([]);
      setAiRecommendations([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setMessage(`File selected: ${event.target.files[0].name}`);
      setShowMessage(true);
      resetInsights();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      setShowMessage(true);
      return;
    }

    setMessage("Uploading file...");
    setShowMessage(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const uploadUrl =
        "https://upload-api-lpl4aen32q-uc.a.run.app/upload-csv/?user_id=default_user";

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.data) {
        setMessage(
          response.data.message || "File uploaded and processed successfully."
        );
        setShowMessage(true);

        console.log("Full POST API Response Data:", response.data);

        setRecordsProcessed(
          response.data.database_save_result?.total_records || 0
        );

        setQualityScore(
          Number(
            parseFloat(
              response.data.data_quality?.overall_score || "0"
            ).toFixed(3)
          ) || 0
        );

        const missingPercentage =
          response.data.data_quality?.missing_data_analysis
            ?.overall_missing_percentage ??
          response.data.missing_data_analysis?.overall_missing_percentage ??
          "0";
        setMissingValuePercentage(parseFloat(missingPercentage) || 0);

        const workflowId = response.data.workflow_id;
        if (workflowId) {
          setCurrentWorkflowId(workflowId);
          fetchAIInsights(workflowId);
        } else {
          setMessage(
            "File uploaded successfully, but detailed insights could not be retrieved (missing workflow ID)."
          );
          setShowMessage(true);
        }
      } else {
        setMessage(
          `Upload failed: ${
            response.data.message || response.data.error || "Unknown error."
          }`
        );
        setShowMessage(true);
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      let errorMessage = `Error uploading file: ${
        error.message || "Please check console for details."
      }`;
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Upload failed: ${
          error.response.data.message || error.response.statusText
        }`;
      }
      setMessage(errorMessage);
      setShowMessage(true);
    }
  };

  const handleUrlConnect = async () => {
    if (!urlInput.trim()) {
      setMessage("Please enter a URL to connect.");
      setShowMessage(true);
      return;
    }

    setMessage(`Connecting to URL: ${urlInput}...`);
    setShowMessage(true);

    try {
      const response = await axios.post(
        "YOUR_URL_CONNECTION_API_ENDPOINT",
        { url: urlInput },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setMessage(
          `URL connection successful: ${
            response.data.message || "Data fetched from URL."
          }`
        );
      } else {
        setMessage(
          `URL connection failed: ${
            response.data.message || response.data.error || "Unknown error."
          }`
        );
      }
    } catch (error: any) {
      console.error("Error connecting to URL:", error);
      let errorMessage = `Error connecting: ${
        error.message || "Please check console for details."
      }`;
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Connection failed: ${
          error.response.data.message || error.response.statusText
        }`;
      }
      setMessage(errorMessage);
    } finally {
      setShowMessage(true);
    }
  };

  const handleDownloadMappingSheet = async () => {
    if (!currentWorkflowId) {
      setMessage(
        "Please upload a file first to generate insights and enable download."
      );
      setShowMessage(true);
      return;
    }

    setMessage("Downloading mapping sheet...");
    setShowMessage(true);

    try {
      const downloadUrl = `https://upload-api-lpl4aen32q-uc.a.run.app/download-mapping-sheet/${currentWorkflowId}`;
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `mapping_sheet_${currentWorkflowId}.csv`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("Mapping sheet downloaded successfully!");
    } catch (error: any) {
      console.error("Error downloading mapping sheet:", error);
      let errorMessage = `Error downloading file: ${
        error.message || "Please check console for details."
      }`;

      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = function (event) {
              try {
                const errorText = event.target?.result as string;
                const errorJson = JSON.parse(errorText);
                setMessage(
                  `Download failed: ${
                    errorJson.message || error.response?.statusText
                  }`
                );
              } catch (parseError) {
                setMessage(
                  `Download failed: ${
                    error.response?.statusText || "Unknown response error"
                  }`
                );
              }
            };
            reader.readAsText(error.response.data);
          } else {
            setMessage(
              `Download failed: ${
                (error.response.data as any)?.message ||
                error.response.statusText
              }`
            );
          }
        } else {
          setMessage(
            `Download failed: Network error or no response from server.`
          );
        }
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setShowMessage(true);
    }
  };

  const handleDownloadCsvMappingFile = async () => {
    if (!currentWorkflowId) {
      setMessage(
        "Please upload a file first to generate insights and enable download."
      );
      setShowMessage(true);
      return;
    }

    setMessage("Downloading CSV mapping file...");
    setShowMessage(true);

    try {
      const downloadUrl = `https://upload-api-lpl4aen32q-uc.a.run.app/download-processed-data/${currentWorkflowId}`;
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `processed_data_${currentWorkflowId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("CSV mapping file downloaded successfully!");
    } catch (error: any) {
      console.error("Error downloading CSV mapping file:", error);
      let errorMessage = `Error downloading file: ${
        error.message || "Please check console for details."
      }`;

      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = function (event) {
              try {
                const errorText = event.target?.result as string;
                const errorJson = JSON.parse(errorText);
                setMessage(
                  `Download failed: ${
                    errorJson.message || error.response?.statusText
                  }`
                );
              } catch (parseError) {
                setMessage(
                  `Download failed: ${
                    error.response?.statusText || "Unknown response error"
                  }`
                );
              }
            };
            reader.readAsText(error.response.data);
          } else {
            setMessage(
              `Download failed: ${
                (error.response.data as any)?.message ||
                error.response.statusText
              }`
            );
          }
        } else {
          setMessage(
            `Download failed: Network error or no response from server.`
          );
        }
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setShowMessage(true);
    }
  };

  return (
    <div className="flex-grow p-8 bg-white rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* Data Connection Hub Section */}
      <div className="bg-white text-gray-800 rounded-lg p-6 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Select Upload Method */}
          <div className="md:w-1/2">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-3 rounded-lg mr-4">
                <Database size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Data Connection Hub</h3>
                <p className="text-gray-600 text-sm">Select upload method:</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="file"
                  checked={uploadMethod === "file"}
                  onChange={() => {
                    setUploadMethod("file");
                    setSelectedFile(null);
                    setMessage(null);
                    setShowMessage(false);
                    resetInsights();
                  }}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">
                  Upload File (CSV/XLSX/JSON)
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="url"
                  checked={uploadMethod === "url"}
                  onChange={() => {
                    setUploadMethod("url");
                    setUrlInput("");
                    setMessage(null);
                    setShowMessage(false);
                    resetInsights();
                  }}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Upload via URL</span>
              </label>
            </div>
          </div>

          {/* Right Column: Dynamic Content based on uploadMethod */}
          {uploadMethod === "file" && (
            <div className="md:w-1/2 border-l border-gray-200 pl-8">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500 p-3 rounded-lg mr-4">
                  <UploadCloud size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">File Upload</h3>
                  <p className="text-gray-600 text-sm">CSV, Excel, JSON</p>
                </div>
              </div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                onClick={triggerFileInput}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setSelectedFile(e.dataTransfer.files[0]);
                    setMessage(`File dropped: ${e.dataTransfer.files[0].name}`);
                    setShowMessage(true);
                    resetInsights();
                  }
                }}
              >
                <UploadCloud size={32} className="text-gray-500 mx-auto mb-2" />
                <p className="text-gray-600">Drop files or click to browse</p>
                <input
                  id="file-upload-data-connection"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls,.json"
                />
              </div>
              {selectedFile && (
                <p className="text-gray-700 mt-4 text-center">
                  Selected: {selectedFile.name}
                </p>
              )}
              <div className="flex justify-start mt-4">
                <Button
                  onClick={handleFileUpload}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex items-center neon-glow"
                >
                  <UploadCloud size={20} className="mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          )}

          {uploadMethod === "url" && (
            <div className="md:w-1/2 border-l border-gray-200 pl-8">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <Link size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">URL Connection</h3>
                  <p className="text-gray-600 text-sm">JDBC, APIs, Endpoints</p>
                </div>
              </div>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jdbc://server:port/database or API endpoint"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button
                onClick={handleUrlConnect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center neon-glow"
              >
                <Link size={20} className="mr-2" />
                Connect
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Data Insights Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Data Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-gray-700 text-sm font-bold mb-2">
              Records Processed
            </p>
            <p className="text-lg text-blue-600 font-bold">
              {recordsProcessed}
            </p>
          </div>
          <div>
            <p className="text-gray-700 text-sm font-bold mb-2">
              Quality Score
            </p>
            <p className="text-lg text-green-600 font-bold">{qualityScore}</p>
          </div>
          <div>
            <p className="text-gray-700 text-sm font-bold mb-2">
              Missing value Percentage
            </p>
            <p className="text-lg text-red-600 font-bold">
              {missingValuePercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          AI Insights
        </h3>
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="font-bold">Key Findings:</p>
            {aiKeyFindings.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {aiKeyFindings.map((finding, index) => (
                  <li key={`finding-${index}`}>{finding}</li>
                ))}
              </ul>
            ) : (
              <p>No key findings available.</p>
            )}
          </div>
          <div>
            <p className="font-bold">Recommendations:</p>
            {aiRecommendations.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {aiRecommendations.map((recommendation, index) => (
                  <li key={`recommendation-${index}`}>{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p>No recommendations available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-start gap-4 mt-8">
        <Button
          onClick={handleDownloadMappingSheet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center neon-glow"
        >
          Download Mapping sheet <Download size={18} className="ml-2" />
        </Button>
        <Button
          onClick={handleDownloadCsvMappingFile}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center neon-glow"
        >
          Download CSV Mapping File <Download size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
