"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Settings } from "lucide-react"; // Assuming 'Settings' icon is used for configuration
import axios from "axios"; // Real axios import

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
  const [databaseType, setDatabaseType] = useState<string>(""); // Initialize with empty string to allow API data to populate
  const [connectionName, setConnectionName] = useState<string>(""); // New state for Connection Name
  const [serverName, setServerName] = useState<string>(""); // New state for Server Name
  const [databaseName, setDatabaseName] = useState<string>(""); // New state for Database Name
  const [portNumber, setPortNumber] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  // Removed databasePassword state as per request
  const [message, setMessage] = useState<string | null>(null); // State for custom message
  const [showMessage, setShowMessage] = useState<boolean>(false); // State to control message box visibility
  const [databaseOptions, setDatabaseOptions] = useState<string[]>([]); // State to store fetched database IDs
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to manage error messages

  // Fetch database types from the API on component mount
  useEffect(() => {
    const fetchDatabaseTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using the real axios.get to fetch data
        const response = await axios.get(
          "https://db-api-service-641805125303.us-central1.run.app/db/databases"
        );
        const data = response.data; // Axios response data is typically in the 'data' property

        // Ensure data.databases is an array and contains objects with an 'id' property
        if (
          data &&
          Array.isArray(data.databases) &&
          data.databases.every(
            (db: any) => typeof db === "object" && db !== null && "id" in db
          )
        ) {
          const ids = data.databases.map((db: any) => db.id);
          setDatabaseOptions(ids);
          if (ids.length > 0) {
            setDatabaseType(ids[0]); // Set the first fetched ID as default
          }
        } else {
          setError(
            "Unexpected API response format or missing 'id' property in database objects."
          );
        }
      } catch (err: any) {
        console.error("Failed to fetch database types:", err);
        setError(`Failed to load database types: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseTypes();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle database connection attempt (now "Next Button" functionality)
  const handleNext = async () => {
    // Basic client-side validation
    if (
      !databaseType ||
      !connectionName ||
      !serverName ||
      !databaseName ||
      !portNumber ||
      !userName
    ) {
      setMessage("Please fill in all required database connection fields.");
      setShowMessage(true);
      return; // Stop execution if validation fails
    }

    // Validate port number is a valid integer
    const parsedPort = parseInt(portNumber);
    if (isNaN(parsedPort)) {
      setMessage("Port Number must be a valid number.");
      setShowMessage(true);
      return;
    }

    try {
      setMessage("Attempting to save database connection details...");
      setShowMessage(true); // Show the custom message box

      const payload = {
        connection_name: connectionName,
        database_type: databaseType,
        server_name: serverName,
        database_name: databaseName,
        port: parsedPort, // Use the parsed port number
        username: userName,
        // database_password is intentionally removed from payload as per request
        description: `Connection to ${databaseName} on ${serverName}`, // Optional: Add a description
      };

      const response = await axios.post(
        "https://db-api-service-641805125303.us-central1.run.app/db/connections/save",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setMessage(
          `Connection details saved successfully: ${response.data.message}`
        );
      } else {
        setMessage(
          `Failed to save connection details: ${
            response.data.message || "Unknown error"
          }`
        );
      }
    } catch (err: any) {
      console.error("Error saving database connection details:", err);
      // More specific error message for 500 status
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 500
      ) {
        setMessage(
          `Error saving database connection details: A server error occurred (Status 500). Please check your input and try again, or contact support if the issue persists.`
        );
      } else {
        setMessage(
          `Error saving database connection details: ${
            err.message || "Please check console for details."
          }`
        );
      }
    } finally {
      setShowMessage(true); // Ensure message is shown even on error
    }
  };

  // Function to handle Refresh button click
  const handleRefresh = () => {
    // Logic to refresh data or state can go here.
    // For now, let's just clear the form fields and re-fetch database types.
    setConnectionName("");
    setServerName("");
    setDatabaseName("");
    setPortNumber("");
    setUserName("");
    // Re-fetch database types
    const fetchDatabaseTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://db-api-service-641805125303.us-central1.run.app/db/databases"
        );
        const data = response.data;
        if (
          data &&
          Array.isArray(data.databases) &&
          data.databases.every(
            (db: any) => typeof db === "object" && db !== null && "id" in db
          )
        ) {
          const ids = data.databases.map((db: any) => db.id);
          setDatabaseOptions(ids);
          if (ids.length > 0) {
            setDatabaseType(ids[0]);
          }
        } else {
          setError(
            "Unexpected API response format or missing 'id' property in database objects."
          );
        }
        setMessage("Database types refreshed and form cleared.");
      } catch (err: any) {
        console.error("Failed to refresh database types:", err);
        setError(`Failed to refresh database types: ${err.message}`);
        setMessage(`Failed to refresh: ${err.message}`);
      } finally {
        setLoading(false);
        setShowMessage(true);
      }
    };
    fetchDatabaseTypes();
  };

  // Function to handle Reconnect button click
  const handleReconnect = async () => {
    // This function can trigger the same logic as handleNext if "reconnect" means
    // attempting to save the connection details again.
    // Or, it could trigger a different API call for testing the connection.
    // For now, let's assume it attempts to save/re-verify the connection details.
    setMessage("Attempting to reconnect/re-verify database connection...");
    setShowMessage(true);

    // Re-using the handleNext logic for simplicity, assuming reconnect means re-saving/verifying.
    // If a separate API endpoint for "test connection" exists, it should be used here.
    await handleNext(); // Call handleNext to re-attempt saving/verifying
  };

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
          // Added overflow-y-auto and max-h to make this section scrollable
          <div className="flex-grow p-8 bg-white rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-8">
              <div className="flex justify-center mb-4">
                {/* Placeholder for icon/illustration */}
              </div>
              <p className="text-gray-600 mb-4">
                Drag & Drop folder or zip here or{" "}
                <label
                  htmlFor="file-upload"
                  className="text-blue-600 cursor-pointer"
                >
                  Choose file
                  <input id="file-upload" type="file" className="hidden" />
                </label>
              </p>
            </div>

            <p className="text-center text-gray-500 mb-8">- or -</p>

            {/* Connect with Database Section */}
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Connect with Database
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label
                  htmlFor="databaseType"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Database Type
                </label>
                {loading ? (
                  <p className="text-gray-500">Loading database types...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <select
                    id="databaseType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={databaseType}
                    onChange={(e) => setDatabaseType(e.target.value)}
                  >
                    {/* Ensure that each option is a string, which it should be from databaseOptions */}
                    {databaseOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label
                  htmlFor="connectionName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Connection Name
                </label>
                <input
                  type="text"
                  id="connectionName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  placeholder="e.g., MyDatabaseConnection"
                />
              </div>
              <div>
                <label
                  htmlFor="serverName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Server Name
                </label>
                <input
                  type="text"
                  id="serverName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="e.g., localhost or 192.168.1.1"
                />
              </div>
              <div>
                <label
                  htmlFor="databaseName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Database Name
                </label>
                <input
                  type="text"
                  id="databaseName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={databaseName}
                  onChange={(e) => setDatabaseName(e.target.value)}
                  placeholder="e.g., my_database"
                />
              </div>
              <div>
                <label
                  htmlFor="portNumber"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Port Number
                </label>
                <input
                  type="text"
                  id="portNumber"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={portNumber}
                  onChange={(e) => setPortNumber(e.target.value)}
                  placeholder="e.g., 5432"
                />
              </div>
              <div>
                <label
                  htmlFor="userName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  User name
                </label>
                <input
                  type="text"
                  id="userName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g., sql_user"
                />
              </div>
              {/* Database Password section removed as per request */}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              {" "}
              {/* Added gap and mt for spacing */}
              <Button
                onClick={handleRefresh}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                Refresh
              </Button>
              <Button
                onClick={handleReconnect}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                Reconnect
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Next Button
              </Button>
            </div>
          </div>
        );
      case "Schema Enrichment":
        return (
          <div className="flex-grow p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Schema Enrichment
            </h3>
            <p className="text-gray-600 mt-4">
              Table Schema description content goes here.
            </p>
          </div>
        );
      case "Prompt Setup":
        return (
          <div className="flex-grow p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Prompt Setup
            </h3>
            <p className="text-gray-600 mt-4">
              Prompt Components description content goes here.
            </p>
          </div>
        );
      case "Training Console":
        return (
          <div className="flex-grow p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Training Console
            </h3>
            <p className="text-gray-600 mt-4">
              Dynamic Examples description content goes here.
            </p>
          </div>
        );
      case "Generation Configs":
        return (
          <div className="flex-grow p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              Generation Configs
            </h3>
            <p className="text-gray-600 mt-4">
              Review & Create API description content goes here.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header for the whole configuration */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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

        {/* Main content area: Sidebar and Dynamic Content */}
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-800 text-white p-6 flex flex-col">
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

          {/* Dynamic Content Area */}
          <div className="flex-grow bg-gray-50 p-8">{renderContent()}</div>
        </div>
      </div>

      {/* Custom Message Box */}
      {showMessage && message && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
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
  );
}
