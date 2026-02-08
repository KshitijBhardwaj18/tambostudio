"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/studio-store";
import { Code2, Copy, Check } from "lucide-react";
import * as React from "react";

export const CodePreview: React.FC<{ className?: string }> = ({ className }) => {
  const { selectedTemplate, components, mcpServers, systemPrompt, appName } = useStudioStore();
  const [copied, setCopied] = React.useState(false);
  
  if (!selectedTemplate) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Generated config will appear here</p>
      </div>
    );
  }
  
  const config = {
    name: appName,
    template: selectedTemplate.id,
    components: components
      .filter((c) => c.enabled)
      .map((c) => c.name),
    mcpServers: mcpServers
      .filter((s) => s.enabled)
      .map((s) => ({
        name: s.name,
        tools: s.tools,
      })),
    systemPrompt: systemPrompt,
  };
  
  const configJson = JSON.stringify(config, null, 2);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Generated Config</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-accent transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
          {configJson}
        </pre>
      </div>
    </div>
  );
};
