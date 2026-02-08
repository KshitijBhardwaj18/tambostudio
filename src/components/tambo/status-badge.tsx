"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export type StatusBadgeVariant = "success" | "warning" | "error" | "info" | "default";

export interface StatusBadgeProps {
  status: string;
  variant?: StatusBadgeVariant;
  className?: string;
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {status}
    </span>
  );
};

StatusBadge.displayName = "StatusBadge";

// Helper function to auto-detect variant from status text
export function getVariantFromStatus(status: string): StatusBadgeVariant {
  const lowerStatus = status.toLowerCase();
  
  if (["success", "healthy", "resolved", "active", "ok", "completed", "closed won"].some(s => lowerStatus.includes(s))) {
    return "success";
  }
  if (["warning", "medium", "pending", "in progress", "monitoring", "neutral"].some(s => lowerStatus.includes(s))) {
    return "warning";
  }
  if (["error", "critical", "high", "failed", "at risk", "p1", "investigating"].some(s => lowerStatus.includes(s))) {
    return "error";
  }
  if (["info", "low", "new", "open"].some(s => lowerStatus.includes(s))) {
    return "info";
  }
  
  return "default";
}
