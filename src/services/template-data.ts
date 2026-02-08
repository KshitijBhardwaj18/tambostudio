/**
 * @file template-data.ts
 * @description Mock data services for all Tambo Studio templates
 */

// ============================================
// SUPPORT OPERATIONS DATA
// ============================================

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignee: string | null;
  customer: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

const ticketsData: Ticket[] = [
  { id: "TKT-1234", title: "Cannot login to dashboard", description: "User reports 403 error when accessing dashboard", priority: "high", status: "open", assignee: "Sarah Chen", customer: "Acme Corp", createdAt: "2024-01-15T10:30:00Z", updatedAt: "2024-01-15T14:20:00Z", category: "Authentication" },
  { id: "TKT-1235", title: "Payment processing failed", description: "Credit card transactions timing out", priority: "critical", status: "in_progress", assignee: "Mike Johnson", customer: "TechStart Inc", createdAt: "2024-01-15T09:15:00Z", updatedAt: "2024-01-15T15:45:00Z", category: "Billing" },
  { id: "TKT-1236", title: "Feature request: Dark mode", description: "Customer requesting dark mode option", priority: "low", status: "open", assignee: null, customer: "Global Ltd", createdAt: "2024-01-14T16:00:00Z", updatedAt: "2024-01-14T16:00:00Z", category: "Feature Request" },
  { id: "TKT-1237", title: "Data export not working", description: "CSV export returns empty file", priority: "medium", status: "in_progress", assignee: "Emily Davis", customer: "DataFlow Inc", createdAt: "2024-01-15T11:00:00Z", updatedAt: "2024-01-15T13:30:00Z", category: "Data" },
  { id: "TKT-1238", title: "API rate limiting issues", description: "Getting 429 errors on API calls", priority: "high", status: "open", assignee: "Sarah Chen", customer: "DevTools Co", createdAt: "2024-01-15T08:45:00Z", updatedAt: "2024-01-15T12:00:00Z", category: "API" },
  { id: "TKT-1239", title: "Mobile app crash on iOS", description: "App crashes when opening settings", priority: "critical", status: "resolved", assignee: "Mike Johnson", customer: "MobileFirst", createdAt: "2024-01-14T14:30:00Z", updatedAt: "2024-01-15T10:00:00Z", category: "Mobile" },
  { id: "TKT-1240", title: "Slow dashboard loading", description: "Dashboard takes 10+ seconds to load", priority: "medium", status: "open", assignee: null, customer: "SpeedTest LLC", createdAt: "2024-01-15T07:00:00Z", updatedAt: "2024-01-15T07:00:00Z", category: "Performance" },
];

export const getTickets = async (params?: { status?: string; priority?: string; assignee?: string }): Promise<Ticket[]> => {
  await new Promise((r) => setTimeout(r, 100));
  let data = [...ticketsData];
  if (params?.status) data = data.filter((t) => t.status === params.status);
  if (params?.priority) data = data.filter((t) => t.priority === params.priority);
  if (params?.assignee) data = data.filter((t) => t.assignee?.toLowerCase().includes(params.assignee!.toLowerCase()));
  return data;
};

export const getTicketById = async (id: string): Promise<Ticket | null> => {
  await new Promise((r) => setTimeout(r, 50));
  return ticketsData.find((t) => t.id === id) || null;
};

export const getTicketStats = async (): Promise<{ open: number; inProgress: number; resolved: number; avgResponseTime: string }> => {
  await new Promise((r) => setTimeout(r, 50));
  return {
    open: ticketsData.filter((t) => t.status === "open").length,
    inProgress: ticketsData.filter((t) => t.status === "in_progress").length,
    resolved: ticketsData.filter((t) => t.status === "resolved" || t.status === "closed").length,
    avgResponseTime: "2.4 hours",
  };
};

export const createTicket = async (ticket: Partial<Ticket>): Promise<Ticket> => {
  await new Promise((r) => setTimeout(r, 100));
  const newTicket: Ticket = {
    id: `TKT-${1241 + ticketsData.length}`,
    title: ticket.title || "New Ticket",
    description: ticket.description || "",
    priority: ticket.priority || "medium",
    status: "open",
    assignee: ticket.assignee || null,
    customer: ticket.customer || "Unknown",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: ticket.category || "General",
  };
  ticketsData.push(newTicket);
  return newTicket;
};

export const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<Ticket | null> => {
  await new Promise((r) => setTimeout(r, 100));
  const index = ticketsData.findIndex((t) => t.id === id);
  if (index === -1) return null;
  ticketsData[index] = { ...ticketsData[index], ...updates, updatedAt: new Date().toISOString() };
  return ticketsData[index];
};

export const assignTicket = async (id: string, assignee: string): Promise<Ticket | null> => {
  return updateTicket(id, { assignee, status: "in_progress" });
};

// ============================================
// ENGINEERING OPS DATA
// ============================================

export interface Incident {
  id: string;
  title: string;
  severity: "P1" | "P2" | "P3" | "P4";
  status: "investigating" | "identified" | "monitoring" | "resolved";
  service: string;
  startedAt: string;
  resolvedAt: string | null;
  assignee: string;
  description: string;
}

const incidentsData: Incident[] = [
  { id: "INC-001", title: "API Latency Spike", severity: "P1", status: "investigating", service: "api-gateway", startedAt: "2024-01-15T14:30:00Z", resolvedAt: null, assignee: "On-call Team", description: "Response times increased to 2s+" },
  { id: "INC-002", title: "Database Connection Pool Exhausted", severity: "P2", status: "monitoring", service: "postgres-primary", startedAt: "2024-01-15T12:00:00Z", resolvedAt: null, assignee: "DB Team", description: "Connection pool at 95% capacity" },
  { id: "INC-003", title: "Cache Miss Rate Elevated", severity: "P3", status: "resolved", service: "redis-cluster", startedAt: "2024-01-15T10:00:00Z", resolvedAt: "2024-01-15T11:30:00Z", assignee: "Platform Team", description: "Cache hit rate dropped to 60%" },
  { id: "INC-004", title: "SSL Certificate Expiring", severity: "P4", status: "identified", service: "cdn", startedAt: "2024-01-15T09:00:00Z", resolvedAt: null, assignee: "Security Team", description: "Certificate expires in 7 days" },
];

export interface Deployment {
  id: string;
  service: string;
  version: string;
  environment: "production" | "staging" | "development";
  status: "success" | "failed" | "in_progress" | "rolled_back";
  deployedAt: string;
  deployedBy: string;
}

const deploymentsData: Deployment[] = [
  { id: "DEP-101", service: "api-gateway", version: "v2.4.1", environment: "production", status: "success", deployedAt: "2024-01-15T14:00:00Z", deployedBy: "CI/CD Pipeline" },
  { id: "DEP-100", service: "web-frontend", version: "v3.1.0", environment: "production", status: "success", deployedAt: "2024-01-15T12:30:00Z", deployedBy: "Sarah Chen" },
  { id: "DEP-099", service: "auth-service", version: "v1.8.2", environment: "staging", status: "in_progress", deployedAt: "2024-01-15T15:00:00Z", deployedBy: "Mike Johnson" },
  { id: "DEP-098", service: "payment-service", version: "v2.0.0", environment: "production", status: "rolled_back", deployedAt: "2024-01-15T10:00:00Z", deployedBy: "CI/CD Pipeline" },
];

export const getIncidents = async (params?: { severity?: string; status?: string }): Promise<Incident[]> => {
  await new Promise((r) => setTimeout(r, 100));
  let data = [...incidentsData];
  if (params?.severity) data = data.filter((i) => i.severity === params.severity);
  if (params?.status) data = data.filter((i) => i.status === params.status);
  return data;
};

export const getDeployments = async (params?: { environment?: string; status?: string }): Promise<Deployment[]> => {
  await new Promise((r) => setTimeout(r, 100));
  let data = [...deploymentsData];
  if (params?.environment) data = data.filter((d) => d.environment === params.environment);
  if (params?.status) data = data.filter((d) => d.status === params.status);
  return data;
};

export const getSystemHealth = async (): Promise<{ uptime: string; errorRate: string; latency: string; activeIncidents: number }> => {
  await new Promise((r) => setTimeout(r, 50));
  return {
    uptime: "99.95%",
    errorRate: "0.12%",
    latency: "145ms",
    activeIncidents: incidentsData.filter((i) => i.status !== "resolved").length,
  };
};

// ============================================
// INVENTORY MANAGER DATA
// ============================================

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastRestocked: string;
}

const inventoryData: InventoryItem[] = [
  { id: "INV-001", sku: "WM-001", name: "Wireless Mouse", category: "Electronics", quantity: 12, reorderLevel: 25, unitPrice: 29.99, supplier: "TechSupply Co", location: "Warehouse A", lastRestocked: "2024-01-10" },
  { id: "INV-002", sku: "KB-015", name: "Mechanical Keyboard", category: "Electronics", quantity: 38, reorderLevel: 20, unitPrice: 89.99, supplier: "TechSupply Co", location: "Warehouse A", lastRestocked: "2024-01-12" },
  { id: "INV-003", sku: "UC-042", name: "USB-C Cable 2m", category: "Accessories", quantity: 245, reorderLevel: 100, unitPrice: 12.99, supplier: "CableMaster", location: "Warehouse B", lastRestocked: "2024-01-14" },
  { id: "INV-004", sku: "HD-008", name: "27\" Monitor", category: "Electronics", quantity: 8, reorderLevel: 15, unitPrice: 349.99, supplier: "DisplayTech", location: "Warehouse A", lastRestocked: "2024-01-08" },
  { id: "INV-005", sku: "CH-022", name: "Office Chair", category: "Furniture", quantity: 45, reorderLevel: 20, unitPrice: 199.99, supplier: "OfficePro", location: "Warehouse C", lastRestocked: "2024-01-11" },
  { id: "INV-006", sku: "DS-003", name: "Standing Desk", category: "Furniture", quantity: 15, reorderLevel: 10, unitPrice: 449.99, supplier: "OfficePro", location: "Warehouse C", lastRestocked: "2024-01-09" },
  { id: "INV-007", sku: "HP-011", name: "Wireless Headphones", category: "Electronics", quantity: 5, reorderLevel: 30, unitPrice: 149.99, supplier: "AudioMax", location: "Warehouse A", lastRestocked: "2024-01-05" },
];

export const getInventory = async (params?: { category?: string; lowStock?: boolean }): Promise<InventoryItem[]> => {
  await new Promise((r) => setTimeout(r, 100));
  let data = [...inventoryData];
  if (params?.category) data = data.filter((i) => i.category.toLowerCase() === params.category!.toLowerCase());
  if (params?.lowStock) data = data.filter((i) => i.quantity <= i.reorderLevel);
  return data;
};

export const getInventoryStats = async (): Promise<{ totalSKUs: number; lowStock: number; totalValue: number; categories: number }> => {
  await new Promise((r) => setTimeout(r, 50));
  return {
    totalSKUs: inventoryData.length,
    lowStock: inventoryData.filter((i) => i.quantity <= i.reorderLevel).length,
    totalValue: inventoryData.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
    categories: new Set(inventoryData.map((i) => i.category)).size,
  };
};

export const updateStock = async (sku: string, quantity: number): Promise<InventoryItem | null> => {
  await new Promise((r) => setTimeout(r, 100));
  const item = inventoryData.find((i) => i.sku === sku);
  if (!item) return null;
  item.quantity = quantity;
  item.lastRestocked = new Date().toISOString().split("T")[0];
  return item;
};

// ============================================
// CUSTOMER SUCCESS DATA
// ============================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  healthScore: number;
  mrr: number;
  plan: "starter" | "professional" | "enterprise";
  status: "healthy" | "at_risk" | "churned";
  lastContact: string;
  npsScore: number | null;
  accountManager: string;
}

const customersData: Customer[] = [
  { id: "CUS-001", name: "John Smith", email: "john@acmecorp.com", company: "Acme Corp", healthScore: 92, mrr: 12000, plan: "enterprise", status: "healthy", lastContact: "2024-01-14", npsScore: 9, accountManager: "Lisa Wong" },
  { id: "CUS-002", name: "Sarah Johnson", email: "sarah@techstart.io", company: "TechStart Inc", healthScore: 45, mrr: 8500, plan: "professional", status: "at_risk", lastContact: "2024-01-02", npsScore: 5, accountManager: "Lisa Wong" },
  { id: "CUS-003", name: "Michael Brown", email: "michael@globalltd.com", company: "Global Ltd", healthScore: 78, mrr: 15000, plan: "enterprise", status: "healthy", lastContact: "2024-01-12", npsScore: 8, accountManager: "Tom Harris" },
  { id: "CUS-004", name: "Emily Davis", email: "emily@dataflow.co", company: "DataFlow Inc", healthScore: 88, mrr: 5500, plan: "professional", status: "healthy", lastContact: "2024-01-15", npsScore: 9, accountManager: "Tom Harris" },
  { id: "CUS-005", name: "David Wilson", email: "david@speedtest.io", company: "SpeedTest LLC", healthScore: 32, mrr: 3200, plan: "starter", status: "at_risk", lastContact: "2023-12-20", npsScore: 3, accountManager: "Lisa Wong" },
  { id: "CUS-006", name: "Jennifer Lee", email: "jennifer@mobilefirst.app", company: "MobileFirst", healthScore: 95, mrr: 22000, plan: "enterprise", status: "healthy", lastContact: "2024-01-15", npsScore: 10, accountManager: "Tom Harris" },
];

export const getCustomers = async (params?: { status?: string; plan?: string }): Promise<Customer[]> => {
  await new Promise((r) => setTimeout(r, 100));
  let data = [...customersData];
  if (params?.status) data = data.filter((c) => c.status === params.status);
  if (params?.plan) data = data.filter((c) => c.plan === params.plan);
  return data;
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  await new Promise((r) => setTimeout(r, 50));
  return customersData.find((c) => c.id === id) || null;
};

export const getCustomerStats = async (): Promise<{ totalCustomers: number; atRisk: number; avgHealthScore: number; totalMRR: number; avgNPS: number }> => {
  await new Promise((r) => setTimeout(r, 50));
  const withNPS = customersData.filter((c) => c.npsScore !== null);
  return {
    totalCustomers: customersData.length,
    atRisk: customersData.filter((c) => c.status === "at_risk").length,
    avgHealthScore: Math.round(customersData.reduce((sum, c) => sum + c.healthScore, 0) / customersData.length),
    totalMRR: customersData.reduce((sum, c) => sum + c.mrr, 0),
    avgNPS: Math.round(withNPS.reduce((sum, c) => sum + (c.npsScore || 0), 0) / withNPS.length * 10) / 10,
  };
};

export const updateCustomerHealth = async (id: string, healthScore: number): Promise<Customer | null> => {
  await new Promise((r) => setTimeout(r, 100));
  const customer = customersData.find((c) => c.id === id);
  if (!customer) return null;
  customer.healthScore = healthScore;
  customer.status = healthScore >= 70 ? "healthy" : "at_risk";
  return customer;
};
