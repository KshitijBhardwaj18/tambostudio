"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/studio-store";
import { useDataSourceStore } from "@/lib/data-source-store";
import { MCP_SERVERS, STUDIO_COMPONENTS } from "@/lib/studio-templates";
import {
  ChevronDown,
  ChevronRight,
  Database,
  Layers,
  MessageSquare,
  Plug,
  Settings,
  X,
} from "lucide-react";
import * as React from "react";

export const ConfigSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const {
    selectedTemplate,
    systemPrompt,
    setSystemPrompt,
    components,
    toggleComponent,
    mcpServers,
    toggleMcpServer,
    appName,
    setAppName,
  } = useStudioStore();
  
  const { dataSources, removeDataSource } = useDataSourceStore();
  
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["data", "prompt", "components", "mcp"])
  );
  
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };
  
  if (!selectedTemplate) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a template to configure</p>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{selectedTemplate.icon}</span>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="flex-1 font-semibold bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedTemplate.description}
        </p>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        {/* Data Sources Section */}
        {dataSources.length > 0 && (
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection("data")}
              className="w-full flex items-center gap-2 p-3 hover:bg-accent/50 transition-colors"
            >
              {expandedSections.has("data") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Database className="h-4 w-4 text-[#7FFFC3]" />
              <span className="font-medium text-sm">Data Sources</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {dataSources.length}
              </span>
            </button>
            {expandedSections.has("data") && (
              <div className="px-3 pb-3 space-y-1">
                {dataSources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-2 rounded-md bg-[#7FFFC3]/10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#7FFFC3]">{source.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {source.data.length} records • {source.fields.length} fields
                      </div>
                    </div>
                    <button
                      onClick={() => removeDataSource(source.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2">
                  Tools will be generated automatically for each data source.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* System Prompt Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("prompt")}
            className="w-full flex items-center gap-2 p-3 hover:bg-accent/50 transition-colors"
          >
            {expandedSections.has("prompt") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">System Prompt</span>
          </button>
          {expandedSections.has("prompt") && (
            <div className="px-3 pb-3">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={8}
                className="w-full p-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono"
              />
            </div>
          )}
        </div>
        
        {/* Components Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("components")}
            className="w-full flex items-center gap-2 p-3 hover:bg-accent/50 transition-colors"
          >
            {expandedSections.has("components") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Components</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {components.filter((c) => c.enabled).length}/{components.length}
            </span>
          </button>
          {expandedSections.has("components") && (
            <div className="px-3 pb-3 space-y-1">
              {STUDIO_COMPONENTS.map((comp) => {
                const isEnabled = components.find((c) => c.id === comp.id)?.enabled ?? false;
                const isInTemplate = components.some((c) => c.id === comp.id);
                return (
                  <label
                    key={comp.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                      isEnabled ? "bg-primary/10" : "hover:bg-accent/50",
                      !isInTemplate && "opacity-50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => {
                        if (isInTemplate) {
                          toggleComponent(comp.id);
                        }
                      }}
                      disabled={!isInTemplate}
                      className="rounded border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{comp.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {comp.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
        
        {/* MCP Servers Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("mcp")}
            className="w-full flex items-center gap-2 p-3 hover:bg-accent/50 transition-colors"
          >
            {expandedSections.has("mcp") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <Plug className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">MCP Servers</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {mcpServers.filter((s) => s.enabled).length}/{mcpServers.length}
            </span>
          </button>
          {expandedSections.has("mcp") && (
            <div className="px-3 pb-3 space-y-1">
              {MCP_SERVERS.map((server) => {
                const isEnabled = mcpServers.find((s) => s.id === server.id)?.enabled ?? false;
                const isInTemplate = mcpServers.some((s) => s.id === server.id);
                return (
                  <label
                    key={server.id}
                    className={cn(
                      "flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors",
                      isEnabled ? "bg-primary/10" : "hover:bg-accent/50",
                      !isInTemplate && "opacity-50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => {
                        if (isInTemplate) {
                          toggleMcpServer(server.id);
                        }
                      }}
                      disabled={!isInTemplate}
                      className="rounded border-border mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{server.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {server.description}
                      </div>
                      {isEnabled && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {server.tools.slice(0, 3).map((tool) => (
                            <span
                              key={tool}
                              className="text-[10px] px-1.5 py-0.5 bg-background rounded border border-border"
                            >
                              {tool}
                            </span>
                          ))}
                          {server.tools.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{server.tools.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
