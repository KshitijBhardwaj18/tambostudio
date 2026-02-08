/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { SelectForm, selectFormSchema } from "@/components/tambo/select-form";
import { KPICard } from "@/components/tambo/kpi-card";
import { DataTable } from "@/components/tambo/data-table";
import {
  StatusBadge,
  getVariantFromStatus,
} from "@/components/tambo/status-badge";
import { Timeline } from "@/components/tambo/timeline";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import {
  getSalesData,
  getProducts,
  getUserData,
  getKPIs,
} from "@/services/analytics-data";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  getTicketStats,
  getIncidents,
  getDeployments,
  getSystemHealth,
  getInventory,
  getInventoryById,
  updateStock,
  getInventoryStats,
  getCustomers,
  getCustomerById,
  getCustomerStats,
} from "@/services/template-data";

// ============================================
// COMPONENT SCHEMAS
// ============================================

const kpiCardSchema = z.object({
  title: z.string().describe("The title/label for the KPI"),
  value: z
    .union([z.string(), z.number()])
    .describe("The main value to display"),
  change: z.string().optional().describe("The change indicator (e.g., '+12%')"),
  trend: z
    .enum(["up", "down", "neutral"])
    .optional()
    .describe("Direction of the trend"),
});

// Explicit row shape (no Record/dynamic keys) so Tambo propsSchema validation accepts it
const dataTableRowSchema = z.object({
  values: z
    .array(z.union([z.string(), z.number(), z.boolean()]))
    .describe("Cell values in the same order as columns"),
});

const dataTableSchema = z.object({
  columns: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        sortable: z.boolean().optional(),
      }),
    )
    .describe("Column definitions"),
  data: z
    .array(dataTableRowSchema)
    .describe("Array of rows; each row has values matching column order"),
});

const statusBadgeSchema = z.object({
  status: z.string().describe("The status text to display"),
  variant: z
    .enum(["success", "warning", "error", "info", "default"])
    .optional(),
});

const timelineSchema = z.object({
  events: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        timestamp: z.string(),
        status: z.enum(["completed", "current", "pending"]).optional(),
      }),
    )
    .describe("Array of timeline events"),
});

// ============================================
// SALES ANALYTICS TOOLS
// ============================================

export const salesTools: TamboTool[] = [
  {
    name: "getSalesData",
    description:
      "Get monthly sales revenue and units data. Can filter by region (North, South, East, West) or category (Electronics, Clothing, Home)",
    tool: getSalesData,
    toolSchema: z.function().args(
      z
        .object({
          region: z.string().optional(),
          category: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getProducts",
    description:
      "Get top products with sales and revenue information. Can filter by category (Electronics, Furniture, Appliances)",
    tool: getProducts,
    toolSchema: z.function().args(
      z
        .object({
          category: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getUserData",
    description:
      "Get monthly user growth and activity data. Can filter by segment (Free, Premium, Enterprise)",
    tool: getUserData,
    toolSchema: z.function().args(
      z
        .object({
          segment: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getKPIs",
    description:
      "Get key business performance indicators. Can filter by category (Financial, Growth, Quality, Retention, Marketing)",
    tool: getKPIs,
    toolSchema: z.function().args(
      z
        .object({
          category: z.string().optional(),
        })
        .default({}),
    ),
  },
];

// ============================================
// SUPPORT OPS TOOLS
// ============================================

export const supportTools: TamboTool[] = [
  {
    name: "getTickets",
    description:
      "Get support tickets. Can filter by status (open, in_progress, resolved, closed) or priority (low, medium, high, critical)",
    tool: getTickets,
    toolSchema: z.function().args(
      z
        .object({
          status: z.string().optional(),
          priority: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getTicketById",
    description: "Get a specific ticket by its ID",
    tool: getTicketById,
    toolSchema: z.function().args(z.string()),
  },
  {
    name: "createTicket",
    description: "Create a new support ticket",
    tool: createTicket,
    toolSchema: z.function().args(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        customer: z.string().optional(),
      }),
    ),
  },
  {
    name: "updateTicket",
    description:
      "Update an existing ticket. Can update status, priority, or assignee",
    tool: updateTicket,
    toolSchema: z.function().args(
      z.string(),
      z.object({
        status: z
          .enum(["open", "in_progress", "resolved", "closed"])
          .optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        assignee: z.string().optional(),
      }),
    ),
  },
  {
    name: "getTicketStats",
    description:
      "Get ticket statistics including counts by status and average response time",
    tool: getTicketStats,
    toolSchema: z.function().args(z.void()),
  },
];

// ============================================
// ENGINEERING OPS TOOLS
// ============================================

export const engineeringTools: TamboTool[] = [
  {
    name: "getIncidents",
    description:
      "Get active incidents. Can filter by status (investigating, identified, monitoring, resolved) or severity (P1, P2, P3, P4)",
    tool: getIncidents,
    toolSchema: z.function().args(
      z
        .object({
          status: z.string().optional(),
          severity: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getDeployments",
    description:
      "Get recent deployments. Can filter by environment (production, staging, development) or status (success, failed, in_progress, rolled_back)",
    tool: getDeployments,
    toolSchema: z.function().args(
      z
        .object({
          environment: z.string().optional(),
          status: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getSystemHealth",
    description:
      "Get current system health status including service statuses, uptime, and active incidents",
    tool: getSystemHealth,
    toolSchema: z.function().args(z.void()),
  },
];

// ============================================
// INVENTORY MANAGER TOOLS
// ============================================

export const inventoryTools: TamboTool[] = [
  {
    name: "getInventory",
    description:
      "Get inventory items. Can filter by category or show only low stock items",
    tool: getInventory,
    toolSchema: z.function().args(
      z
        .object({
          category: z.string().optional(),
          lowStock: z.boolean().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getInventoryById",
    description: "Get a specific inventory item by its ID",
    tool: getInventoryById,
    toolSchema: z.function().args(z.string()),
  },
  {
    name: "updateStock",
    description: "Update the stock quantity for an inventory item",
    tool: updateStock,
    toolSchema: z.function().args(z.string(), z.number()),
  },
  {
    name: "getInventoryStats",
    description:
      "Get inventory statistics including total SKUs, low stock count, and total value",
    tool: getInventoryStats,
    toolSchema: z.function().args(z.void()),
  },
];

// ============================================
// CUSTOMER SUCCESS TOOLS
// ============================================

export const customerSuccessTools: TamboTool[] = [
  {
    name: "getCustomers",
    description:
      "Get customers. Can filter by status (healthy, at_risk, churned) or plan (starter, professional, enterprise)",
    tool: getCustomers,
    toolSchema: z.function().args(
      z
        .object({
          status: z.string().optional(),
          plan: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getCustomerById",
    description: "Get a specific customer by their ID",
    tool: getCustomerById,
    toolSchema: z.function().args(z.string()),
  },
  {
    name: "getCustomerStats",
    description:
      "Get customer success statistics including total MRR, average health score, and NPS",
    tool: getCustomerStats,
    toolSchema: z.function().args(z.void()),
  },
];

// ============================================
// ALL TOOLS (default)
// ============================================

export const tools: TamboTool[] = [
  ...salesTools,
  ...supportTools,
  ...engineeringTools,
  ...inventoryTools,
  ...customerSuccessTools,
];

// ============================================
// COMPONENTS
// ============================================

export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "Use this when you want to display a chart. It supports bar, line, and pie charts. When you see data generally use this component. IMPORTANT: When asked to create a graph, always generate it first in the chat - do NOT add it directly to the canvas/dashboard. Let the user decide if they want to add it.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "SelectForm",
    description:
      "ALWAYS use this component instead of listing options as bullet points in text. Whenever you need to ask the user a question and would normally follow up with bullet points or numbered options, use this component instead. For yes/no or single-choice questions, use mode='single'. For questions where the user can select multiple options, use mode='multi' (default). Each group has a label (the question) and options (the choices). Examples: 'Would you like to continue?' with Yes/No options, or 'Which regions interest you?' with multiple region options.",
    component: SelectForm,
    propsSchema: selectFormSchema,
  },
  {
    name: "KPICard",
    description:
      "Display a key performance indicator with a title, value, and optional trend indicator. Use this for showing metrics like revenue, user counts, or percentages.",
    component: KPICard,
    propsSchema: kpiCardSchema,
  },
  {
    name: "DataTable",
    description:
      "Display tabular data with sortable columns. Use this for showing lists of items like tickets, customers, or inventory.",
    component: DataTable,
    propsSchema: dataTableSchema,
  },
  {
    name: "StatusBadge",
    description:
      "Display a status indicator badge. Use variants: success (green), warning (yellow), error (red), info (blue), default (gray).",
    component: StatusBadge,
    propsSchema: statusBadgeSchema,
  },
  {
    name: "Timeline",
    description:
      "Display a chronological list of events. Use this for showing activity history, deployment logs, or incident timelines.",
    component: Timeline,
    propsSchema: timelineSchema,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get tools for a specific template
 */
export function getToolsForTemplate(templateId: string): TamboTool[] {
  switch (templateId) {
    case "sales-analytics":
      return salesTools;
    case "support-ops":
      return supportTools;
    case "engineering-ops":
      return engineeringTools;
    case "inventory-manager":
      return inventoryTools;
    case "customer-success":
      return customerSuccessTools;
    default:
      return tools;
  }
}

/**
 * Get components for a specific template
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- _templateId reserved for future template-specific filtering
export function getComponentsForTemplate(
  _templateId: string,
): TamboComponent[] {
  return components;
}

// Re-export for convenience
export { getVariantFromStatus };
