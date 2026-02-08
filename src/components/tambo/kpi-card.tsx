"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const kpiCardSchema = z.object({
  title: z.string().describe("The title/label for this KPI"),
  value: z.string().describe("The main value to display (e.g., '$2.4M', '156', '99.9%')"),
  change: z.string().optional().describe("The change indicator (e.g., '+12.5%', '-3 tickets', '5 pts')"),
  trend: z.enum(["up", "down", "neutral"]).optional().describe("Direction of the trend: up (good), down (bad), or neutral"),
  subtitle: z.string().optional().describe("Optional subtitle or additional context"),
});

export type KPICardProps = z.infer<typeof kpiCardSchema>;

export const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  ({ title, value, change, trend = "neutral", subtitle }, ref) => {
    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
    
    return (
      <div
        ref={ref}
        className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
            {(change || subtitle) && (
              <div className="flex items-center gap-1 mt-1">
                {change && (
                  <span
                    className={cn(
                      "text-xs font-medium flex items-center gap-0.5",
                      trend === "up" && "text-green-600",
                      trend === "down" && "text-red-600",
                      trend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {change}
                  </span>
                )}
                {subtitle && (
                  <span className="text-xs text-muted-foreground">
                    {change ? ` · ${subtitle}` : subtitle}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

KPICard.displayName = "KPICard";
