// client/src/components/configuration/prompt-setup.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react"; // Import UploadCloud icon
import axios from "axios"; // Assuming axios is used for file upload
import { useDataInsights } from "@/components/data-context"; // Import the custom hook

interface PromptSetupProps {
  setMessage: (message: string | null) => void;
  setShowMessage: (show: boolean) => void;
}

export function PromptSetup({ setMessage, setShowMessage }: PromptSetupProps) {
  const {
    ragKnowledgeBaseConfig,
    setRagKnowledgeBaseConfig,
    promptGenerationConfig,
    setPromptGenerationConfig,
  } = useDataInsights();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(null); // Keep actual File object local for upload [14]

  // Updated Dropdown options for Prompt Generation Type
  const promptTypeOptions = [
    "--",
    "domain_knowledge",
    "data_visualization",
    "code_explanation",
    "natural_language",
    "sql_generation",
    "rag_query",
    "general_assistant",
    "custom",
  ];

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setLocalSelectedFile(file); // Store actual file locally
      setRagKnowledgeBaseConfig((prev) => ({
        ...prev,
        selectedFileName: file.name, // Store file name in context for display persistence
      }));
      setMessage(`File selected: ${file.name}`);
      setShowMessage(true);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle RAG Knowledge Base Upload button click
  const handleUpload = async () => {
    if (!localSelectedFile) {
      setMessage("Please select a file to upload.");
      setShowMessage(true);
      return;
    }

    const parsedChunkSize = parseInt(ragKnowledgeBaseConfig.chunkSize);
    const parsedOverlap = parseInt(ragKnowledgeBaseConfig.overlap);

    if (isNaN(parsedChunkSize) || parsedChunkSize <= 0) {
      setMessage("Chunk Size must be a positive number.");
      setShowMessage(true);
      return;
    }
    if (isNaN(parsedOverlap) || parsedOverlap < 0) {
      setMessage("Chunk Overlap must be a non-negative number.");
      setShowMessage(true);
      return;
    }
    if (parsedOverlap >= parsedChunkSize) {
      setMessage("Chunk Overlap must be less than Chunk Size.");
      setShowMessage(true);
      return;
    }

    setMessage("Uploading file and processing knowledge base...");
    setShowMessage(true);

    const formData = new FormData();
    formData.append("file", localSelectedFile);
    formData.append("chunk_size", ragKnowledgeBaseConfig.chunkSize);
    formData.append("chunk_overlap", ragKnowledgeBaseConfig.overlap);
    formData.append(
      "extract_metadata",
      String(ragKnowledgeBaseConfig.extractMetadata)
    );

    try {
      const response = await axios.post(
        "https://fastapi-app-641805125303.us-central1.run.app/knowledge/upload",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setMessage(
          `Upload successful! Document ID: ${response.data.document_id}, Filename: ${response.data.filename}, Message: ${response.data.message}`
        );
        // Optionally store document_id in context if relevant for persistence
        setRagKnowledgeBaseConfig((prev) => ({
          ...prev,
          documentId: response.data.document_id,
        }));
      } else {
        setMessage(
          `Upload failed: ${
            response.data.message || response.data.error || "Unknown error."
          }`
        );
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
    } finally {
      setShowMessage(true);
    }
  };

  // Handle Prompt Generation Upload button click
  const handlePromptGenerationUpload = async () => {
    // Basic validation for prompt generation fields
    if (!promptGenerationConfig.promptInput) {
      setMessage("Prompt is a required field.");
      setShowMessage(true);
      return;
    }
    if (promptGenerationConfig.promptType === "--") {
      setMessage("Please select a valid Type for Prompt Generation.");
      setShowMessage(true);
      return;
    }

    const parsedPromptMaxTokens = parseInt(
      promptGenerationConfig.promptMaxTokens
    );
    const parsedPromptTemperature = parseFloat(
      promptGenerationConfig.promptTemperature
    );

    if (isNaN(parsedPromptMaxTokens) || parsedPromptMaxTokens <= 0) {
      setMessage("Max Tokens must be a positive number for Prompt Generation.");
      setShowMessage(true);
      return;
    }
    if (
      isNaN(parsedPromptTemperature) ||
      parsedPromptTemperature < 0 ||
      parsedPromptTemperature > 1
    ) {
      setMessage(
        "Temperature must be a number between 0 and 1 for Prompt Generation."
      );
      setShowMessage(true);
      return;
    }

    setMessage("Sending prompt generation request...");
    setShowMessage(true);

    // Constructing URL-encoded payload as per curl command
    const params = new URLSearchParams();
    params.append("prompt", promptGenerationConfig.promptInput);
    params.append("type", promptGenerationConfig.promptType);
    params.append("use_rag", String(promptGenerationConfig.useRag)); // Convert boolean to string
    params.append("use_database", String(promptGenerationConfig.useDatabase)); // Convert boolean to string
    params.append("show_code", String(promptGenerationConfig.showCode)); // Convert boolean to string
    params.append("temperature", String(parsedPromptTemperature));
    params.append("max_tokens", String(parsedPromptMaxTokens));

    try {
      const response = await axios.post(
        "https://fastapi-app-641805125303.us-central1.run.app/prompts/quick-execute", // Updated API endpoint
        params.toString(), // Send as URL-encoded string
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Set content type
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setMessage(
          `Prompt generation successful! Response: ${response.data.response.substring(
            0,
            100
          )}...`
        ); // Display part of the response
      } else {
        setMessage(
          `Prompt generation failed: ${
            response.data.message || response.data.error || "Unknown error."
          }`
        );
      }
    } catch (error: any) {
      console.error("Error generating prompt:", error);
      let errorMessage = `Error generating prompt: ${
        error.message || "Please check console for details."
      }`;
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Prompt generation failed: ${
          error.response.data.message ||
          error.response.statusText ||
          JSON.stringify(error.response.data)
        }`;
      }
      setMessage(errorMessage);
    } finally {
      setShowMessage(true);
    }
  };

  return (
    <div className="flex-grow p-8 bg-white rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        RAG Knowledge Base
      </h3>
      {/* Grid layout for RAG parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* File Upload Section */}
        <div className="bg-green-50 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-yellow-500 p-2 rounded-lg mr-3">
                <UploadCloud size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  File Upload
                </h4>
                <p className="text-gray-600 text-sm">Pdf,Docx, Txt</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
                className="hidden"
              />
              <Button
                onClick={triggerFileInput}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 px-4 rounded-lg cursor-pointer"
              >
                Choose File
              </Button>
              <span className="text-gray-600 text-sm">
                {ragKnowledgeBaseConfig.selectedFileName
                  ? ragKnowledgeBaseConfig.selectedFileName
                  : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* Chunk Size */}
        <div className="bg-green-50 rounded-lg p-4">
          <label
            htmlFor="chunkSize"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Chunk Size
          </label>
          <input
            type="number"
            id="chunkSize"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ragKnowledgeBaseConfig.chunkSize}
            onChange={(e) =>
              setRagKnowledgeBaseConfig((prev) => ({
                ...prev,
                chunkSize: e.target.value,
              }))
            }
            placeholder="1000"
            min="1"
          />
        </div>

        {/* Chunk Overlap */}
        <div className="bg-green-50 rounded-lg p-4">
          <label
            htmlFor="overlap"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Chunk Overlap
          </label>
          <input
            type="number"
            id="overlap"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ragKnowledgeBaseConfig.overlap}
            onChange={(e) =>
              setRagKnowledgeBaseConfig((prev) => ({
                ...prev,
                overlap: e.target.value,
              }))
            }
            placeholder="200"
            min="0"
          />
        </div>

        {/* Extract Metadata */}
        <div className="bg-green-50 rounded-lg p-4">
          <label
            htmlFor="extractMetadata"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Extract Metadata
          </label>
          <select
            id="extractMetadata"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={String(ragKnowledgeBaseConfig.extractMetadata)} // Convert boolean to string for select value
            onChange={(e) =>
              setRagKnowledgeBaseConfig((prev) => ({
                ...prev,
                extractMetadata: e.target.value === "true",
              }))
            }
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>
      </div>

      <div className="flex justify-start mt-4">
        <Button
          onClick={handleUpload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex items-center"
        >
          <UploadCloud size={20} className="mr-2" />
          Upload
        </Button>
      </div>

      {/* Prompt Generation Section - NEW */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Prompt Generation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Prompt */}
          <div>
            <label
              htmlFor="promptInput"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              prompt <span className="text-red-500">* required</span>
            </label>
            <input
              type="text"
              id="promptInput"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-green-50"
              value={promptGenerationConfig.promptInput}
              onChange={(e) =>
                setPromptGenerationConfig((prev) => ({
                  ...prev,
                  promptInput: e.target.value,
                }))
              }
              placeholder="string"
            />
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="promptType"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Type
            </label>
            <select
              id="promptType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-green-50"
              value={promptGenerationConfig.promptType}
              onChange={(e) =>
                setPromptGenerationConfig((prev) => ({
                  ...prev,
                  promptType: e.target.value,
                }))
              }
            >
              {promptTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Use Rag */}
          <div>
            <label
              htmlFor="useRag"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Use Rag
            </label>
            <select
              id="useRag"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-green-50"
              value={String(promptGenerationConfig.useRag)}
              onChange={(e) =>
                setPromptGenerationConfig((prev) => ({
                  ...prev,
                  useRag: e.target.value === "true",
                }))
              }
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>

          {/* Use Database */}
          <div>
            <label
              htmlFor="useDatabase"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Use Database
            </label>
            <select
              id="useDatabase"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-green-50"
              value={String(promptGenerationConfig.useDatabase)}
              onChange={(e) =>
                setPromptGenerationConfig((prev) => ({
                  ...prev,
                  useDatabase: e.target.value === "true",
                }))
              }
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>

          {/* Show Code */}
          <div>
            <label
              htmlFor="showCode"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Show Code
            </label>
            <select
              id="showCode"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-green-50"
              value={String(promptGenerationConfig.showCode)}
              onChange={(e) =>
                setPromptGenerationConfig((prev) => ({
                  ...prev,
                  showCode: e.target.value === "true",
                }))
              }
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label
              htmlFor="promptTemperature"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Temperature
            </label>
            <input
              type="number"
              step="0.1"
              id="promptTemperature"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-green-50"
              value={promptGenerationConfig.promptTemperature}
              onChange={(e) =>
                setPromptGenerationConfig((prev) => ({
                  ...prev,
                  promptTemperature: e.target.value,
                }))
              }
            />
          </div>

          {/* Max Tokens */}
          <div>
            <label
              htmlFor="promptMaxTokens"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Max Tokens
            </label>
            <input
              type="number"
              id="promptMaxTokens"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-green-50"
              value={promptGenerationConfig.promptMaxTokens}
              onChange={(e) =>
                setPromptGenerationConfig((prev) => ({
                  ...prev,
                  promptMaxTokens: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="flex justify-start mt-4">
          <Button
            onClick={handlePromptGenerationUpload}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex items-center"
          >
            <UploadCloud size={20} className="mr-2" />
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
