"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface ComplianceAnalyserProps {
  onClose: () => void;
}

// Interface for the structure of the summary data (re-added as it's needed for the dropdown's content)
interface SummaryData {
  total_accounts_analyzed: number;
  total_dormant_accounts: number;
  dormancy_rate: string;
  // Updated structure for the new summary data
  numerical_summary: {
    incomplete_contact_attempts: number;
    flag_candidates_3_plus_years_inactive: number;
    article_3_process_required: number;
    account_freeze_candidates: number;
    cbuae_transfer_candidates: number;
    foreign_currency_accounts: number;
    dormant_safe_deposit_boxes: number;
    unclaimed_payment_instruments: number;
    customer_claims_pending: number;
  };
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
export function ComplianceAnalyser({ onClose }: ComplianceAnalyserProps) {
  // Hardcoded summary data based on the provided images
  const [summaryData, setSummaryData] = useState<SummaryData | null>({
    total_accounts_analyzed: 1000, // This was from previous summary, keeping as a placeholder
    total_dormant_accounts: 97, // This was from previous summary, keeping as a placeholder
    dormancy_rate: "9.7%", // This was from previous summary, keeping as a placeholder
    numerical_summary: {
      incomplete_contact_attempts: 749,
      flag_candidates_3_plus_years_inactive: 161,
      article_3_process_required: 167,
      account_freeze_candidates: 347,
      cbuae_transfer_candidates: 326,
      foreign_currency_accounts: 277,
      dormant_safe_deposit_boxes: 31,
      unclaimed_payment_instruments: 278,
      customer_claims_pending: 70,
    },
  });

  // State to manage the active view based on dropdown selection
  const [activeView, setActiveView] = useState<
    | "summarized-compliance-audit"
    | "contact-incomplete-contact-attempts"
    | "flag-flag-candidates"
    | "ledger-internal-ledger-candidates"
    | "freeze-statement-freeze-needed"
    | "cb-transfer-cbuae-transfer-candidates"
    | "fx-conv-foreign-currency-conversion"
    | null
  >("summarized-compliance-audit"); // Default to 'Summarized Compliance Audit' view

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setActiveView(
      selectedValue as
        | "summarized-compliance-audit"
        | "contact-incomplete-contact-attempts"
        | "flag-flag-candidates"
        | "ledger-internal-ledger-candidates"
        | "freeze-statement-freeze-needed"
        | "cb-transfer-cbuae-transfer-candidates"
        | "fx-conv-foreign-currency-conversion"
    );
  };

  /* ---------------------------------------------------------------- */
  /* JSX                                                              */
  /* ---------------------------------------------------------------- */
  return (
    <div className="glass-effect rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Shield className="text-green-400 mr-2" />
          Compliance Analyser Dashboard
        </h2>
        <Button variant="ghost" onClick={onClose} className="gap-1">
          <X size={14} />
          Close
        </Button>
      </div>

      {/* Dropdown menu for action views */}
      <div className="glass-effect rounded-lg p-6 mb-6 border border-white/10 bg-[#2e2f39]">
        <label
          htmlFor="compliance-task-select"
          className="block text-white font-semibold text-lg mb-4"
        >
          Select Compliance Identification Task
        </label>
        <div className="relative">
          <select
            id="compliance-task-select"
            className="block w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-600 focus:border-blue-500 appearance-none"
            value={activeView || ""} // Ensure value is controlled
            onChange={handleDropdownChange}
          >
            <option value="summarized-compliance-audit">
              Summarized Compliance Audit (All Checks)
            </option>
            <option disabled>--- Individual Agent Checks ---</option>
            <option value="contact-incomplete-contact-attempts">
              CONTACT: Incomplete Contact Attempts
            </option>
            <option value="flag-flag-candidates">
              FLAG: Flag Candidates (Not Yet Flagged)
            </option>
            <option value="ledger-internal-ledger-candidates">
              LEDGER: Internal Ledger Candidates (Art. 3.5)
            </option>
            <option value="freeze-statement-freeze-needed">
              FREEZE: Statement Freeze Needed (Art. 7.3)
            </option>
            <option value="cb-transfer-cbuae-transfer-candidates">
              CB_TRANSFER: CBUAE Transfer Candidates (Art. 8)
            </option>
            <option value="fx-conv-foreign-currency-conversion">
              FX_CONV: Foreign Currency Conversion for CB Transfer
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Conditional rendering for different sections based on activeView */}
      {activeView === "summarized-compliance-audit" && summaryData && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            Summarized Compliance Detection Results
          </h3>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-4">
            Run Summarized Compliance Analysis
          </Button>

          <h4 className="text-white font-semibold text-lg mb-3 flex items-center">
            <Shield className="text-green-400 mr-2" size={20} />
            Numerical Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">
                Incomplete Contact Attempts
              </p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.incomplete_contact_attempts}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">
                Flag Candidates (3+ years inactive)
              </p>
              <p className="text-white text-2xl font-bold">
                {
                  summaryData.numerical_summary
                    .flag_candidates_3_plus_years_inactive
                }
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">
                Article 3 Process Required
              </p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.article_3_process_required}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Account Freeze Candidates</p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.account_freeze_candidates}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">CBUAE Transfer Candidates</p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.cbuae_transfer_candidates}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Foreign Currency Accounts</p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.foreign_currency_accounts}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">
                Dormant Safe Deposit Boxes
              </p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.dormant_safe_deposit_boxes}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">
                Unclaimed Payment Instruments
              </p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.unclaimed_payment_instruments}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Customer Claims Pending</p>
              <p className="text-white text-2xl font-bold">
                {summaryData.numerical_summary.customer_claims_pending}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeView === "contact-incomplete-contact-attempts" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            CONTACT: Incomplete Contact Attempts
          </h3>
          <p className="text-gray-400">
            Content for CONTACT: Incomplete Contact Attempts will go here.
          </p>
        </div>
      )}

      {activeView === "flag-flag-candidates" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            FLAG: Flag Candidates (Not Yet Flagged)
          </h3>
          <p className="text-gray-400">
            Content for FLAG: Flag Candidates (Not Yet Flagged) will go here.
          </p>
        </div>
      )}

      {activeView === "ledger-internal-ledger-candidates" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            LEDGER: Internal Ledger Candidates (Art. 3.5)
          </h3>
          <p className="text-gray-400">
            Content for LEDGER: Internal Ledger Candidates (Art. 3.5) will go
            here.
          </p>
        </div>
      )}

      {activeView === "freeze-statement-freeze-needed" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            FREEZE: Statement Freeze Needed (Art. 7.3)
          </h3>
          <p className="text-gray-400">
            Content for FREEZE: Statement Freeze Needed (Art. 7.3) will go here.
          </p>
        </div>
      )}

      {activeView === "cb-transfer-cbuae-transfer-candidates" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            CB_TRANSFER: CBUAE Transfer Candidates (Art. 8)
          </h3>
          <p className="text-gray-400">
            Content for CB_TRANSFER: CBUAE Transfer Candidates (Art. 8) will go
            here.
          </p>
        </div>
      )}

      {activeView === "fx-conv-foreign-currency-conversion" && (
        <div className="glass-effect rounded-lg p-6 mt-6 border border-white/10 bg-[#2e2f39]">
          <h3 className="text-white font-semibold text-xl mb-4">
            FX_CONV: Foreign Currency Conversion for CB Transfer
          </h3>
          <p className="text-gray-400">
            Content for FX_CONV: Foreign Currency Conversion for CB Transfer
            will go here.
          </p>
        </div>
      )}

      {/* Message if no summary data available (only for summary view) */}
      {activeView === "summarized-compliance-audit" && !summaryData && (
        <p className="text-muted-foreground text-center mt-6">
          No summary data available.
        </p>
      )}
    </div>
  );
}
