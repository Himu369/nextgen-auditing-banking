// client/src/components/data-context.tsx
"use client"; // This directive is important for client-side rendering

import React, { createContext, useState, ReactNode, useContext } from "react";

// Define the shape of your context state
interface DataContextType {
  recordsProcessed: number;
  setRecordsProcessed: (value: number) => void;
  missingValuePercentage: number;
  setMissingValuePercentage: (value: number) => void;
  qualityScore: number;
  setQualityScore: (value: number) => void;
  aiKeyFindings: string[];
  setAiKeyFindings: (value: string[]) => void;
  aiRecommendations: string[];
  setAiRecommendations: (value: string[]) => void;
  currentWorkflowId: string | null;
  setCurrentWorkflowId: (value: string | null) => void;
  resetInsights: () => void; // Utility function to reset all insights

  // Data Connector Configurations
  dbConfig: DbConfigState;
  setDbConfig: React.Dispatch<React.SetStateAction<DbConfigState>>;
  llmConfig: LlmConfigState;
  setLlmConfig: React.Dispatch<React.SetStateAction<LlmConfigState>>;
  ragConfig: RagConfigState; // This is the RAG config specific to Data Connector
  setRagConfig: React.Dispatch<React.SetStateAction<RagConfigState>>;
  analysisConfig: AnalysisConfigState;
  setAnalysisConfig: React.Dispatch<React.SetStateAction<AnalysisConfigState>>;

  // Prompt Setup Configurations
  ragKnowledgeBaseConfig: RagKnowledgeBaseConfigState;
  setRagKnowledgeBaseConfig: React.Dispatch<
    React.SetStateAction<RagKnowledgeBaseConfigState>
  >;
  promptGenerationConfig: PromptGenerationConfigState;
  setPromptGenerationConfig: React.Dispatch<
    React.SetStateAction<PromptGenerationConfigState>
  >;

  resetDataConnectorConfig: () => void; // Utility function to reset Data Connector config
}

// Interfaces for Data Connector Configuration States
interface DbConfigState {
  databaseType: string;
  connectionName: string;
  serverName: string;
  databaseName: string;
  portNumber: string;
  userName: string;
  databasePassword: string;
  description: string;
  saveConnection: boolean;
  connectImmediately: boolean;
}

interface LlmConfigState {
  llmProvider: string;
  llmModelName: string;
  prompt: string;
  maxTokens: string;
  temperature: string;
}

interface RagConfigState {
  generationLlmProvider: string;
  generationModel: string;
  generationApiKey: string;
  embeddingProvider: string;
  embeddingModel: string;
  embeddingApiKey: string;
  storageAccount: string;
  containerName: string;
  connectionString: string;
  vectorDBType: string;
  vectorDBConnectionStringEndpoint: string;
  vectorDBAPIKey: string;
  cosmosDBDatabaseName: string;
  cosmosDBContainerName: string;
}

interface AnalysisConfigState {
  selectedUseCase: string;
  selectedDormantChecks: string[];
  selectedComplianceChecks: string[];
}

// Interfaces for Prompt Setup Configurations
interface RagKnowledgeBaseConfigState {
  selectedFileName: string | null; // To display the selected file name
  chunkSize: string;
  overlap: string;
  extractMetadata: boolean;
  documentId: string | null; // To store if an upload was successful and return a doc ID
}

interface PromptGenerationConfigState {
  promptInput: string;
  promptType: string;
  useRag: boolean;
  useDatabase: boolean;
  showCode: boolean;
  promptTemperature: string;
  promptMaxTokens: string;
}

// Create the context with a default undefined value.
// It will be properly provided by the DataProvider component.
export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

// Custom hook to use the DataContext, with a check for proper provider usage
export const useDataInsights = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataInsights must be used within a DataProvider");
  }
  return context;
};

// Define the props for the DataProvider
interface DataProviderProps {
  children: ReactNode;
}

// Create the DataProvider component
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // States for Data Insights, now managed by this provider
  const [recordsProcessed, setRecordsProcessed] = useState<number>(0);
  const [missingValuePercentage, setMissingValuePercentage] =
    useState<number>(0);
  const [qualityScore, setQualityScore] = useState<number>(0);

  // States for AI Insights, now managed by this provider
  const [aiKeyFindings, setAiKeyFindings] = useState<string[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  // Workflow ID, now managed by this provider
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(
    null
  );

  // States for Data Connector Configuration
  const [dbConfig, setDbConfig] = useState<DbConfigState>({
    databaseType: "",
    connectionName: "",
    serverName: "",
    databaseName: "",
    portNumber: "",
    userName: "",
    databasePassword: "",
    description: "Azure SQL Database for compliance data",
    saveConnection: false,
    connectImmediately: true,
  });

  const [llmConfig, setLlmConfig] = useState<LlmConfigState>({
    llmProvider: "",
    llmModelName: "",
    prompt: "what is compliance",
    maxTokens: "1000",
    temperature: "0.2",
  });

  const [ragConfig, setRagConfig] = useState<RagConfigState>({
    generationLlmProvider: "",
    generationModel: "",
    generationApiKey: "sk-...",
    embeddingProvider: "Hugging Face",
    embeddingModel: "BAAI/bge-large-en-v1.5",
    embeddingApiKey: "API Key (if needed)",
    storageAccount: "mystorageaccount",
    containerName: "compliance-docs",
    connectionString: "DefaultEndpointsProtocol=https;AccountName=...",
    vectorDBType: "Azure Cosmos DB",
    vectorDBConnectionStringEndpoint:
      "https://your-cosmos.documents.azure.com:443/",
    vectorDBAPIKey: "Primary key",
    cosmosDBDatabaseName: "ComplianceVectorDB",
    cosmosDBContainerName: "compliance_vectors",
  });

  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfigState>({
    selectedUseCase: "",
    selectedDormantChecks: [],
    selectedComplianceChecks: [],
  });

  // States for Prompt Setup Configurations
  const [ragKnowledgeBaseConfig, setRagKnowledgeBaseConfig] =
    useState<RagKnowledgeBaseConfigState>({
      selectedFileName: null,
      chunkSize: "1000",
      overlap: "200",
      extractMetadata: true,
      documentId: null,
    });

  const [promptGenerationConfig, setPromptGenerationConfig] =
    useState<PromptGenerationConfigState>({
      promptInput: "",
      promptType: "general_assistant",
      useRag: false,
      useDatabase: false,
      showCode: false,
      promptTemperature: "0.7",
      promptMaxTokens: "1000",
    });

  // Function to reset all insights
  const resetInsights = () => {
    setRecordsProcessed(0);
    setMissingValuePercentage(0);
    setQualityScore(0);
    setAiKeyFindings([]);
    setAiRecommendations([]);
    setCurrentWorkflowId(null);
  };

  // Function to reset all Data Connector related configurations, including Prompt Setup
  const resetDataConnectorConfig = () => {
    setDbConfig({
      databaseType: "",
      connectionName: "",
      serverName: "",
      databaseName: "",
      portNumber: "",
      userName: "",
      databasePassword: "",
      description: "Azure SQL Database for compliance data",
      saveConnection: false,
      connectImmediately: true,
    });
    setLlmConfig({
      llmProvider: "",
      llmModelName: "",
      prompt: "what is compliance",
      maxTokens: "1000",
      temperature: "0.2",
    });
    setRagConfig({
      generationLlmProvider: "",
      generationModel: "",
      generationApiKey: "sk-...",
      embeddingProvider: "Hugging Face",
      embeddingModel: "BAAI/bge-large-en-v1.5",
      embeddingApiKey: "API Key (if needed)",
      storageAccount: "mystorageaccount",
      containerName: "compliance-docs",
      connectionString: "DefaultEndpointsProtocol=https;AccountName=...",
      vectorDBType: "Azure Cosmos DB",
      vectorDBConnectionStringEndpoint:
        "https://your-cosmos.documents.azure.com:443/",
      vectorDBAPIKey: "Primary key",
      cosmosDBDatabaseName: "ComplianceVectorDB",
      cosmosDBContainerName: "compliance_vectors",
    });
    setAnalysisConfig({
      selectedUseCase: "",
      selectedDormantChecks: [],
      selectedComplianceChecks: [],
    });
    // Reset Prompt Setup configurations
    setRagKnowledgeBaseConfig({
      selectedFileName: null,
      chunkSize: "1000",
      overlap: "200",
      extractMetadata: true,
      documentId: null,
    });
    setPromptGenerationConfig({
      promptInput: "",
      promptType: "general_assistant",
      useRag: false,
      useDatabase: false,
      showCode: false,
      promptTemperature: "0.7",
      promptMaxTokens: "1000",
    });
  };

  const contextValue: DataContextType = {
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
    // Data Connector Configs
    dbConfig,
    setDbConfig,
    llmConfig,
    setLlmConfig,
    ragConfig,
    setRagConfig,
    analysisConfig,
    setAnalysisConfig,
    // Prompt Setup Configs
    ragKnowledgeBaseConfig,
    setRagKnowledgeBaseConfig,
    promptGenerationConfig,
    setPromptGenerationConfig,
    resetDataConnectorConfig,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
