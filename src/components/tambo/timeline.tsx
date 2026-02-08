"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { Circle, CheckCircle, AlertCircle, Clock } from "lucide-react";

export const timelineSchema = z.object({
  title: z.string().optional().describe("Optional title for the timeline"),
  events: z.array(z.object({
    id: z.string().describe("Unique identifier for the event"),
    title: z.string().describe("Event title"),
    description: z.string().optional().describe("Event description"),
    timestamp: z.string().describe("When the event occurred"),
    status: z.enum(["completed", "current", "pending", "error"]).optional().describe("Event status"),
    actor: z.string().optional().describe("Who performed the action"),
  })).describe("List of timeline events"),
});

export type TimelineProps = z.infer<typeof timelineSchema>;

const statusIcons = {
  completed: CheckCircle,
  current: Clock,
  pending: Circle,
  error: AlertCircle,
};

const statusColors = {
  completed: "text-green-500 bg-green-100 dark:bg-green-900/30",
  current: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  pending: "text-gray-400 bg-gray-100 dark:bg-gray-800",
  error: "text-red-500 bg-red-100 dark:bg-red-900/30",
};

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ title, events }, ref) => {
    return (
      <div ref={ref} className="rounded-lg border border-border bg-card p-4">
        {title && (
          <h3 className="font-medium text-sm mb-4">{title}</h3>
        )}
        <div className="space-y-4">
          {events.map((event, index) => {
            const status = event.status || "pending";
            const Icon = statusIcons[status];
            const isLast = index === events.length - 1;
            
            return (
              <div key={event.id} className="relative flex gap-3">
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
                )}
                
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  statusColors[status]
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                      )}
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap">
                      {event.timestamp}
                    </time>
                  </div>
                  {event.actor && (
                    <p className="text-xs text-muted-foreground mt-1">by {event.actor}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Timeline.displayName = "Timeline";
