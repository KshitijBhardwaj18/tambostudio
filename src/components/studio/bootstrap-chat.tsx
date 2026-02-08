"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/studio-store";
import { useDataSourceStore, SAMPLE_DATA_TEMPLATES } from "@/lib/data-source-store";
import { STUDIO_TEMPLATES, STUDIO_COMPONENTS, MCP_SERVERS } from "@/lib/studio-templates";
import { generateSystemPromptForDataSources } from "@/lib/dynamic-tools";
import { 
  ArrowRight, 
  Database, 
  FileSpreadsheet, 
  FileJson, 
  Table,
  Sparkles,
  Loader2,
  Check,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";

type Step = "data" | "describe" | "ready";

export const BootstrapChat: React.FC<{ className?: string }> = ({ className }) => {
  const [step, setStep] = React.useState<Step>("data");
  const [appDescription, setAppDescription] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadType, setUploadType] = React.useState<"csv" | "json" | null>(null);
  const [textInput, setTextInput] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const {
    setSelectedTemplate,
    setSystemPrompt,
    setComponents,
    setMcpServers,
    setAppName,
    setAppDataSources,
    setView,
  } = useStudioStore();
  
  const { 
    dataSources, 
    addSampleData, 
    parseCSV, 
    parseJSON,
    removeDataSource,
  } = useDataSourceStore();
  
  // Sync data sources to studio store
  React.useEffect(() => {
    setAppDataSources(dataSources);
  }, [dataSources, setAppDataSources]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTextInput(content);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsText(file);
  };
  
  const handleAddDataSource = () => {
    setUploadError(null);
    
    try {
      if (uploadType === "csv") {
        parseCSV(textInput, fileName || "CSV Data");
      } else if (uploadType === "json") {
        parseJSON(textInput, fileName || "JSON Data");
      }
      
      setShowUploadModal(false);
      setTextInput("");
      setFileName("");
      setUploadType(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to parse data");
    }
  };
  
  const handleAddSampleData = (key: keyof typeof SAMPLE_DATA_TEMPLATES) => {
    addSampleData(key);
  };
  
  const handleGenerateApp = async () => {
    if (dataSources.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate generation time
    await new Promise(r => setTimeout(r, 1500));
    
    // Generate app name from description or data source names
    const appName = appDescription 
      ? appDescription.split(" ").slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") + " AI"
      : dataSources[0].name + " Assistant";
    
    // Generate system prompt based on data sources
    const systemPrompt = generateSystemPromptForDataSources(dataSources, appName);
    
    // Determine which components to enable based on data
    const hasNumericData = dataSources.some(ds => ds.fields.some(f => f.type === "number"));
    const hasStringData = dataSources.some(ds => ds.fields.some(f => f.type === "string"));
    
    const enabledComponents = STUDIO_COMPONENTS.map(comp => ({
      ...comp,
      enabled: 
        (comp.id === "graph" && hasNumericData) ||
        (comp.id === "kpi-card" && hasNumericData) ||
        (comp.id === "data-table" && true) ||
        (comp.id === "status-badge" && hasStringData) ||
        (comp.id === "select-form" && true) ||
        comp.id === "timeline",
    }));
    
    // Enable relevant MCP servers
    const enabledServers = MCP_SERVERS.map(server => ({
      ...server,
      enabled: server.id === "data-tools" || server.id === "analytics",
    }));
    
    // Apply configuration
    setAppName(appName);
    setSystemPrompt(systemPrompt);
    setComponents(enabledComponents);
    setMcpServers(enabledServers);
    setSelectedTemplate(STUDIO_TEMPLATES[0]); // Use first template as base
    
    setIsGenerating(false);
    setStep("ready");
  };
  
  const handleLaunch = () => {
    setView("builder");
  };
  
  const handleQuickStart = (templateId: string) => {
    const template = STUDIO_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    // Add corresponding sample data
    const sampleDataMap: Record<string, keyof typeof SAMPLE_DATA_TEMPLATES> = {
      "sales-analytics": "sales",
      "support-ops": "tickets",
      "customer-success": "customers",
      "inventory-manager": "inventory",
    };
    
    const sampleKey = sampleDataMap[templateId];
    if (sampleKey) {
      addSampleData(sampleKey);
    }
    
    setSelectedTemplate(template);
    setAppName(template.name);
    setSystemPrompt(template.systemPrompt);
    setComponents(template.components);
    setMcpServers(template.mcpServers);
    setStep("ready");
  };
  
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
            <p className="text-xs text-muted-foreground">Build AI apps from your data</p>
          </div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            step === "data" ? "bg-[#7FFFC3] text-gray-900" : "bg-[#7FFFC3]/20 text-[#7FFFC3]"
          )}>
            {dataSources.length > 0 ? <Check className="h-3 w-3" /> : <span>1</span>}
            <span>Data</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            step === "describe" ? "bg-[#7FFFC3] text-gray-900" : 
            step === "ready" ? "bg-[#7FFFC3]/20 text-[#7FFFC3]" : "bg-muted text-muted-foreground"
          )}>
            <span>2</span>
            <span>Configure</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            step === "ready" ? "bg-[#7FFFC3] text-gray-900" : "bg-muted text-muted-foreground"
          )}>
            <span>3</span>
            <span>Launch</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {step === "data" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/20 to-[#7FFFC3]/5 mb-4">
                <Database className="h-8 w-8 text-[#7FFFC3]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Data</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Upload your data or use sample datasets. TamboStudio will generate 
                tools to query and analyze it.
              </p>
            </div>
            
            {/* Connected data sources */}
            {dataSources.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Connected Data:</p>
                {dataSources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#7FFFC3]/30 bg-[#7FFFC3]/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7FFFC3]/20 flex items-center justify-center">
                        {source.type === "csv" && <FileSpreadsheet className="h-4 w-4 text-[#7FFFC3]" />}
                        {source.type === "json" && <FileJson className="h-4 w-4 text-[#7FFFC3]" />}
                        {source.type === "sample" && <Table className="h-4 w-4 text-[#7FFFC3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{source.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {source.data.length} records • {source.fields.length} fields
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDataSource(source.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add data options */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                {dataSources.length > 0 ? "Add more data:" : "Choose a data source:"}
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setShowUploadModal(true); setUploadType("csv"); }}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-[#7FFFC3]/50 hover:bg-[#7FFFC3]/5 transition-all"
                >
                  <FileSpreadsheet className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Upload CSV</span>
                </button>
                
                <button
                  onClick={() => { setShowUploadModal(true); setUploadType("json"); }}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-[#7FFFC3]/50 hover:bg-[#7FFFC3]/5 transition-all"
                >
                  <FileJson className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Upload JSON</span>
                </button>
              </div>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 text-xs text-muted-foreground">or use sample data</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SAMPLE_DATA_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => handleAddSampleData(key as keyof typeof SAMPLE_DATA_TEMPLATES)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-[#7FFFC3]/50 hover:bg-[#7FFFC3]/5 transition-all text-left"
                  >
                    <Table className="h-4 w-4 text-purple-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{template.name}</p>
                      <p className="text-[10px] text-muted-foreground">{template.data.length} records</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick start templates */}
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground">Or start with a template:</p>
              <div className="grid grid-cols-1 gap-2">
                {STUDIO_TEMPLATES.slice(0, 3).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleQuickStart(template.id)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-[#7FFFC3]/50 hover:bg-[#7FFFC3]/5 transition-all text-left group"
                  >
                    <span className="text-xl">{template.icon}</span>
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
          </div>
        )}
        
        {step === "describe" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/20 to-[#7FFFC3]/5 mb-4">
                <Sparkles className="h-8 w-8 text-[#7FFFC3]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Describe Your App</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Tell us what you want to do with your data. We&apos;ll configure the AI accordingly.
              </p>
            </div>
            
            {/* Data summary */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Your data:</p>
              <div className="flex flex-wrap gap-2">
                {dataSources.map((source) => (
                  <span key={source.id} className="px-2 py-1 bg-[#7FFFC3]/10 text-[#7FFFC3] rounded text-xs font-medium">
                    {source.name} ({source.data.length} records)
                  </span>
                ))}
              </div>
            </div>
            
            {/* Description input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What would you like to do with this data? (optional)
              </label>
              <textarea
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                placeholder="e.g., Analyze sales trends, track customer health, manage inventory levels..."
                className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#7FFFC3]/50 resize-none"
              />
            </div>
            
            {/* Generate button */}
            <button
              onClick={handleGenerateApp}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-[#7FFFC3] text-gray-900 rounded-xl font-semibold hover:bg-[#6ee6b0] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate App
                </>
              )}
            </button>
          </div>
        )}
        
        {step === "ready" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/20 to-[#7FFFC3]/5 mb-4">
                <Check className="h-8 w-8 text-[#7FFFC3]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your App is Ready!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Launch your app to start chatting with your data, or customize it further in the builder.
              </p>
            </div>
            
            {/* App summary */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Data Sources</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dataSources.map((source) => (
                    <span key={source.id} className="px-2 py-1 bg-[#7FFFC3]/10 text-[#7FFFC3] rounded text-xs font-medium">
                      {source.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground">Generated Tools</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dataSources.map((source) => (
                    <React.Fragment key={source.id}>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                        get{source.name.replace(/\s+/g, "")}Data
                      </span>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                        search{source.name.replace(/\s+/g, "")}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground">Components</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Graph", "KPI Card", "Data Table", "Status Badge"].map((comp) => (
                    <span key={comp} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Launch button */}
            <button
              onClick={handleLaunch}
              className="w-full py-3 px-4 bg-[#7FFFC3] text-gray-900 rounded-xl font-semibold hover:bg-[#6ee6b0] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-[#7FFFC3]/20"
            >
              <Sparkles className="h-5 w-5" />
              Launch App
            </button>
            
            <p className="text-xs text-center text-muted-foreground">
              You can customize components and settings in the builder
            </p>
          </div>
        )}
      </div>
      
      {/* Continue button for data step */}
      {step === "data" && dataSources.length > 0 && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setStep("describe")}
            className="w-full py-3 px-4 bg-[#7FFFC3] text-gray-900 rounded-xl font-semibold hover:bg-[#6ee6b0] transition-all flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border border-border rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Upload {uploadType?.toUpperCase()}</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadType(null);
                  setTextInput("");
                  setUploadError(null);
                }}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder={`My ${uploadType?.toUpperCase()} Data`}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#7FFFC3]/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Upload or Paste</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={uploadType === "csv" ? ".csv" : ".json"}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-[#7FFFC3]/50 transition-colors mb-2"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload</span>
                </button>
                
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={uploadType === "csv" 
                    ? "name,value,category\nItem 1,100,A"
                    : '[{"name": "Item 1", "value": 100}]'
                  }
                  className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7FFFC3]/50"
                />
              </div>
              
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              
              <button
                onClick={handleAddDataSource}
                disabled={!textInput.trim()}
                className="w-full py-2 bg-[#7FFFC3] text-gray-900 rounded-lg font-medium hover:bg-[#6ee6b0] transition-colors disabled:opacity-50"
              >
                Add Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
