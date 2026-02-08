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
import * as React from "react";

interface LaunchedAppChatProps {
  appConfig: LaunchedAppConfig;
  className?: string;
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
        { id: "s2", title: "System health", detailedSuggestion: "What's the current system health?", messageId: "health" },
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
  const suggestions = getSuggestionsForTemplate(appConfig.templateId);
  const template = STUDIO_TEMPLATES.find((t) => t.id === appConfig.templateId);

  return (
    <div className={cn("flex h-full w-full", className)}>
      <ThreadContainer disableSidebarSpacing className="flex-1">
        <ScrollableMessageContainer className="p-4">
          {/* Welcome message */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{template?.icon || "🤖"}</span>
                <h2 className="font-semibold">{appConfig.name}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {template?.description || "Your AI-powered assistant is ready to help."}
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Enabled tools:</strong>{" "}
                  {appConfig.enabledMcpServers.length > 0
                    ? appConfig.enabledMcpServers.join(", ")
                    : "Default tools"}
                </p>
              </div>
            </div>
          </div>

          <ThreadContent>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        {/* Message input */}
        <div className="px-4 pb-4">
          <div className="max-w-2xl mx-auto">
            <MessageInput>
              <MessageInputTextarea placeholder={`Ask ${appConfig.name} anything...`} />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
              <MessageInputError />
            </MessageInput>
          </div>
        </div>

        {/* Message suggestions */}
        <MessageSuggestions initialSuggestions={suggestions}>
          <div className="max-w-2xl mx-auto px-4 pb-4">
            <MessageSuggestionsList />
          </div>
        </MessageSuggestions>
      </ThreadContainer>
    </div>
  );
};
