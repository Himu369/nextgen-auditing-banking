import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function FloatingCard({ children, className, animate = true }: FloatingCardProps) {
  return (
    <div
      className={cn(
        "glass-effect rounded-2xl p-8 neon-glow",
        animate && "floating-card",
        className
      )}
    >
      {children}
    </div>
  );
}
