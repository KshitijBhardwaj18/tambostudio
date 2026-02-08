"use client";

import { cn } from "@/lib/utils";
import { LaunchedAppConfig } from "@/lib/studio-store";
import { STUDIO_TEMPLATES } from "@/lib/studio-templates";
import {
  MessageInput,
  MessageInputError,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ThreadContainer } from "@/components/tambo/thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import type { Suggestion } from "@tambo-ai/react";
import { Database } from "lucide-react";
import * as React from "react";

interface LaunchedAppChatProps {
  appConfig: LaunchedAppConfig;
  className?: string;
}

// Generate suggestions based on data sources
function getSuggestionsForDataSources(appConfig: LaunchedAppConfig): Suggestion[] {
  const dataSources = appConfig.dataSources || [];
  
  if (dataSources.length > 0) {
    const firstSource = dataSources[0];
    const numericFields = firstSource.fields.filter(f => f.type === "number");
    const stringFields = firstSource.fields.filter(f => f.type === "string");
    
    const suggestions: Suggestion[] = [
      { 
        id: "s1", 
        title: "Show all data", 
        detailedSuggestion: `Show me all the ${firstSource.name} data`, 
        messageId: "all" 
      },
    ];
    
    if (numericFields.length > 0) {
      suggestions.push({
        id: "s2",
        title: "Show statistics",
        detailedSuggestion: `What are the statistics for ${numericFields[0].name}?`,
        messageId: "stats"
      });
    }
    
    if (stringFields.length > 0) {
      suggestions.push({
        id: "s3",
        title: `Group by ${stringFields[0].name}`,
        detailedSuggestion: `Group the data by ${stringFields[0].name} and show totals`,
        messageId: "group"
      });
    }
    
    if (numericFields.length > 0) {
      suggestions.push({
        id: "s4",
        title: "Show chart",
        detailedSuggestion: `Create a chart showing ${numericFields[0].name}`,
        messageId: "chart"
      });
    }
    
    return suggestions.slice(0, 4);
  }
  
  // Fallback to template-based suggestions
  return getSuggestionsForTemplate(appConfig.templateId);
}

// Get template-specific suggestions
function getSuggestionsForTemplate(templateId: string): Suggestion[] {
  switch (templateId) {
    case "sales-analytics":
      return [
        { id: "s1", title: "Show revenue", detailedSuggestion: "Show me the monthly revenue data", messageId: "revenue" },
        { id: "s2", title: "Top products", detailedSuggestion: "What are our top selling products?", messageId: "products" },
        { id: "s3", title: "KPIs", detailedSuggestion: "Show me the key business KPIs", messageId: "kpis" },
      ];
    case "support-ops":
      return [
        { id: "s1", title: "Open tickets", detailedSuggestion: "Show me all open support tickets", messageId: "tickets" },
        { id: "s2", title: "High priority", detailedSuggestion: "What are the high priority tickets?", messageId: "priority" },
        { id: "s3", title: "Ticket stats", detailedSuggestion: "Show me ticket statistics", messageId: "stats" },
      ];
    case "engineering-ops":
      return [
        { id: "s1", title: "Active incidents", detailedSuggestion: "Show me active incidents", messageId: "incidents" },
        { id: "s2", title: "System health", detailedSuggestion: "What is the current system health?", messageId: "health" },
        { id: "s3", title: "Deployments", detailedSuggestion: "Show recent deployments", messageId: "deployments" },
      ];
    case "inventory-manager":
      return [
        { id: "s1", title: "Low stock", detailedSuggestion: "Show items with low stock", messageId: "lowstock" },
        { id: "s2", title: "Inventory stats", detailedSuggestion: "Show inventory statistics", messageId: "stats" },
        { id: "s3", title: "All inventory", detailedSuggestion: "Show all inventory items", messageId: "all" },
      ];
    case "customer-success":
      return [
        { id: "s1", title: "At-risk customers", detailedSuggestion: "Show customers at risk of churning", messageId: "atrisk" },
        { id: "s2", title: "Customer stats", detailedSuggestion: "Show customer success metrics", messageId: "stats" },
        { id: "s3", title: "All customers", detailedSuggestion: "Show all customers", messageId: "all" },
      ];
    default:
      return [
        { id: "s1", title: "Get started", detailedSuggestion: "What can you help me with?", messageId: "start" },
        { id: "s2", title: "Show data", detailedSuggestion: "Show me the available data", messageId: "data" },
        { id: "s3", title: "Help", detailedSuggestion: "What are your capabilities?", messageId: "help" },
      ];
  }
}

export const LaunchedAppChat: React.FC<LaunchedAppChatProps> = ({
  appConfig,
  className,
}) => {
  const suggestions = getSuggestionsForDataSources(appConfig);
  const template = STUDIO_TEMPLATES.find((t) => t.id === appConfig.templateId);
  const hasDataSources = appConfig.dataSources && appConfig.dataSources.length > 0;

  return (
    <div className={cn("flex h-full w-full justify-center", className)}>
      <div className="w-full max-w-4xl flex flex-col h-full">
        <ThreadContainer disableSidebarSpacing className="flex-1">
          <ScrollableMessageContainer className="p-4">
            {/* Welcome message */}
            <div className="mb-6">
              <div className="bg-muted/50 rounded-xl p-5 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{template?.icon || "🤖"}</span>
                  <div>
                    <h2 className="font-semibold text-lg">{appConfig.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {hasDataSources 
                        ? `Connected to ${appConfig.dataSources.length} data source${appConfig.dataSources.length > 1 ? "s" : ""}`
                        : template?.description || "Your AI-powered assistant is ready to help."
                      }
                    </p>
                  </div>
                </div>
                
                {/* Data sources */}
                {hasDataSources && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-[#7FFFC3]" />
                      <span className="text-xs font-medium text-muted-foreground">Your Data</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {appConfig.dataSources.map((source) => (
                        <div key={source.id} className="px-3 py-1.5 bg-[#7FFFC3]/10 rounded-lg">
                          <span className="text-xs font-medium text-[#7FFFC3]">{source.name}</span>
                          <span className="text-xs text-[#7FFFC3]/70 ml-1">
                            ({source.data.length} records)
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ask me anything about your data - I can query, filter, analyze, and visualize it.
                    </p>
                  </div>
                )}
                
                {/* Components and servers for non-data-source apps */}
                {!hasDataSources && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                    {appConfig.enabledComponents.slice(0, 4).map((comp) => (
                      <span key={comp} className="px-2 py-1 bg-[#7FFFC3]/10 text-[#7FFFC3] rounded-md text-xs font-medium">
                        {comp}
                      </span>
                    ))}
                    {appConfig.enabledMcpServers.slice(0, 2).map((server) => (
                      <span key={server} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-xs font-medium">
                        {server}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <ThreadContent>
              <ThreadContentMessages />
            </ThreadContent>
          </ScrollableMessageContainer>

          {/* Message suggestions */}
          <MessageSuggestions initialSuggestions={suggestions}>
            <div className="px-4 pb-2">
              <MessageSuggestionsList />
            </div>
          </MessageSuggestions>

          {/* Message input */}
          <div className="px-4 pb-4">
            <MessageInput>
              <MessageInputTextarea placeholder={`Ask ${appConfig.name} anything...`} />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
              <MessageInputError />
            </MessageInput>
          </div>
        </ThreadContainer>
      </div>
    </div>
  );
};
