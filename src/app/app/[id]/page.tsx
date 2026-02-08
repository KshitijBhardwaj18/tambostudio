"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { useLaunchedApp } from "@/lib/studio-store";
import { components, tools, getToolsForTemplate, getComponentsForTemplate } from "@/lib/tambo";
import { generateToolsForDataSources } from "@/lib/dynamic-tools";
import { ArrowLeft } from "lucide-react";
import { useSyncExternalStore } from "react";
import { LaunchedAppChat } from "@/components/studio/launched-app-chat";
import Image from "next/image";
import Link from "next/link";

const STORAGE_KEY = "tambo-launched-app-context";

function getContextKey(appId: string): string {
  const key = `${STORAGE_KEY}-${appId}`;
  if (typeof window === "undefined") return key;
  
  let storedKey = localStorage.getItem(key);
  if (!storedKey) {
    storedKey = crypto.randomUUID();
    localStorage.setItem(key, storedKey);
  }
  return storedKey;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function useContextKey(appId: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => getContextKey(appId),
    () => null
  );
}

export default function LaunchedAppPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;
  const launchedApp = useLaunchedApp();
  const contextKey = useContextKey(appId);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  // Generate tools from data sources
  const dataSourceTools = useMemo(() => {
    const sources = launchedApp?.dataSources;
    if (!sources || sources.length === 0) {
      return [];
    }
    return generateToolsForDataSources(sources);
  }, [launchedApp?.dataSources]);

  // Memoize tools and components to avoid recalculation
  const appTools = useMemo(() => {
    const templateTools = launchedApp ? getToolsForTemplate(launchedApp.templateId) : [];
    // Combine template tools with data source tools
    return [...templateTools, ...dataSourceTools];
  }, [launchedApp, dataSourceTools]);
  
  const appComponents = useMemo(() => 
    launchedApp ? getComponentsForTemplate(launchedApp.templateId) : [],
    [launchedApp]
  );

  // Wait for client-side hydration
  if (!contextKey) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading app...</span>
        </div>
      </div>
    );
  }

  // Check if we have a launched app config
  if (!launchedApp) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">No App Found</h1>
          <p className="text-muted-foreground">
            This app hasn&apos;t been configured yet.
          </p>
        </div>
        <button
          onClick={() => router.push("/studio")}
          className="flex items-center gap-2 px-4 py-2 bg-[#7FFFC3] text-gray-900 rounded-lg hover:bg-[#6ee6b0] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go to TamboStudio
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/studio")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Studio
          </button>
          <div className="h-6 w-px bg-border" />
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/Octo-Icon.svg"
              alt="TamboStudio"
              width={28}
              height={28}
            />
            <span className="font-semibold">{launchedApp.name}</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showSystemPrompt ? "Hide" : "Show"} System Prompt
          </button>
          <span className="text-xs text-muted-foreground">
            Powered by <a href="https://tambo.co" target="_blank" rel="noopener noreferrer" className="text-[#7FFFC3] hover:underline">Tambo</a>
          </span>
        </div>
      </header>

      {/* System Prompt Banner */}
      {showSystemPrompt && (
        <div className="bg-muted/50 border-b border-border p-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-medium text-muted-foreground mb-1">System Prompt:</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">{launchedApp.systemPrompt}</p>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
          components={appComponents.length > 0 ? appComponents : components}
          tools={appTools.length > 0 ? appTools : tools}
          contextKey={contextKey}
        >
          <TamboMcpProvider>
            <LaunchedAppChat 
              appConfig={launchedApp}
            />
          </TamboMcpProvider>
        </TamboProvider>
      </div>
    </div>
  );
}
