/**
 * @file studio-store.ts
 * @description Zustand store for Tambo Studio state management
 */

import { create } from "zustand";
import { 
  StudioTemplate, 
  StudioComponent, 
  McpServer,
  matchTemplate,
} from "./studio-templates";

export type StudioView = "bootstrap" | "builder";

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
  
  // App name
  appName: string;
  setAppName: (name: string) => void;
  
  // Generation state
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  
  // Launch state
  isLaunched: boolean;
  setIsLaunched: (launched: boolean) => void;
  
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
  appName: "My AI App",
  isGenerating: false,
  isLaunched: false,
};

export const useStudioStore = create<StudioState>((set, get) => ({
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
  
  setAppName: (name) => set({ appName: name }),
  
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  
  setIsLaunched: (launched) => set({ isLaunched: launched }),
  
  processUserInput: (input) => {
    const template = matchTemplate(input);
    get().setSelectedTemplate(template);
    return template;
  },
  
  reset: () => set(initialState),
}));
