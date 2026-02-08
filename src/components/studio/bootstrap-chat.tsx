"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/studio-store";
import { STUDIO_TEMPLATES, StudioComponent, McpServer } from "@/lib/studio-templates";
import { ArrowRight, Zap, Sparkles, Code, Cpu, MessageSquare, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";

// Generation steps for the animated progress
interface GenerationStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "pending" | "active" | "complete";
}

// AI-generated app configuration
interface GeneratedConfig {
  name: string;
  description: string;
  systemPrompt: string;
  components: StudioComponent[];
  mcpServers: McpServer[];
  suggestedFeatures: string[];
}

// Simulate AI generation of app config based on user input
async function generateAppConfig(userInput: string): Promise<GeneratedConfig> {
  const input = userInput.toLowerCase();
  
  // Analyze user input to determine app type and features
  const isSupport = /support|ticket|help|customer service|issue|bug/i.test(input);
  const isSales = /sales|revenue|deal|crm|pipeline|forecast/i.test(input);
  const isEngineering = /engineering|incident|deploy|devops|monitor|system/i.test(input);
  const isInventory = /inventory|stock|warehouse|product|sku|supply/i.test(input);
  const isCustomerSuccess = /customer success|churn|health|retention|nps/i.test(input);
  const isAnalytics = /analytics|dashboard|metrics|kpi|report|data/i.test(input);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _isChat = /chat|conversation|assistant|bot/i.test(input);
  
  // Extract key features from input
  const wantsCharts = /chart|graph|visual|trend/i.test(input);
  const wantsTables = /table|list|grid|data/i.test(input);
  const wantsKPIs = /kpi|metric|stat|number/i.test(input);
  const wantsTimeline = /timeline|history|activity|log/i.test(input);
  
  // Generate a unique app name based on input
  const words = userInput.split(/\s+/).filter(w => w.length > 3);
  const nameWords = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const appName = nameWords.length > 0 ? `${nameWords.join(" ")} AI` : "Custom AI App";
  
  // Generate system prompt based on detected intent
  let systemPrompt = `You are an intelligent AI assistant`;
  let description = "A custom AI-powered application";
  const suggestedFeatures: string[] = [];
  
  if (isSupport) {
    systemPrompt = `You are a support operations AI assistant. Help users manage support tickets, track issues, prioritize work, and improve response times. You can create, update, and analyze tickets. Always be helpful and solution-oriented.`;
    description = "AI-powered support ticket management and customer service optimization";
    suggestedFeatures.push("Ticket Management", "Priority Routing", "Response Analytics");
  } else if (isSales) {
    systemPrompt = `You are a sales analytics AI assistant. Help users track revenue, manage deals, forecast sales, and analyze pipeline performance. Provide actionable insights to improve sales outcomes.`;
    description = "AI-powered sales analytics and pipeline management";
    suggestedFeatures.push("Revenue Tracking", "Deal Pipeline", "Sales Forecasting");
  } else if (isEngineering) {
    systemPrompt = `You are an engineering operations AI assistant. Help users monitor system health, manage incidents, track deployments, and maintain service reliability. Prioritize uptime and quick resolution.`;
    description = "AI-powered engineering operations and incident management";
    suggestedFeatures.push("Incident Management", "Deployment Tracking", "System Monitoring");
  } else if (isInventory) {
    systemPrompt = `You are an inventory management AI assistant. Help users track stock levels, manage reorders, optimize warehouse operations, and prevent stockouts. Focus on efficiency and accuracy.`;
    description = "AI-powered inventory tracking and supply chain optimization";
    suggestedFeatures.push("Stock Tracking", "Reorder Alerts", "Supplier Management");
  } else if (isCustomerSuccess) {
    systemPrompt = `You are a customer success AI assistant. Help users monitor customer health scores, identify churn risks, track engagement, and improve retention. Focus on proactive customer care.`;
    description = "AI-powered customer success and retention management";
    suggestedFeatures.push("Health Scoring", "Churn Prediction", "Engagement Tracking");
  } else if (isAnalytics) {
    systemPrompt = `You are a data analytics AI assistant. Help users visualize data, track KPIs, generate reports, and discover insights. Make complex data accessible and actionable.`;
    description = "AI-powered data analytics and business intelligence";
    suggestedFeatures.push("Data Visualization", "KPI Tracking", "Custom Reports");
  } else {
    systemPrompt = `You are a helpful AI assistant built with TamboStudio. ${userInput}. Be helpful, accurate, and proactive in assisting users with their tasks.`;
    description = userInput.length > 50 ? userInput.substring(0, 50) + "..." : userInput;
    suggestedFeatures.push("AI Chat", "Task Assistance", "Smart Responses");
  }
  
  // Generate component configuration
  const components: StudioComponent[] = [
    { id: "graph", name: "Graph", description: "Charts and visualizations", enabled: wantsCharts || isAnalytics || isSales },
    { id: "kpi-card", name: "KPI Card", description: "Key metrics display", enabled: wantsKPIs || isAnalytics || isSales || isSupport },
    { id: "data-table", name: "Data Table", description: "Tabular data display", enabled: wantsTables || isSupport || isInventory || isCustomerSuccess },
    { id: "status-badge", name: "Status Badge", description: "Status indicators", enabled: isSupport || isEngineering || isInventory },
    { id: "timeline", name: "Timeline", description: "Activity timeline", enabled: wantsTimeline || isEngineering || isSupport },
    { id: "select-form", name: "Select Form", description: "Interactive forms", enabled: true },
  ];
  
  // Generate MCP server configuration
  const mcpServers: McpServer[] = [
    { id: "data-tools", name: "Data Tools", description: "Data fetching and analysis", enabled: true, tools: ["fetchData", "queryDatabase", "exportData"] },
    { id: "analytics", name: "Analytics", description: "Business analytics", enabled: isAnalytics || isSales, tools: ["generateReport", "calculateMetrics", "forecastTrend"] },
    { id: "notifications", name: "Notifications", description: "Alert management", enabled: isSupport || isEngineering, tools: ["sendAlert", "scheduleNotification", "manageSubscriptions"] },
  ];
  
  return {
    name: appName,
    description,
    systemPrompt,
    components,
    mcpServers,
    suggestedFeatures,
  };
}

export const BootstrapChat: React.FC<{ className?: string }> = ({ className }) => {
  const [input, setInput] = React.useState("");
  const [generationSteps, setGenerationSteps] = React.useState<GenerationStep[]>([]);
  const [generatedConfig, setGeneratedConfig] = React.useState<GeneratedConfig | null>(null);
  
  const {
    bootstrapMessages,
    addBootstrapMessage,
    setSelectedTemplate,
    setSystemPrompt,
    setComponents,
    setMcpServers,
    setAppName,
    setView,
    setIsGenerating,
    isGenerating,
  } = useStudioStore();
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bootstrapMessages, generationSteps]);
  
  const runGenerationSteps = async (userInput: string) => {
    const steps: GenerationStep[] = [
      { id: "analyze", label: "Analyzing your requirements", icon: <Sparkles className="h-4 w-4" />, status: "pending" },
      { id: "components", label: "Selecting components", icon: <Code className="h-4 w-4" />, status: "pending" },
      { id: "tools", label: "Configuring AI tools", icon: <Cpu className="h-4 w-4" />, status: "pending" },
      { id: "prompt", label: "Generating system prompt", icon: <MessageSquare className="h-4 w-4" />, status: "pending" },
    ];
    
    setGenerationSteps(steps);
    
    // Step 1: Analyze
    setGenerationSteps(s => s.map(step => step.id === "analyze" ? { ...step, status: "active" } : step));
    await new Promise(r => setTimeout(r, 800));
    setGenerationSteps(s => s.map(step => step.id === "analyze" ? { ...step, status: "complete" } : step));
    
    // Step 2: Components
    setGenerationSteps(s => s.map(step => step.id === "components" ? { ...step, status: "active" } : step));
    await new Promise(r => setTimeout(r, 600));
    setGenerationSteps(s => s.map(step => step.id === "components" ? { ...step, status: "complete" } : step));
    
    // Step 3: Tools
    setGenerationSteps(s => s.map(step => step.id === "tools" ? { ...step, status: "active" } : step));
    await new Promise(r => setTimeout(r, 700));
    setGenerationSteps(s => s.map(step => step.id === "tools" ? { ...step, status: "complete" } : step));
    
    // Step 4: System Prompt
    setGenerationSteps(s => s.map(step => step.id === "prompt" ? { ...step, status: "active" } : step));
    const config = await generateAppConfig(userInput);
    await new Promise(r => setTimeout(r, 500));
    setGenerationSteps(s => s.map(step => step.id === "prompt" ? { ...step, status: "complete" } : step));
    
    return config;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    const userInput = input.trim();
    setInput("");
    addBootstrapMessage("user", userInput);
    setIsGenerating(true);
    setGeneratedConfig(null);
    
    try {
      const config = await runGenerationSteps(userInput);
      setGeneratedConfig(config);
      
      // Apply the generated config to the store
      setAppName(config.name);
      setSystemPrompt(config.systemPrompt);
      setComponents(config.components);
      setMcpServers(config.mcpServers);
      
      // Find closest matching template for tools
      const matchedTemplate = STUDIO_TEMPLATES.find(t => 
        config.systemPrompt.toLowerCase().includes(t.id.replace("-", " "))
      ) || STUDIO_TEMPLATES[0];
      setSelectedTemplate(matchedTemplate);
      
      const response = `I've generated **${config.name}** for you!

**${config.description}**

Features enabled:
${config.suggestedFeatures.map(f => `• ${f}`).join("\n")}

Components: ${config.components.filter(c => c.enabled).map(c => c.name).join(", ")}

Click **"Launch Your App"** to start using it, or customize it in the builder.`;
      
      addBootstrapMessage("assistant", response);
    } catch {
      addBootstrapMessage("assistant", "Sorry, I encountered an error generating your app. Please try again.");
    }
    
    setIsGenerating(false);
    setGenerationSteps([]);
  };
  
  const handleQuickStart = async (templateId: string) => {
    const template = STUDIO_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    
    addBootstrapMessage("user", `Create a ${template.name.toLowerCase()} app`);
    setIsGenerating(true);
    
    await new Promise(r => setTimeout(r, 500));
    
    setSelectedTemplate(template);
    setAppName(template.name);
    setSystemPrompt(template.systemPrompt);
    setComponents(template.components);
    setMcpServers(template.mcpServers);
    
    setGeneratedConfig({
      name: template.name,
      description: template.description,
      systemPrompt: template.systemPrompt,
      components: template.components,
      mcpServers: template.mcpServers,
      suggestedFeatures: template.components.filter(c => c.enabled).map(c => c.name),
    });
    
    addBootstrapMessage(
      "assistant",
      `I've configured **${template.name}** for you!\n\n**${template.description}**\n\nClick **"Launch Your App"** to start using it.`
    );
    setIsGenerating(false);
  };
  
  const handleLaunchApp = () => {
    setView("builder");
  };
  
  const hasMessages = bootstrapMessages.length > 0;
  const showLaunchButton = hasMessages && !isGenerating && generatedConfig;
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="border-b border-border p-4 bg-gradient-to-r from-[#7FFFC3]/5 to-transparent">
        <div className="flex items-center gap-2">
          <Image
            src="/Octo-Icon.svg"
            alt="TamboStudio"
            width={28}
            height={28}
          />
          <div>
            <h2 className="font-semibold">TamboStudio</h2>
            <p className="text-xs text-muted-foreground">AI App Generator</p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {!hasMessages && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/20 to-[#7FFFC3]/5 mb-4">
                <Zap className="h-10 w-10 text-[#7FFFC3]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">What would you like to build?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Describe your app in plain English. I&apos;ll generate a custom AI application with the right components, tools, and configuration.
              </p>
            </div>
            
            {/* Example prompts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "A dashboard to track sales metrics",
                  "Help desk for customer support",
                  "Inventory management system",
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(example)}
                    className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted-foreground">or start with a template</span>
              </div>
            </div>
            
            {/* Quick start templates */}
            <div className="grid grid-cols-1 gap-2">
              {STUDIO_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleQuickStart(template.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-[#7FFFC3]/50 hover:bg-[#7FFFC3]/5 transition-all text-left group"
                >
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm group-hover:text-[#7FFFC3] transition-colors">
                      {template.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {template.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#7FFFC3] transition-colors" />
                </button>
              ))}
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
                "max-w-[85%] rounded-xl px-4 py-3",
                msg.role === "user"
                  ? "bg-[#7FFFC3] text-gray-900"
                  : "bg-muted"
              )}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content.split("**").map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className={msg.role === "user" ? "text-gray-900" : "text-[#7FFFC3]"}>{part}</strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Generation progress */}
        {isGenerating && generationSteps.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl px-4 py-3 w-full max-w-[85%]">
              <div className="text-xs text-muted-foreground mb-3">Generating your app...</div>
              <div className="space-y-2">
                {generationSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      step.status === "complete" && "bg-[#7FFFC3] text-gray-900",
                      step.status === "active" && "bg-[#7FFFC3]/20 text-[#7FFFC3]",
                      step.status === "pending" && "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {step.status === "complete" ? (
                        <Check className="h-3 w-3" />
                      ) : step.status === "active" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className={cn(
                      "text-sm",
                      step.status === "complete" && "text-foreground",
                      step.status === "active" && "text-[#7FFFC3]",
                      step.status === "pending" && "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Simple loading indicator */}
        {isGenerating && generationSteps.length === 0 && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#7FFFC3]" />
                <span className="text-sm text-muted-foreground">Generating...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Launch button */}
      {showLaunchButton && (
        <div className="p-4 border-t border-border bg-gradient-to-r from-[#7FFFC3]/5 to-transparent">
          <button
            onClick={handleLaunchApp}
            className="w-full py-3 px-4 bg-[#7FFFC3] text-gray-900 rounded-xl font-semibold hover:bg-[#6ee6b0] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-[#7FFFC3]/20"
          >
            <Sparkles className="h-5 w-5" />
            Launch Your App
          </button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Or customize components and settings in the builder
          </p>
        </div>
      )}
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the AI app you want to build..."
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7FFFC3]/50 focus:border-[#7FFFC3]/50 text-sm transition-all"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-5 py-3 bg-[#7FFFC3] text-gray-900 rounded-xl font-medium hover:bg-[#6ee6b0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
