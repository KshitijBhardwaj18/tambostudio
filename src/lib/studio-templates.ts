/**
 * @file studio-templates.ts
 * @description Template definitions for Tambo Studio app types
 */

export interface StudioComponent {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tools: string[];
}

export interface StudioTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
  components: StudioComponent[];
  mcpServers: McpServer[];
  keywords: string[];
}

export const STUDIO_COMPONENTS: StudioComponent[] = [
  { id: "graph", name: "Graph", description: "Bar, line, and pie charts for data visualization", enabled: true },
  { id: "kpi-card", name: "KPI Card", description: "Key performance indicator display cards", enabled: true },
  { id: "data-table", name: "Data Table", description: "Sortable, filterable data tables", enabled: true },
  { id: "detail-panel", name: "Detail Panel", description: "Expandable detail views for records", enabled: true },
  { id: "action-buttons", name: "Action Buttons", description: "Contextual action button groups", enabled: true },
  { id: "form-builder", name: "Form Builder", description: "Dynamic form generation", enabled: true },
  { id: "select-form", name: "Select Form", description: "Multi-select and single-select forms", enabled: true },
  { id: "status-badge", name: "Status Badge", description: "Status indicators and badges", enabled: true },
  { id: "timeline", name: "Timeline", description: "Activity and event timelines", enabled: true },
  { id: "metric-trend", name: "Metric Trend", description: "Trend indicators with sparklines", enabled: true },
];

export const MCP_SERVERS: McpServer[] = [
  { 
    id: "ticketing", 
    name: "Ticketing", 
    description: "Create, update, and manage support tickets",
    enabled: false,
    tools: ["createTicket", "updateTicket", "assignTicket", "closeTicket", "getTicketHistory"]
  },
  { 
    id: "analytics", 
    name: "Analytics", 
    description: "Query metrics, KPIs, and business data",
    enabled: false,
    tools: ["getSalesData", "getProducts", "getUserData", "getKPIs", "getMetrics"]
  },
  { 
    id: "crm", 
    name: "CRM", 
    description: "Customer relationship management operations",
    enabled: false,
    tools: ["getCustomer", "updateCustomer", "getDeals", "createDeal", "getContacts"]
  },
  { 
    id: "knowledge-base", 
    name: "Knowledge Base", 
    description: "Search and retrieve documentation",
    enabled: false,
    tools: ["searchDocs", "getArticle", "suggestArticles", "createArticle"]
  },
  { 
    id: "notifications", 
    name: "Notifications", 
    description: "Send alerts and notifications",
    enabled: false,
    tools: ["sendEmail", "sendSlack", "createAlert", "scheduleReminder"]
  },
  { 
    id: "inventory", 
    name: "Inventory", 
    description: "Track and manage inventory levels",
    enabled: false,
    tools: ["getStock", "updateStock", "createOrder", "getSuppliers"]
  },
];

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: "sales-analytics",
    name: "Sales Analytics",
    description: "AI-powered sales dashboard with revenue tracking, forecasting, and team performance",
    icon: "📊",
    keywords: ["sales", "revenue", "analytics", "dashboard", "forecast", "performance", "metrics", "kpi"],
    systemPrompt: `You are an AI sales analytics assistant. Help users understand their sales data, identify trends, and make data-driven decisions.

Key capabilities:
- Visualize sales data with charts and graphs
- Track KPIs like revenue, conversion rates, and deal velocity
- Compare performance across regions, products, and time periods
- Provide actionable insights and recommendations

Always present data visually when possible. Use graphs for trends, KPI cards for key metrics, and tables for detailed breakdowns.`,
    components: [
      { id: "graph", name: "Graph", description: "Sales charts and visualizations", enabled: true },
      { id: "kpi-card", name: "KPI Card", description: "Revenue and performance metrics", enabled: true },
      { id: "data-table", name: "Data Table", description: "Sales data tables", enabled: true },
      { id: "metric-trend", name: "Metric Trend", description: "Trend indicators", enabled: true },
      { id: "select-form", name: "Select Form", description: "Filter options", enabled: true },
    ],
    mcpServers: [
      { ...MCP_SERVERS[1], enabled: true }, // Analytics
      { ...MCP_SERVERS[2], enabled: true }, // CRM
    ],
  },
  {
    id: "support-ops",
    name: "Support Operations",
    description: "AI support ticket management with routing, prioritization, and resolution tracking",
    icon: "🎫",
    keywords: ["support", "ticket", "helpdesk", "customer", "service", "issue", "bug", "request"],
    systemPrompt: `You are an AI support operations assistant. Help manage support tickets efficiently and improve customer satisfaction.

Key capabilities:
- View and manage support tickets
- Assign tickets to team members
- Track resolution times and SLAs
- Suggest knowledge base articles for common issues
- Analyze support trends and bottlenecks

Prioritize urgent tickets and help identify patterns in support requests.`,
    components: [
      { id: "data-table", name: "Data Table", description: "Ticket list view", enabled: true },
      { id: "detail-panel", name: "Detail Panel", description: "Ticket details", enabled: true },
      { id: "action-buttons", name: "Action Buttons", description: "Ticket actions", enabled: true },
      { id: "status-badge", name: "Status Badge", description: "Ticket status", enabled: true },
      { id: "timeline", name: "Timeline", description: "Ticket history", enabled: true },
      { id: "select-form", name: "Select Form", description: "Assignment options", enabled: true },
    ],
    mcpServers: [
      { ...MCP_SERVERS[0], enabled: true }, // Ticketing
      { ...MCP_SERVERS[3], enabled: true }, // Knowledge Base
      { ...MCP_SERVERS[4], enabled: true }, // Notifications
    ],
  },
  {
    id: "engineering-ops",
    name: "Engineering Ops",
    description: "AI engineering dashboard for incident management, deployments, and system health",
    icon: "⚙️",
    keywords: ["engineering", "devops", "incident", "deploy", "system", "infrastructure", "monitoring", "ops"],
    systemPrompt: `You are an AI engineering operations assistant. Help teams manage incidents, track deployments, and maintain system health.

Key capabilities:
- Monitor system health and alerts
- Track and manage incidents
- View deployment history and status
- Analyze error patterns and trends
- Coordinate incident response

Focus on reducing MTTR and improving system reliability.`,
    components: [
      { id: "graph", name: "Graph", description: "System metrics charts", enabled: true },
      { id: "kpi-card", name: "KPI Card", description: "Health indicators", enabled: true },
      { id: "data-table", name: "Data Table", description: "Incident list", enabled: true },
      { id: "status-badge", name: "Status Badge", description: "System status", enabled: true },
      { id: "timeline", name: "Timeline", description: "Deployment history", enabled: true },
      { id: "action-buttons", name: "Action Buttons", description: "Quick actions", enabled: true },
    ],
    mcpServers: [
      { ...MCP_SERVERS[0], enabled: true }, // Ticketing (for incidents)
      { ...MCP_SERVERS[1], enabled: true }, // Analytics
      { ...MCP_SERVERS[4], enabled: true }, // Notifications
    ],
  },
  {
    id: "inventory-manager",
    name: "Inventory Manager",
    description: "AI inventory tracking with stock levels, reorder alerts, and supplier management",
    icon: "📦",
    keywords: ["inventory", "stock", "warehouse", "supply", "order", "product", "sku"],
    systemPrompt: `You are an AI inventory management assistant. Help track stock levels, manage orders, and optimize inventory.

Key capabilities:
- Monitor stock levels across locations
- Generate reorder alerts
- Track supplier performance
- Analyze inventory turnover
- Forecast demand

Help prevent stockouts while minimizing excess inventory.`,
    components: [
      { id: "data-table", name: "Data Table", description: "Inventory list", enabled: true },
      { id: "kpi-card", name: "KPI Card", description: "Stock metrics", enabled: true },
      { id: "graph", name: "Graph", description: "Inventory trends", enabled: true },
      { id: "status-badge", name: "Status Badge", description: "Stock status", enabled: true },
      { id: "form-builder", name: "Form Builder", description: "Order forms", enabled: true },
      { id: "action-buttons", name: "Action Buttons", description: "Quick actions", enabled: true },
    ],
    mcpServers: [
      { ...MCP_SERVERS[5], enabled: true }, // Inventory
      { ...MCP_SERVERS[1], enabled: true }, // Analytics
      { ...MCP_SERVERS[4], enabled: true }, // Notifications
    ],
  },
  {
    id: "customer-success",
    name: "Customer Success",
    description: "AI customer health monitoring with engagement tracking and churn prediction",
    icon: "💚",
    keywords: ["customer", "success", "health", "churn", "engagement", "retention", "nps", "satisfaction"],
    systemPrompt: `You are an AI customer success assistant. Help monitor customer health and drive retention.

Key capabilities:
- Track customer health scores
- Monitor engagement metrics
- Identify at-risk accounts
- Manage customer touchpoints
- Analyze NPS and satisfaction trends

Proactively identify opportunities to improve customer outcomes.`,
    components: [
      { id: "data-table", name: "Data Table", description: "Customer list", enabled: true },
      { id: "kpi-card", name: "KPI Card", description: "Health metrics", enabled: true },
      { id: "graph", name: "Graph", description: "Engagement trends", enabled: true },
      { id: "detail-panel", name: "Detail Panel", description: "Customer details", enabled: true },
      { id: "timeline", name: "Timeline", description: "Interaction history", enabled: true },
      { id: "metric-trend", name: "Metric Trend", description: "Health trends", enabled: true },
    ],
    mcpServers: [
      { ...MCP_SERVERS[2], enabled: true }, // CRM
      { ...MCP_SERVERS[1], enabled: true }, // Analytics
      { ...MCP_SERVERS[4], enabled: true }, // Notifications
    ],
  },
];

// Simple keyword matching for template selection
export function matchTemplate(input: string): StudioTemplate {
  const normalizedInput = input.toLowerCase();
  
  let bestMatch = STUDIO_TEMPLATES[0];
  let bestScore = 0;
  
  for (const template of STUDIO_TEMPLATES) {
    let score = 0;
    for (const keyword of template.keywords) {
      if (normalizedInput.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  }
  
  return bestMatch;
}

// Generate config JSON for display
export function generateConfig(template: StudioTemplate): object {
  return {
    template: template.id,
    name: template.name,
    components: template.components
      .filter(c => c.enabled)
      .map(c => c.name),
    mcpServers: template.mcpServers
      .filter(s => s.enabled)
      .map(s => ({
        name: s.name,
        tools: s.tools,
      })),
    systemPrompt: template.systemPrompt.substring(0, 100) + "...",
  };
}
