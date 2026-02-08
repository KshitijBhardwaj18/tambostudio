"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/studio-store";
import { BootstrapChat } from "./bootstrap-chat";
import { ConfigSidebar } from "./config-sidebar";
import { CodePreview } from "./code-preview";
import { LivePreview } from "./live-preview";
import { ArrowLeft, Sparkles } from "lucide-react";
import * as React from "react";

export const StudioLayout: React.FC<{ className?: string }> = ({ className }) => {
  const { view, setView, reset, selectedTemplate } = useStudioStore();
  
  return (
    <div className={cn("h-screen flex flex-col bg-background", className)}>
      {/* Top Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Tambo Studio</span>
          </div>
          {view === "builder" && (
            <button
              onClick={() => setView("bootstrap")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ml-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Chat
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedTemplate && (
            <span className="text-sm text-muted-foreground">
              Template: <span className="font-medium text-foreground">{selectedTemplate.name}</span>
            </span>
          )}
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Start Over
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {view === "bootstrap" ? (
          <div className="flex-1 max-w-2xl mx-auto">
            <BootstrapChat />
          </div>
        ) : (
          <>
            {/* Config Sidebar */}
            <div className="w-80 border-r border-border overflow-hidden">
              <ConfigSidebar />
            </div>
            
            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Live Preview */}
              <div className="flex-1 overflow-hidden">
                <LivePreview />
              </div>
              
              {/* Code Preview */}
              <div className="h-48 border-t border-border overflow-hidden">
                <CodePreview />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
