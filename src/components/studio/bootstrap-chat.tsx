"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/studio-store";
import { STUDIO_TEMPLATES } from "@/lib/studio-templates";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import * as React from "react";

export const BootstrapChat: React.FC<{ className?: string }> = ({ className }) => {
  const [input, setInput] = React.useState("");
  const {
    bootstrapMessages,
    addBootstrapMessage,
    processUserInput,
    setView,
    setIsGenerating,
    isGenerating,
  } = useStudioStore();
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bootstrapMessages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    const userInput = input.trim();
    setInput("");
    addBootstrapMessage("user", userInput);
    setIsGenerating(true);
    
    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 1500));
    
    const template = processUserInput(userInput);
    
    const response = `I'll create a **${template.name}** app for you.

This includes:
- **${template.components.filter(c => c.enabled).length} components** for the UI
- **${template.mcpServers.filter(s => s.enabled).length} MCP servers** for AI capabilities
- A customized system prompt

Click "Continue to Builder" to customize your app.`;
    
    addBootstrapMessage("assistant", response);
    setIsGenerating(false);
  };
  
  const handleQuickStart = (templateId: string) => {
    const template = STUDIO_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      addBootstrapMessage("user", `Create a ${template.name.toLowerCase()} app`);
      processUserInput(template.name);
      addBootstrapMessage(
        "assistant",
        `I've configured a **${template.name}** app for you. Click "Continue to Builder" to customize it.`
      );
    }
  };
  
  const hasMessages = bootstrapMessages.length > 0;
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Create Your AI App</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Describe what you want to build
        </p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {!hasMessages && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">What would you like to build?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Describe your app in natural language, or choose a template below
              </p>
            </div>
            
            {/* Quick start templates */}
            <div className="grid grid-cols-1 gap-3">
              {STUDIO_TEMPLATES.slice(0, 3).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleQuickStart(template.id)}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left group"
                >
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium group-hover:text-primary transition-colors">
                      {template.name}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {template.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                Or type your own description below
              </span>
            </div>
          </div>
        )}
        
        {bootstrapMessages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="text-sm whitespace-pre-wrap">
                {msg.content.split("**").map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j}>{part}</strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
                <span className="text-sm text-muted-foreground">Generating...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Continue button */}
      {hasMessages && !isGenerating && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setView("builder")}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Continue to Builder
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Build me an AI that helps manage support tickets..."
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
