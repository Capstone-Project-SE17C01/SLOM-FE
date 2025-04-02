import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "white"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export function Spinner({
  className,
  size = "sm",
  color = "default",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    default: "text-current",
    white: "text-white",
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
      role="status"
    />
  );
}
