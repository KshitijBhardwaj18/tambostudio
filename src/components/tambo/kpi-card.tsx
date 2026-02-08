"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import * as React from "react";

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  className,
}) => {
  return (
    <div className={cn(
      "p-4 rounded-lg border border-border bg-card",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-xs mt-1",
              trend === "up" && "text-green-600",
              trend === "down" && "text-red-600",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {trend === "up" && <TrendingUp className="h-3 w-3" />}
              {trend === "down" && <TrendingDown className="h-3 w-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

KPICard.displayName = "KPICard";
