/**
 * @file data-source-store.ts
 * @description Store for managing user data sources - CSV, JSON, or sample data
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DataSourceType = "csv" | "json" | "sample" | "api";

export interface DataField {
  name: string;
  type: "string" | "number" | "date" | "boolean";
  sample?: string | number;
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  fields: DataField[];
  data: Record<string, unknown>[];
  createdAt: number;
}

// Sample data templates
export const SAMPLE_DATA_TEMPLATES = {
  sales: {
    name: "Sales Data",
    fields: [
      { name: "month", type: "string" as const, sample: "January" },
      { name: "revenue", type: "number" as const, sample: 45000 },
      { name: "units", type: "number" as const, sample: 120 },
      { name: "region", type: "string" as const, sample: "North" },
      { name: "product", type: "string" as const, sample: "Widget Pro" },
    ],
    data: [
      { month: "January", revenue: 45000, units: 120, region: "North", product: "Widget Pro" },
      { month: "February", revenue: 52000, units: 140, region: "South", product: "Widget Pro" },
      { month: "March", revenue: 38000, units: 95, region: "East", product: "Gadget X" },
      { month: "April", revenue: 61000, units: 165, region: "West", product: "Widget Pro" },
      { month: "May", revenue: 43000, units: 110, region: "North", product: "Gadget X" },
      { month: "June", revenue: 55000, units: 145, region: "South", product: "Widget Pro" },
    ],
  },
  customers: {
    name: "Customer Data",
    fields: [
      { name: "id", type: "string" as const, sample: "CUST-001" },
      { name: "name", type: "string" as const, sample: "Acme Corp" },
      { name: "email", type: "string" as const, sample: "contact@acme.com" },
      { name: "plan", type: "string" as const, sample: "Enterprise" },
      { name: "mrr", type: "number" as const, sample: 5000 },
      { name: "healthScore", type: "number" as const, sample: 85 },
      { name: "status", type: "string" as const, sample: "Active" },
    ],
    data: [
      { id: "CUST-001", name: "Acme Corp", email: "contact@acme.com", plan: "Enterprise", mrr: 5000, healthScore: 85, status: "Active" },
      { id: "CUST-002", name: "TechStart Inc", email: "hello@techstart.io", plan: "Professional", mrr: 2500, healthScore: 72, status: "Active" },
      { id: "CUST-003", name: "Global Ltd", email: "info@global.com", plan: "Enterprise", mrr: 8000, healthScore: 45, status: "At Risk" },
      { id: "CUST-004", name: "StartupXYZ", email: "team@startupxyz.com", plan: "Starter", mrr: 500, healthScore: 90, status: "Active" },
      { id: "CUST-005", name: "MegaCorp", email: "support@megacorp.com", plan: "Enterprise", mrr: 15000, healthScore: 78, status: "Active" },
    ],
  },
  tickets: {
    name: "Support Tickets",
    fields: [
      { name: "id", type: "string" as const, sample: "TKT-001" },
      { name: "title", type: "string" as const, sample: "Login issue" },
      { name: "status", type: "string" as const, sample: "Open" },
      { name: "priority", type: "string" as const, sample: "High" },
      { name: "assignee", type: "string" as const, sample: "Sarah" },
      { name: "createdAt", type: "date" as const, sample: "2024-01-15" },
    ],
    data: [
      { id: "TKT-001", title: "Login issue", status: "Open", priority: "High", assignee: "Sarah", createdAt: "2024-01-15" },
      { id: "TKT-002", title: "Payment failed", status: "In Progress", priority: "Critical", assignee: "Mike", createdAt: "2024-01-14" },
      { id: "TKT-003", title: "Feature request", status: "Open", priority: "Low", assignee: null, createdAt: "2024-01-13" },
      { id: "TKT-004", title: "API timeout", status: "Resolved", priority: "Medium", assignee: "Sarah", createdAt: "2024-01-12" },
      { id: "TKT-005", title: "Dashboard bug", status: "Open", priority: "High", assignee: "Alex", createdAt: "2024-01-11" },
    ],
  },
  inventory: {
    name: "Inventory Data",
    fields: [
      { name: "sku", type: "string" as const, sample: "SKU-001" },
      { name: "name", type: "string" as const, sample: "Wireless Mouse" },
      { name: "category", type: "string" as const, sample: "Electronics" },
      { name: "stock", type: "number" as const, sample: 150 },
      { name: "price", type: "number" as const, sample: 29.99 },
      { name: "reorderPoint", type: "number" as const, sample: 50 },
    ],
    data: [
      { sku: "SKU-001", name: "Wireless Mouse", category: "Electronics", stock: 150, price: 29.99, reorderPoint: 50 },
      { sku: "SKU-002", name: "USB-C Cable", category: "Electronics", stock: 12, price: 14.99, reorderPoint: 100 },
      { sku: "SKU-003", name: "Laptop Stand", category: "Accessories", stock: 45, price: 49.99, reorderPoint: 20 },
      { sku: "SKU-004", name: "Webcam HD", category: "Electronics", stock: 8, price: 79.99, reorderPoint: 25 },
      { sku: "SKU-005", name: "Keyboard", category: "Electronics", stock: 200, price: 59.99, reorderPoint: 30 },
    ],
  },
};

interface DataSourceState {
  dataSources: DataSource[];
  activeDataSourceId: string | null;
  
  // Actions
  addDataSource: (source: Omit<DataSource, "id" | "createdAt">) => string;
  removeDataSource: (id: string) => void;
  setActiveDataSource: (id: string | null) => void;
  getActiveDataSource: () => DataSource | null;
  
  // Parse data from different formats
  parseCSV: (csvString: string, name: string) => string;
  parseJSON: (jsonString: string, name: string) => string;
  addSampleData: (templateKey: keyof typeof SAMPLE_DATA_TEMPLATES) => string;
  
  // Query data
  queryData: (sourceId: string, filters?: Record<string, unknown>) => Record<string, unknown>[];
  getDataStats: (sourceId: string) => { count: number; fields: DataField[] };
  
  reset: () => void;
}

// Helper to infer field types from data
function inferFieldType(value: unknown): DataField["type"] {
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "string") {
    // Check if it's a date
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    if (dateRegex.test(value)) return "date";
  }
  return "string";
}

// Helper to extract fields from data
function extractFields(data: Record<string, unknown>[]): DataField[] {
  if (data.length === 0) return [];
  
  const firstRow = data[0];
  return Object.entries(firstRow).map(([name, value]) => ({
    name,
    type: inferFieldType(value),
    sample: value as string | number,
  }));
}

// Simple CSV parser
function parseCSVString(csv: string): Record<string, unknown>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const data: Record<string, unknown>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, unknown> = {};
    
    headers.forEach((header, index) => {
      let value: unknown = values[index] || "";
      // Try to parse as number
      const numValue = parseFloat(value as string);
      if (!isNaN(numValue) && value !== "") {
        value = numValue;
      }
      row[header] = value;
    });
    
    data.push(row);
  }
  
  return data;
}

const initialState = {
  dataSources: [] as DataSource[],
  activeDataSourceId: null as string | null,
};

export const useDataSourceStore = create<DataSourceState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addDataSource: (source) => {
        const id = crypto.randomUUID();
        const newSource: DataSource = {
          ...source,
          id,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          dataSources: [...state.dataSources, newSource],
          activeDataSourceId: id,
        }));
        
        return id;
      },
      
      removeDataSource: (id) => {
        set((state) => ({
          dataSources: state.dataSources.filter((s) => s.id !== id),
          activeDataSourceId: state.activeDataSourceId === id ? null : state.activeDataSourceId,
        }));
      },
      
      setActiveDataSource: (id) => {
        set({ activeDataSourceId: id });
      },
      
      getActiveDataSource: () => {
        const state = get();
        return state.dataSources.find((s) => s.id === state.activeDataSourceId) || null;
      },
      
      parseCSV: (csvString, name) => {
        const data = parseCSVString(csvString);
        const fields = extractFields(data);
        
        return get().addDataSource({
          name,
          type: "csv",
          fields,
          data,
        });
      },
      
      parseJSON: (jsonString, name) => {
        try {
          const parsed = JSON.parse(jsonString);
          const data = Array.isArray(parsed) ? parsed : [parsed];
          const fields = extractFields(data);
          
          return get().addDataSource({
            name,
            type: "json",
            fields,
            data,
          });
        } catch {
          throw new Error("Invalid JSON format");
        }
      },
      
      addSampleData: (templateKey) => {
        const template = SAMPLE_DATA_TEMPLATES[templateKey];
        
        return get().addDataSource({
          name: template.name,
          type: "sample",
          fields: template.fields,
          data: template.data,
        });
      },
      
      queryData: (sourceId, filters) => {
        const source = get().dataSources.find((s) => s.id === sourceId);
        if (!source) return [];
        
        let result = [...source.data];
        
        if (filters) {
          result = result.filter((row) => {
            return Object.entries(filters).every(([key, value]) => {
              if (value === undefined || value === null || value === "") return true;
              const rowValue = row[key];
              if (typeof value === "string") {
                return String(rowValue).toLowerCase().includes(value.toLowerCase());
              }
              return rowValue === value;
            });
          });
        }
        
        return result;
      },
      
      getDataStats: (sourceId) => {
        const source = get().dataSources.find((s) => s.id === sourceId);
        if (!source) return { count: 0, fields: [] };
        
        return {
          count: source.data.length,
          fields: source.fields,
        };
      },
      
      reset: () => set(initialState),
    }),
    {
      name: "tambo-data-sources",
    }
  )
);
