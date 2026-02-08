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
import { KPICard, kpiCardSchema } from "@/components/tambo/kpi-card";
import { DataTable, dataTableSchema } from "@/components/tambo/data-table";
import { StatusBadge, statusBadgeSchema } from "@/components/tambo/status-badge";
import { Timeline, timelineSchema } from "@/components/tambo/timeline";
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
  getTicketStats,
  createTicket,
  updateTicket,
  assignTicket,
  getIncidents,
  getDeployments,
  getSystemHealth,
  getInventory,
  getInventoryStats,
  updateStock,
  getCustomers,
  getCustomerById,
  getCustomerStats,
} from "@/services/template-data";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  // Analytics tools
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
  // Support Operations tools
  {
    name: "getTickets",
    description:
      "Get support tickets. Can filter by status (open, in_progress, resolved, closed), priority (low, medium, high, critical), or assignee name",
    tool: getTickets,
    toolSchema: z.function().args(
      z
        .object({
          status: z.string().optional(),
          priority: z.string().optional(),
          assignee: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getTicketById",
    description: "Get a specific ticket by its ID (e.g., TKT-1234)",
    tool: getTicketById,
    toolSchema: z.function().args(z.string()),
  },
  {
    name: "getTicketStats",
    description: "Get ticket statistics including open count, in-progress count, resolved count, and average response time",
    tool: getTicketStats,
    toolSchema: z.function().args(z.void()),
  },
  {
    name: "createTicket",
    description: "Create a new support ticket with title, description, priority, customer, and category",
    tool: createTicket,
    toolSchema: z.function().args(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        customer: z.string().optional(),
        category: z.string().optional(),
      }),
    ),
  },
  {
    name: "updateTicket",
    description: "Update an existing ticket's status, priority, or assignee",
    tool: updateTicket,
    toolSchema: z.function().args(
      z.string(),
      z.object({
        status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        assignee: z.string().optional(),
      }),
    ),
  },
  {
    name: "assignTicket",
    description: "Assign a ticket to a team member",
    tool: assignTicket,
    toolSchema: z.function().args(z.string(), z.string()),
  },
  // Engineering Ops tools
  {
    name: "getIncidents",
    description: "Get system incidents. Can filter by severity (P1, P2, P3, P4) or status (investigating, identified, monitoring, resolved)",
    tool: getIncidents,
    toolSchema: z.function().args(
      z
        .object({
          severity: z.string().optional(),
          status: z.string().optional(),
        })
        .default({}),
    ),
  },
  {
    name: "getDeployments",
    description: "Get deployment history. Can filter by environment (production, staging, development) or status (success, failed, in_progress, rolled_back)",
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
    description: "Get current system health metrics including uptime, error rate, latency, and active incident count",
    tool: getSystemHealth,
    toolSchema: z.function().args(z.void()),
  },
  // Inventory tools
  {
    name: "getInventory",
    description: "Get inventory items. Can filter by category or lowStock (true to show only items below reorder level)",
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
    name: "getInventoryStats",
    description: "Get inventory statistics including total SKUs, low stock count, total value, and category count",
    tool: getInventoryStats,
    toolSchema: z.function().args(z.void()),
  },
  {
    name: "updateStock",
    description: "Update stock quantity for an item by SKU",
    tool: updateStock,
    toolSchema: z.function().args(z.string(), z.number()),
  },
  // Customer Success tools
  {
    name: "getCustomers",
    description: "Get customers. Can filter by status (healthy, at_risk, churned) or plan (starter, professional, enterprise)",
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
    description: "Get a specific customer by their ID (e.g., CUS-001)",
    tool: getCustomerById,
    toolSchema: z.function().args(z.string()),
  },
  {
    name: "getCustomerStats",
    description: "Get customer success statistics including total customers, at-risk count, average health score, total MRR, and average NPS",
    tool: getCustomerStats,
    toolSchema: z.function().args(z.void()),
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
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
      "Display a key performance indicator with a title, value, optional change indicator, and trend direction. Use this for showing metrics like revenue, counts, percentages, or any important number. The trend can be 'up' (positive/green), 'down' (negative/red), or 'neutral' (gray).",
    component: KPICard,
    propsSchema: kpiCardSchema,
  },
  {
    name: "DataTable",
    description:
      "Display tabular data with columns and rows. Use this for showing lists of items like tickets, customers, inventory, or any structured data. Define columns with key, label, and optional alignment. Rows are objects with keys matching column keys.",
    component: DataTable,
    propsSchema: dataTableSchema,
  },
  {
    name: "StatusBadge",
    description:
      "Display a status indicator badge. Use variants: 'success' for positive states (completed, healthy, active), 'warning' for caution states (pending, at_risk, medium priority), 'error' for negative states (failed, critical, overdue), 'info' for informational states, 'default' for neutral states.",
    component: StatusBadge,
    propsSchema: statusBadgeSchema,
  },
  {
    name: "Timeline",
    description:
      "Display a chronological list of events or activities. Use this for showing history, audit logs, deployment history, or any time-based sequence. Each event has a title, optional description, timestamp, status (completed, current, pending, error), and optional actor.",
    component: Timeline,
    propsSchema: timelineSchema,
  },
];

/**
 * Get tools filtered by template type
 */
export function getToolsForTemplate(templateId: string): TamboTool[] {
  const toolsByTemplate: Record<string, string[]> = {
    "sales-analytics": ["getSalesData", "getProducts", "getUserData", "getKPIs"],
    "support-ops": ["getTickets", "getTicketById", "getTicketStats", "createTicket", "updateTicket", "assignTicket"],
    "engineering-ops": ["getIncidents", "getDeployments", "getSystemHealth"],
    "inventory-manager": ["getInventory", "getInventoryStats", "updateStock"],
    "customer-success": ["getCustomers", "getCustomerById", "getCustomerStats"],
  };
  
  const toolNames = toolsByTemplate[templateId] || [];
  return tools.filter((t) => toolNames.includes(t.name));
}

/**
 * Get components filtered by template type
 */
export function getComponentsForTemplate(templateId: string): TamboComponent[] {
  const componentsByTemplate: Record<string, string[]> = {
    "sales-analytics": ["Graph", "KPICard", "DataTable", "SelectForm"],
    "support-ops": ["DataTable", "StatusBadge", "Timeline", "SelectForm", "KPICard"],
    "engineering-ops": ["Graph", "KPICard", "DataTable", "StatusBadge", "Timeline"],
    "inventory-manager": ["DataTable", "KPICard", "Graph", "StatusBadge", "SelectForm"],
    "customer-success": ["DataTable", "KPICard", "Graph", "Timeline", "StatusBadge"],
  };
  
  const componentNames = componentsByTemplate[templateId] || [];
  return components.filter((c) => componentNames.includes(c.name));
}
