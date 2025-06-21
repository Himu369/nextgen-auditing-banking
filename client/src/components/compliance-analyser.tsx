import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { X, Shield } from "lucide-react";

interface ComplianceAnalyserProps {
  onClose: () => void;
}

interface ModuleData {
  title: string;
  count: string;
  status: "pending" | "complete" | "flagged" | "urgent" | "critical";
  statusText: string;
}

const moduleData: ModuleData[] = [
  { title: "Incomplete Contact Attempts", count: "156", status: "pending", statusText: "Action Needed" },
  { title: "Flag Candidates (Not Yet Flagged)", count: "67", status: "flagged", statusText: "Critical" },
  { title: "Internal Ledger Candidates (Art. 3.5)", count: "234", status: "complete", statusText: "Reviewed" },
  { title: "Statement Freeze Needed (Art. 7.3)", count: "89", status: "pending", statusText: "Processing" },
  { title: "CBUAE Transfer Candidates (Art. 8)", count: "123", status: "flagged", statusText: "Urgent" },
  { title: "Foreign Currency Conversion", count: "45", status: "complete", statusText: "Complete" },
  { title: "SDB Court Application Needed", count: "12", status: "pending", statusText: "In Review" },
  { title: "Unclaimed Instruments - Internal", count: "78", status: "flagged", statusText: "Action Required" },
  { title: "Claims Processing Pending", count: "134", status: "complete", statusText: "On Track" },
  { title: "Annual CBUAE Report Summary", count: "1", status: "pending", statusText: "Due Soon" },
  { title: "Record Retention Compliance", count: "98%", status: "complete", statusText: "Compliant" },
];

export function ComplianceAnalyser({ onClose }: ComplianceAnalyserProps) {
  const handleModuleClick = (title: string) => {
    console.log("Opening detailed view for:", title);
  };

  return (
    <div className="glass-effect rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Shield className="text-green-400 text-xl mr-3" />
          Compliance Analyser Dashboard
        </h2>
        <Button
          onClick={onClose}
          variant="ghost"
          className="glass-effect rounded-lg px-4 py-2 text-sm hover:bg-white/5"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>
      
      {/* Compliance Analysis Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleData.map((module, index) => (
          <div
            key={index}
            className="glass-effect rounded-lg p-4 module-card cursor-pointer"
            onClick={() => handleModuleClick(module.title)}
          >
            <h3 className="font-semibold mb-2 text-sm">{module.title}</h3>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${
                module.status === "complete" ? "text-green-400" :
                module.status === "flagged" ? "text-cyan-400" :
                "text-yellow-400"
              }`}>
                {module.count}
              </span>
              <StatusChip status={module.status}>
                {module.statusText}
              </StatusChip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
