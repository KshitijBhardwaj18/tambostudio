"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  status?: "completed" | "current" | "pending";
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className }) => {
  return (
    <div className={cn("relative", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="relative pb-8 last:pb-0">
          {/* Connector line */}
          {index < events.length - 1 && (
            <div
              className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-border"
              aria-hidden="true"
            />
          )}
          
          <div className="relative flex items-start space-x-3">
            {/* Icon/dot */}
            <div
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full",
                event.status === "completed" && "bg-green-100 text-green-600",
                event.status === "current" && "bg-primary text-primary-foreground",
                event.status === "pending" && "bg-muted text-muted-foreground",
                !event.status && "bg-muted text-muted-foreground"
              )}
            >
              {event.icon || (
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    event.status === "completed" && "bg-green-600",
                    event.status === "current" && "bg-primary-foreground",
                    event.status === "pending" && "bg-muted-foreground",
                    !event.status && "bg-muted-foreground"
                  )}
                />
              )}
            </div>
            
            {/* Content */}
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{event.title}</p>
                <time className="text-xs text-muted-foreground">
                  {event.timestamp}
                </time>
              </div>
              {event.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Timeline.displayName = "Timeline";
