/**
 * @file studio-store.ts
 * @description Zustand store for Tambo Studio state management with persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  StudioTemplate, 
  StudioComponent, 
  McpServer,
  matchTemplate,
} from "./studio-templates";
import { DataSource } from "./data-source-store";

export type StudioView = "bootstrap" | "builder";

// Configuration for a launched app
export interface LaunchedAppConfig {
  id: string;
  name: string;
  templateId: string;
  systemPrompt: string;
  enabledComponents: string[];
  enabledMcpServers: string[];
  dataSources: DataSource[];
  createdAt: number;
}

interface StudioState {
  // Current view
  view: StudioView;
  setView: (view: StudioView) => void;
  
  // Bootstrap chat
  bootstrapMessages: { role: "user" | "assistant"; content: string }[];
  addBootstrapMessage: (role: "user" | "assistant", content: string) => void;
  clearBootstrapMessages: () => void;
  
  // Selected template
  selectedTemplate: StudioTemplate | null;
  setSelectedTemplate: (template: StudioTemplate | null) => void;
  
  // Customized config
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  
  components: StudioComponent[];
  toggleComponent: (id: string) => void;
  setComponents: (components: StudioComponent[]) => void;
  
  mcpServers: McpServer[];
  toggleMcpServer: (id: string) => void;
  setMcpServers: (servers: McpServer[]) => void;
  
  // Data sources for the app
  appDataSources: DataSource[];
  setAppDataSources: (sources: DataSource[]) => void;
  
  // App name
  appName: string;
  setAppName: (name: string) => void;
  
  // Generation state
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  
  // Launch state
  isLaunched: boolean;
  setIsLaunched: (launched: boolean) => void;
  
  // Launched app config (persisted)
  launchedApp: LaunchedAppConfig | null;
  
  // Launch the app and return the app ID
  launchApp: () => string;
  
  // Process user input and select template
  processUserInput: (input: string) => StudioTemplate;
  
  // Reset to initial state
  reset: () => void;
}

const initialState = {
  view: "bootstrap" as StudioView,
  bootstrapMessages: [] as { role: "user" | "assistant"; content: string }[],
  selectedTemplate: null as StudioTemplate | null,
  systemPrompt: "",
  components: [] as StudioComponent[],
  mcpServers: [] as McpServer[],
  appDataSources: [] as DataSource[],
  appName: "My AI App",
  isGenerating: false,
  isLaunched: false,
  launchedApp: null as LaunchedAppConfig | null,
};

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setView: (view) => set({ view }),
      
      addBootstrapMessage: (role, content) => set((state) => ({
        bootstrapMessages: [...state.bootstrapMessages, { role, content }],
      })),
      
      clearBootstrapMessages: () => set({ bootstrapMessages: [] }),
      
      setSelectedTemplate: (template) => {
        if (template) {
          set({
            selectedTemplate: template,
            systemPrompt: template.systemPrompt,
            components: [...template.components],
            mcpServers: [...template.mcpServers],
            appName: template.name,
          });
        } else {
          set({ selectedTemplate: null });
        }
      },
      
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      
      toggleComponent: (id) => set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, enabled: !c.enabled } : c
        ),
      })),
      
      setComponents: (components) => set({ components }),
      
      toggleMcpServer: (id) => set((state) => ({
        mcpServers: state.mcpServers.map((s) =>
          s.id === id ? { ...s, enabled: !s.enabled } : s
        ),
      })),
      
      setMcpServers: (servers) => set({ mcpServers: servers }),
      
      setAppDataSources: (sources) => set({ appDataSources: sources }),
      
      setAppName: (name) => set({ appName: name }),
      
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      
      setIsLaunched: (launched) => set({ isLaunched: launched }),
      
      launchApp: () => {
        const state = get();
        const appId = crypto.randomUUID();
        
        const config: LaunchedAppConfig = {
          id: appId,
          name: state.appName,
          templateId: state.selectedTemplate?.id || "custom",
          systemPrompt: state.systemPrompt,
          enabledComponents: state.components
            .filter((c) => c.enabled)
            .map((c) => c.id),
          enabledMcpServers: state.mcpServers
            .filter((s) => s.enabled)
            .map((s) => s.id),
          dataSources: state.appDataSources,
          createdAt: Date.now(),
        };
        
        set({ launchedApp: config, isLaunched: true });
        return appId;
      },
      
      processUserInput: (input) => {
        const template = matchTemplate(input);
        get().setSelectedTemplate(template);
        return template;
      },
      
      reset: () => set(initialState),
    }),
    {
      name: "tambo-studio-storage",
      partialize: (state) => ({
        launchedApp: state.launchedApp,
      }),
    }
  )
);

// Hook to get launched app config
export const useLaunchedApp = () => {
  return useStudioStore((state) => state.launchedApp);
};
