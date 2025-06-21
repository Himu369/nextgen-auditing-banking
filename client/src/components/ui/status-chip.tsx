import { cn } from "@/lib/utils";

type StatusType = "pending" | "complete" | "flagged" | "urgent" | "critical";

interface StatusChipProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  complete: "bg-green-500/20 text-green-400 border-green-500/30",
  flagged: "bg-red-500/20 text-red-400 border-red-500/30",
  urgent: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-600/20 text-red-300 border-red-600/30",
};

export function StatusChip({ status, children, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
