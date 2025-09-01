// client/src/components/configuration/configuration.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Settings } from "lucide-react";
import { DataConnector } from "./data-connector";
import { PromptSetup } from "./prompt-setup";
import { SchemaEnrichment } from "./schema-enrichment";
import { TrainingConsole } from "./training-console"; // Import the TrainingConsole component

// Define a type for the sidebar options
type SidebarOption =
  | "Data Connector"
  | "Schema Enrichment"
  | "Prompt Setup"
  | "Training Console"
  | "Generation Configs";

interface ConfigurationProps {
  onClose: () => void; // Function to close the configuration view
}

export function Configuration({ onClose }: ConfigurationProps) {
  const [selectedSidebarOption, setSelectedSidebarOption] =
    useState<SidebarOption>("Data Connector"); // Default to Data Connector

  const [message, setMessage] = useState<string | null>(null); // State for custom message
  const [showMessage, setShowMessage] = useState<boolean>(false); // State to control message box visibility

  // Function to close the custom message box
  const closeMessage = () => {
    setShowMessage(false);
    setMessage(null);
  };

  // Renders the content based on the selected sidebar option
  const renderContent = () => {
    switch (selectedSidebarOption) {
      case "Data Connector":
        return (
          <DataConnector
            setMessage={setMessage}
            setShowMessage={setShowMessage}
          />
        );
      case "Schema Enrichment":
        return (
          <SchemaEnrichment
            setMessage={setMessage}
            setShowMessage={setShowMessage}
          />
        );
      case "Prompt Setup":
        return (
          <PromptSetup
            setMessage={setMessage}
            setShowMessage={setShowMessage}
          />
        );
      case "Training Console":
        return (
          // TrainingConsole will now simply expand, pushing the scrollbar to this parent div.
          <TrainingConsole
            setMessage={setMessage}
            setShowMessage={setShowMessage}
          />
        );
      case "Generation Configs":
        return (
          // This section's content should also just expand, contributing to the parent scroll.
          // Removed overflow-y-auto from here as the parent div will handle the main scroll.
          <div className="flex-grow p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Generation Configs
            </h3>
            <p className="text-gray-600 mt-4">
              Review & Create API description content goes here.
            </p>
            {/* Add more content here to test scrolling */}
            <div className="h-48 bg-gray-100 mt-4 flex items-center justify-center text-gray-500">
              Additional Generation Config settings.
            </div>
            <div className="h-48 bg-gray-100 mt-4 flex items-center justify-center text-gray-500">
              More configuration data.
            </div>
            <div className="h-48 bg-gray-100 mt-4 flex items-center justify-center text-gray-500">
              API description details.
            </div>
            <div className="h-48 bg-gray-100 mt-4 flex items-center justify-center text-gray-500">
              Final item to ensure scrolling.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Main modal container: Constrained height, uses flex-col for header and content area */}
      {/* max-h-[calc(100vh-4rem)] ensures the modal doesn't exceed screen height, leaving some margin */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg relative flex flex-col max-h-[calc(100vh-4rem)]">
        {/* Header for the whole configuration: Prevents shrinking */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold flex items-center text-gray-800">
            <Settings className="text-blue-500 mr-3" size={24} />
            Data Connection Configuration
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="gap-1 text-gray-600 hover:text-gray-900"
          >
            <X size={18} />
            Close
          </Button>
        </div>

        {/* Main content area: Sidebar and Dynamic Content. Removed overflow-y-auto from here. */}
        <div className="flex flex-grow">
          {/* Sidebar Navigation: Prevents shrinking */}
          <div className="w-64 bg-gray-800 text-white p-6 flex flex-col flex-shrink-0">
            <ul className="space-y-4">
              {(
                [
                  "Data Connector",
                  "Schema Enrichment",
                  "Prompt Setup",
                  "Training Console",
                  "Generation Configs",
                ] as SidebarOption[]
              ).map((option) => (
                <li key={option}>
                  <button
                    className={`block w-full text-left py-3 px-4 rounded-lg transition-colors duration-200
                                ${
                                  selectedSidebarOption === option
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`}
                    onClick={() => setSelectedSidebarOption(option)}
                  >
                    {option}
                    <p className="text-sm text-gray-400 mt-1">
                      {option === "Data Connector" &&
                        "Data Connector description"}
                      {option === "Schema Enrichment" &&
                        "Table Schema description"}
                      {option === "Prompt Setup" &&
                        "Prompt Components description"}
                      {option === "Training Console" &&
                        "Dynamic Examples description"}
                      {option === "Generation Configs" &&
                        "Review & Create API description"}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Content Area: Allows its child (TrainingConsole, etc.) to fill height */}
          <div className="flex-grow bg-gray-50 p-8 flex flex-col">
            {renderContent()}
          </div>
        </div>

        {/* Custom Message Box - Remains in Configuration.tsx as it's a global modal for this component */}
        {showMessage && message && (
          <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h4 className="text-lg font-semibold mb-4">Connection Attempt</h4>
              <p className="text-gray-700 mb-6">{message}</p>
              <div className="flex justify-end">
                <Button
                  onClick={closeMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
