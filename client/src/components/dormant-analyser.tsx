"use client"; // Assuming this component is used in a Next.js App Router context

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Bed, ChevronDown, ChevronUp } from "lucide-react"; // Added ChevronDown and ChevronUp for expandable sections

// Interface for detailed dormancy category data
interface DormancyCategoryDetail {
  count: number;
  additional_details?: {
    earliest_maturity_date?: string;
    count_auto_renewal_cases?: number;
  };
}

// Interface for the comprehensive summary data, incorporating all new sections
interface ComprehensiveSummaryData {
  report_date: string;
  total_accounts: number;
  total_flagged_dormant: number;
  performance_indicators: {
    dormancy_rate: string;
    total_dormant_balance: string;
    high_value_dormant: number;
    cb_transfer_eligible: number;
  };
  detailed_analysis_by_category: {
    fixed_deposits: DormancyCategoryDetail;
    safe_deposit_boxes: DormancyCategoryDetail;
    investment_accounts: DormancyCategoryDetail;
    demand_deposits: DormancyCategoryDetail;
    unclaimed_payment_instruments: DormancyCategoryDetail; // Added based on pie chart
  };
  process_action_items: {
    article_3_process_needed: number;
    needs_initial_contact: number;
    in_3_month_wait: number;
    proactive_contact_needed: number;
    dormant_to_active_transitions: number;
  };
  visual_analytics_data?: {
    dormancy_by_category_chart_data: any; // Placeholder for chart data structure
    process_status_overview_chart_data: any; // Placeholder for chart data structure
  };
  executive_summary: {
    summary_text: string;
    risk_highlights: string;
    trends_observations: string;
    compliance_implications: string;
  };
  export_options: {
    pdf_report_available: boolean;
    csv_available: boolean;
    report_content_text: string;
  };
}

interface DormantAnalyserProps {
  onClose: () => void;
}

export function DormantAnalyser({ onClose }: DormantAnalyserProps) {
  // Hardcoded comprehensive summary data for demonstration purposes
  const initialSummaryData: ComprehensiveSummaryData = {
    report_date: "2025-07-14",
    total_accounts: 1000,
    total_flagged_dormant: 506,
    performance_indicators: {
      dormancy_rate: "50.60%",
      total_dormant_balance: "AED 254,459,239",
      high_value_dormant: 491,
      cb_transfer_eligible: 76,
    },
    detailed_analysis_by_category: {
      fixed_deposits: {
        count: 33,
        additional_details: {
          earliest_maturity_date: "2017-06-24",
          count_auto_renewal_cases: 17,
        },
      },
      safe_deposit_boxes: { count: 0 },
      investment_accounts: { count: 16 },
      demand_deposits: { count: 39 },
      unclaimed_payment_instruments: { count: 277 }, // Based on pie chart 61.2% of 506 dormant accounts is approx 309, but using 277 from pic1
    },
    process_action_items: {
      article_3_process_needed: 379,
      needs_initial_contact: 376,
      in_3_month_wait: 3,
      proactive_contact_needed: 6,
      dormant_to_active_transitions: 0,
    },
    visual_analytics_data: {
      dormancy_by_category_chart_data: {}, // Placeholder
      process_status_overview_chart_data: {}, // Placeholder
    },
    executive_summary: {
      summary_text: "This is a placeholder for the executive summary.",
      risk_highlights: "Key risks include...",
      trends_observations: "Observed trends are...",
      compliance_implications: "Compliance implications include...",
    },
    export_options: {
      pdf_report_available: true,
      csv_available: true,
      report_content_text: "This is the full report content in text format.",
    },
  };

  // State to hold the comprehensive summary data, initially null to hide data
  const [comprehensiveSummaryData, setComprehensiveSummaryData] =
    useState<ComprehensiveSummaryData | null>(null);

  // State to manage the active view from the dropdown
  const [activeView, setActiveView] = useState<
    | "summary"
    | "safe-deposit-dormancy"
    | "fixed-deposit-inactivity"
    | "demand-deposit-inactivity"
    | "unclaimed-payment-instruments"
    | null
  >("summary");

  // States for expandable sections
  const [showFixedDeposits, setShowFixedDeposits] = useState(false);
  const [showSafeDepositBoxes, setShowSafeDepositBoxes] = useState(false);
  const [showInvestmentAccounts, setShowInvestmentAccounts] = useState(false);
  const [showDemandDeposits, setShowDemandDeposits] = useState(false);
  const [showReportContent, setShowReportContent] = useState(false);
  // Removed showReportDownload state as the section is being removed
  // const [showReportDownload, setShowReportDownload] = useState(false);

  // Handle dropdown change
  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setActiveView(
      selectedValue as
        | "summary"
        | "safe-deposit-dormancy"
        | "fixed-deposit-inactivity"
        | "demand-deposit-inactivity"
        | "unclaimed-payment-instruments"
    );
  };

  // Function to simulate running analysis (can be expanded to fetch real data)
  const handleRunAnalysis = () => {
    // When the button is clicked, set the data to be displayed
    setComprehensiveSummaryData(initialSummaryData);
    console.log("Running complete dormancy analysis...");
  };

  return (
    <div className="glass-effect rounded-xl p-6 mb-6 font-inter text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Bed className="text-yellow-500 text-xl mr-3" />
          Internal Audit Agent
        </h2>
        <Button
          onClick={onClose}
          variant="ghost"
          className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
        >
          <X className="w-4 h-4 mr-2" /> Close
        </Button>
      </div>

      {/* Dropdown menu for action views */}
      <div className="glass-effect rounded-lg p-6 mb-6 border border-white/10 bg-[#2e2f39]">
        <label
          htmlFor="dormancy-task-select"
          className="block text-white font-semibold text-lg mb-4"
        >
          Select Dormancy Identification Task
        </label>
        <div className="relative">
          <select
            id="dormancy-task-select"
            className="block w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500 appearance-none"
            value={activeView || ""} // Ensure value is controlled
            onChange={handleDropdownChange}
          >
            <option value="summary">
              Summarized Dormancy Analysis (All Checks)
            </option>
            <option disabled>--- Individual Agent Checks ---</option>
            <option value="safe-deposit-dormancy">Safe Deposit Dormancy</option>
            <option value="fixed-deposit-inactivity">
              Fixed Deposit Inactivity
            </option>
            <option value="demand-deposit-inactivity">
              Demand Deposit Inactivity
            </option>
            <option value="unclaimed-payment-instruments">
              Unclaimed Payment Instruments
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Summarized Dormancy Analysis (All Checks) - New Summary Section */}
      {activeView === "summary" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            Summarized Dormancy Analysis (All Checks)
          </h3>

          {/* Run Complete Dormancy Analysis Button */}
          <Button
            onClick={handleRunAnalysis}
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-6 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Run Complete Dormancy Analysis
          </Button>

          {/* Conditional rendering of data based on comprehensiveSummaryData */}
          {comprehensiveSummaryData ? (
            <>
              {/* Report Date, Total Accounts, Total Flagged Dormant */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Report Date</p>
                  <p className="text-white text-xl font-bold">
                    {comprehensiveSummaryData.report_date}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Accounts</p>
                  <p className="text-white text-xl font-bold">
                    {comprehensiveSummaryData.total_accounts}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Flagged Dormant</p>
                  <p className="text-white text-xl font-bold">
                    {comprehensiveSummaryData.total_flagged_dormant}
                  </p>
                </div>
              </div>

              {/* Performance Indicators */}
              <h4 className="text-white font-semibold text-lg mb-3">
                Performance Indicators
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Dormancy Rate</p>
                  <p className="text-white text-xl font-bold">
                    {
                      comprehensiveSummaryData.performance_indicators
                        .dormancy_rate
                    }
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Dormant Balance</p>
                  <p className="text-white text-xl font-bold">
                    {
                      comprehensiveSummaryData.performance_indicators
                        .total_dormant_balance
                    }
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">High-value Dormant</p>
                  <p className="text-white text-xl font-bold">
                    {
                      comprehensiveSummaryData.performance_indicators
                        .high_value_dormant
                    }
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">CB Transfer Eligible</p>
                  <p className="text-white text-xl font-bold">
                    {
                      comprehensiveSummaryData.performance_indicators
                        .cb_transfer_eligible
                    }
                  </p>
                </div>
              </div>

              {/* Detailed Analysis by Dormancy Category */}
              <h4 className="text-white font-semibold text-lg mb-3">
                Detailed Analysis by Dormancy Category
              </h4>

              {/* Fixed Deposits */}
              <div className="bg-gray-800 p-4 rounded-lg mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowFixedDeposits(!showFixedDeposits)}
                >
                  <p className="text-white text-lg">
                    Fixed Deposits (Art 2.2) -{" "}
                    {
                      comprehensiveSummaryData.detailed_analysis_by_category
                        .fixed_deposits.count
                    }{" "}
                    items
                  </p>
                  {showFixedDeposits ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {showFixedDeposits &&
                  comprehensiveSummaryData.detailed_analysis_by_category
                    .fixed_deposits.additional_details && (
                    <div className="mt-3 text-gray-400 text-sm">
                      <p>
                        Fixed Deposit accounts dormant (Art 2.2: &gt;3yr
                        post-maturity issues):{" "}
                        {
                          comprehensiveSummaryData.detailed_analysis_by_category
                            .fixed_deposits.count
                        }{" "}
                        accounts
                      </p>
                      <p>Additional Details:</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>Earliest Maturity Date</div>
                        <div className="text-white">
                          {
                            comprehensiveSummaryData
                              .detailed_analysis_by_category.fixed_deposits
                              .additional_details.earliest_maturity_date
                          }
                        </div>
                        <div>Count Auto Renewal Cases</div>
                        <div className="text-white">
                          {
                            comprehensiveSummaryData
                              .detailed_analysis_by_category.fixed_deposits
                              .additional_details.count_auto_renewal_cases
                          }
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Safe Deposit Boxes */}
              <div className="bg-gray-800 p-4 rounded-lg mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowSafeDepositBoxes(!showSafeDepositBoxes)}
                >
                  <p className="text-white text-lg">
                    Safe Deposit Boxes (Art 2.6) -{" "}
                    {
                      comprehensiveSummaryData.detailed_analysis_by_category
                        .safe_deposit_boxes.count
                    }{" "}
                    items
                  </p>
                  {showSafeDepositBoxes ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {showSafeDepositBoxes && (
                  <div className="mt-3 text-gray-400 text-sm">
                    <p>
                      No additional details available for Safe Deposit Boxes.
                    </p>
                  </div>
                )}
              </div>

              {/* Investment Accounts */}
              <div className="bg-gray-800 p-4 rounded-lg mb-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setShowInvestmentAccounts(!showInvestmentAccounts)
                  }
                >
                  <p className="text-white text-lg">
                    Investment Accounts (Art 2.3) -{" "}
                    {
                      comprehensiveSummaryData.detailed_analysis_by_category
                        .investment_accounts.count
                    }{" "}
                    items
                  </p>
                  {showInvestmentAccounts ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {showInvestmentAccounts && (
                  <div className="mt-3 text-gray-400 text-sm">
                    <p>
                      No additional details available for Investment Accounts.
                    </p>
                  </div>
                )}
              </div>

              {/* Demand Deposits */}
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setShowDemandDeposits(!showDemandDeposits)}
                >
                  <p className="text-white text-lg">
                    Demand Deposits (Art 2.1.1) -{" "}
                    {
                      comprehensiveSummaryData.detailed_analysis_by_category
                        .demand_deposits.count
                    }{" "}
                    items
                  </p>
                  {showDemandDeposits ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {showDemandDeposits && (
                  <div className="mt-3 text-gray-400 text-sm">
                    <p>No additional details available for Demand Deposits.</p>
                  </div>
                )}
              </div>

              {/* Process & Action Items */}
              <h4 className="text-white font-semibold text-lg mb-3">
                Process & Action Items
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    Article 3 process Needed
                  </p>
                  <p className="text-white text-xl font-bold">
                    {
                      comprehensiveSummaryData.process_action_items
                        .article_3_process_needed
                    }
                  </p>
                  <ul className="text-gray-400 text-sm mt-2 list-disc pl-5">
                    <li>
                      Needs initial contact:{" "}
                      {
                        comprehensiveSummaryData.process_action_items
                          .needs_initial_contact
                      }
                    </li>
                    <li>
                      In 3-month wait:{" "}
                      {
                        comprehensiveSummaryData.process_action_items
                          .in_3_month_wait
                      }
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    Proactive Contact needed
                  </p>
                  <p className="text-white text-xl font-bold">
                    {
                      comprehensiveSummaryData.process_action_items
                        .proactive_contact_needed
                    }
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    Dormant-to-Active Transitions
                  </p>
                  <p className="text-white text-xl font-bold">
                    {
                      comprehensiveSummaryData.process_action_items
                        .dormant_to_active_transitions
                    }
                  </p>
                </div>
              </div>

              {/* Visual Analytics */}
              <h4 className="text-white font-semibold text-lg mb-3">
                Visual Analytics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-sm mb-2">
                    Dormancy by Category
                  </p>
                  {/* Placeholder for Dormancy by Category Pie Chart */}
                  <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                    [Pie Chart Placeholder]
                  </div>
                  <ul className="text-gray-400 text-xs mt-3">
                    <li>Unclaimed Instruments: 61.2%</li>
                    <li>Demand Deposit: 17.2%</li>
                    <li>Fixed Deposit: 14.5%</li>
                    <li>Investment: 7.09%</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-sm mb-2">
                    Process Status Overview
                  </p>
                  {/* Placeholder for Process Status Overview Pie Chart */}
                  <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                    [Pie Chart Placeholder]
                  </div>
                  <ul className="text-gray-400 text-xs mt-3">
                    <li>High Value (&lt;25k): 51.6%</li>
                    <li>Article 3 Process: 39.8%</li>
                    <li>CB Transfer Eligible: 7.18%</li>
                    <li>Proactive Contact: 1.42%</li>
                  </ul>
                </div>
              </div>

              {/* AI-Generated Executive Summary & Strategic Insights */}
              <h4 className="text-white font-semibold text-lg mb-3">
                AI-Generated Executive Summary & Strategic Insights
              </h4>
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <p className="text-gray-400 text-sm font-semibold mb-2">
                  Executive Summary:
                </p>
                <p className="text-white mb-4">
                  {comprehensiveSummaryData.executive_summary.summary_text}
                </p>
                <p className="text-gray-400 text-sm font-semibold mb-2">
                  Risk Highlights:
                </p>
                <p className="text-white mb-4">
                  {comprehensiveSummaryData.executive_summary.risk_highlights}
                </p>
                <p className="text-400 text-sm font-semibold mb-2">
                  Trends and Observations:
                </p>
                <p className="text-white mb-4">
                  {
                    comprehensiveSummaryData.executive_summary
                      .trends_observations
                  }
                </p>
                <p className="text-gray-400 text-sm font-semibold mb-2">
                  Compliance Implications:
                </p>
                <p className="text-white">
                  {
                    comprehensiveSummaryData.executive_summary
                      .compliance_implications
                  }
                </p>
              </div>

              {/* Export Comprehensive Report */}
              <h4 className="text-white font-semibold text-lg mb-3">
                Export Comprehensive Report
              </h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex flex-wrap gap-4 mb-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    Download PDF Report (Text Format)
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    Download CSV
                  </Button>
                </div>

                {/* View Report Content */}
                <div className="bg-gray-700 p-3 rounded-lg mb-3">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setShowReportContent(!showReportContent)}
                  >
                    <p className="text-white">View Report Content</p>
                    {showReportContent ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  {showReportContent && (
                    <div className="mt-3 text-gray-300 text-sm bg-gray-900 p-3 rounded-lg max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {
                          comprehensiveSummaryData.export_options
                            .report_content_text
                        }
                      </pre>
                    </div>
                  )}
                </div>

                {/* Removed "Report available as text file download" section */}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center mt-6">
              Click "Run Complete Dormancy Analysis" to view the summary data.
            </p>
          )}
        </div>
      )}

      {/* Placeholder for other views (individual agent checks) */}
      {activeView === "safe-deposit-dormancy" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            Safe Deposit Dormancy Details
          </h3>
          <p className="text-gray-400">
            Content for Safe Deposit Dormancy will go here. This section is for
            detailed analysis specific to Safe Deposit Boxes.
          </p>
        </div>
      )}

      {activeView === "fixed-deposit-inactivity" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            Fixed Deposit Inactivity Details
          </h3>
          <p className="text-gray-400">
            Content for Fixed Deposit Inactivity will go here. This section is
            for detailed analysis specific to Fixed Deposits.
          </p>
        </div>
      )}

      {activeView === "demand-deposit-inactivity" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            Demand Deposit Inactivity Details
          </h3>
          <p className="text-gray-400">
            Content for Demand Deposit Inactivity will go here. This section is
            for detailed analysis specific to Demand Deposits.
          </p>
        </div>
      )}

      {activeView === "unclaimed-payment-instruments" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            Unclaimed Payment Instruments Details
          </h3>
          <p className="text-gray-400">
            Content for Unclaimed Payment Instruments will go here. This section
            is for detailed analysis specific to Unclaimed Payment Instruments.
          </p>
        </div>
      )}
    </div>
  );
}
