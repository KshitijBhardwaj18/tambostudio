"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";

export const statusBadgeSchema = z.object({
  status: z.string().describe("The status text to display"),
  variant: z.enum(["success", "warning", "error", "info", "default"]).optional().describe("Visual style variant"),
});

export type StatusBadgeProps = z.infer<typeof statusBadgeSchema>;

const variantStyles = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, variant = "default" }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          variantStyles[variant]
        )}
      >
        {status}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";
