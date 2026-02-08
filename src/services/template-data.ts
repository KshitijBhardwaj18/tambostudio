/**
 * @file template-data.ts
 * @description Mock data services for each template type
 */

// ============================================
// SUPPORT OPS DATA
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
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-1234",
    title: "Cannot login to dashboard",
    description: "User reports 500 error when attempting to login",
    priority: "high",
    status: "open",
    assignee: "Sarah Chen",
    customer: "Acme Corp",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "TKT-1235",
    title: "Payment processing failed",
    description: "Credit card transactions timing out",
    priority: "critical",
    status: "in_progress",
    assignee: "Mike Johnson",
    customer: "TechStart Inc",
    createdAt: "2024-01-15T09:15:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "TKT-1236",
    title: "Feature request: Dark mode",
    description: "Customer requesting dark mode option",
    priority: "low",
    status: "open",
    assignee: null,
    customer: "Global Ltd",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "TKT-1237",
    title: "Export not working",
    description: "CSV export produces empty file",
    priority: "medium",
    status: "resolved",
    assignee: "Sarah Chen",
    customer: "DataFlow Inc",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "TKT-1238",
    title: "API rate limiting issues",
    description: "Getting 429 errors on bulk operations",
    priority: "high",
    status: "in_progress",
    assignee: "Alex Rivera",
    customer: "CloudSync",
    createdAt: "2024-01-15T07:00:00Z",
    updatedAt: "2024-01-15T10:45:00Z",
  },
];

export function getTickets(filters?: { status?: string; priority?: string }): Ticket[] {
  let result = [...mockTickets];
  if (filters?.status) {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters?.priority) {
    result = result.filter((t) => t.priority === filters.priority);
  }
  return result;
}

export function getTicketById(id: string): Ticket | undefined {
  return mockTickets.find((t) => t.id === id);
}

export function createTicket(data: Partial<Ticket>): Ticket {
  const newTicket: Ticket = {
    id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
    title: data.title || "New Ticket",
    description: data.description || "",
    priority: data.priority || "medium",
    status: "open",
    assignee: data.assignee || null,
    customer: data.customer || "Unknown",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTickets.push(newTicket);
  return newTicket;
}

export function updateTicket(id: string, updates: Partial<Ticket>): Ticket | undefined {
  const ticket = mockTickets.find((t) => t.id === id);
  if (ticket) {
    Object.assign(ticket, updates, { updatedAt: new Date().toISOString() });
  }
  return ticket;
}

export function getTicketStats() {
  return {
    total: mockTickets.length,
    open: mockTickets.filter((t) => t.status === "open").length,
    inProgress: mockTickets.filter((t) => t.status === "in_progress").length,
    resolved: mockTickets.filter((t) => t.status === "resolved").length,
    avgResponseTime: "2.4 hours",
    satisfactionScore: 4.2,
  };
}

// ============================================
// ENGINEERING OPS DATA
// ============================================

export interface Incident {
  id: string;
  title: string;
  severity: "P1" | "P2" | "P3" | "P4";
  status: "investigating" | "identified" | "monitoring" | "resolved";
  service: string;
  description: string;
  startedAt: string;
  resolvedAt: string | null;
  assignee: string;
}

const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "API Latency Spike",
    severity: "P1",
    status: "investigating",
    service: "api-gateway",
    description: "Response times increased to 2s+ for all endpoints",
    startedAt: "2024-01-15T10:00:00Z",
    resolvedAt: null,
    assignee: "On-call Team",
  },
  {
    id: "INC-002",
    title: "Database Connection Pool Exhaustion",
    severity: "P2",
    status: "monitoring",
    service: "postgres-primary",
    description: "Connection pool reaching 90% capacity",
    startedAt: "2024-01-15T08:30:00Z",
    resolvedAt: null,
    assignee: "Database Team",
  },
  {
    id: "INC-003",
    title: "Cache Miss Rate Elevated",
    severity: "P3",
    status: "resolved",
    service: "redis-cluster",
    description: "Cache hit rate dropped to 60%",
    startedAt: "2024-01-14T22:00:00Z",
    resolvedAt: "2024-01-15T02:30:00Z",
    assignee: "Platform Team",
  },
];

export interface Deployment {
  id: string;
  service: string;
  version: string;
  environment: "production" | "staging" | "development";
  status: "success" | "failed" | "in_progress" | "rolled_back";
  deployedBy: string;
  deployedAt: string;
  duration: string;
}

const mockDeployments: Deployment[] = [
  {
    id: "DEP-101",
    service: "web-frontend",
    version: "v2.4.1",
    environment: "production",
    status: "success",
    deployedBy: "CI/CD Pipeline",
    deployedAt: "2024-01-15T09:00:00Z",
    duration: "3m 24s",
  },
  {
    id: "DEP-102",
    service: "api-service",
    version: "v1.12.0",
    environment: "production",
    status: "success",
    deployedBy: "John Smith",
    deployedAt: "2024-01-15T08:30:00Z",
    duration: "5m 12s",
  },
  {
    id: "DEP-103",
    service: "worker-service",
    version: "v3.0.0",
    environment: "staging",
    status: "in_progress",
    deployedBy: "CI/CD Pipeline",
    deployedAt: "2024-01-15T10:45:00Z",
    duration: "2m 10s",
  },
  {
    id: "DEP-104",
    service: "auth-service",
    version: "v2.1.0",
    environment: "production",
    status: "rolled_back",
    deployedBy: "Jane Doe",
    deployedAt: "2024-01-14T16:00:00Z",
    duration: "4m 30s",
  },
];

export function getIncidents(filters?: { status?: string; severity?: string }): Incident[] {
  let result = [...mockIncidents];
  if (filters?.status) {
    result = result.filter((i) => i.status === filters.status);
  }
  if (filters?.severity) {
    result = result.filter((i) => i.severity === filters.severity);
  }
  return result;
}

export function getDeployments(filters?: { environment?: string; status?: string }): Deployment[] {
  let result = [...mockDeployments];
  if (filters?.environment) {
    result = result.filter((d) => d.environment === filters.environment);
  }
  if (filters?.status) {
    result = result.filter((d) => d.status === filters.status);
  }
  return result;
}

export function getSystemHealth() {
  return {
    overall: "degraded",
    uptime: "99.94%",
    services: [
      { name: "api-gateway", status: "degraded", latency: "1.2s" },
      { name: "web-frontend", status: "healthy", latency: "120ms" },
      { name: "postgres-primary", status: "warning", latency: "45ms" },
      { name: "redis-cluster", status: "healthy", latency: "2ms" },
      { name: "worker-service", status: "healthy", latency: "N/A" },
    ],
    activeIncidents: mockIncidents.filter((i) => i.status !== "resolved").length,
    deploymentsToday: mockDeployments.filter((d) => 
      d.deployedAt.startsWith("2024-01-15")
    ).length,
  };
}

// ============================================
// INVENTORY MANAGER DATA
// ============================================

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: "INV-001",
    sku: "WM-001",
    name: "Wireless Mouse",
    category: "Electronics",
    quantity: 12,
    reorderPoint: 25,
    unitPrice: 29.99,
    supplier: "TechSupply Co",
    lastRestocked: "2024-01-10",
  },
  {
    id: "INV-002",
    sku: "UC-042",
    name: "USB-C Cable 2m",
    category: "Electronics",
    quantity: 245,
    reorderPoint: 50,
    unitPrice: 12.99,
    supplier: "CableWorld",
    lastRestocked: "2024-01-14",
  },
  {
    id: "INV-003",
    sku: "KB-015",
    name: "Mechanical Keyboard",
    category: "Electronics",
    quantity: 38,
    reorderPoint: 30,
    unitPrice: 89.99,
    supplier: "TechSupply Co",
    lastRestocked: "2024-01-08",
  },
  {
    id: "INV-004",
    sku: "HD-008",
    name: "Wireless Headphones",
    category: "Electronics",
    quantity: 5,
    reorderPoint: 20,
    unitPrice: 149.99,
    supplier: "AudioMax",
    lastRestocked: "2024-01-05",
  },
  {
    id: "INV-005",
    sku: "MN-022",
    name: "27\" Monitor",
    category: "Electronics",
    quantity: 18,
    reorderPoint: 15,
    unitPrice: 299.99,
    supplier: "DisplayTech",
    lastRestocked: "2024-01-12",
  },
  {
    id: "INV-006",
    sku: "CH-101",
    name: "Office Chair",
    category: "Furniture",
    quantity: 8,
    reorderPoint: 10,
    unitPrice: 199.99,
    supplier: "OfficePro",
    lastRestocked: "2024-01-03",
  },
];

export function getInventory(filters?: { category?: string; lowStock?: boolean }): InventoryItem[] {
  let result = [...mockInventory];
  if (filters?.category) {
    result = result.filter((i) => i.category === filters.category);
  }
  if (filters?.lowStock) {
    result = result.filter((i) => i.quantity <= i.reorderPoint);
  }
  return result;
}

export function getInventoryById(id: string): InventoryItem | undefined {
  return mockInventory.find((i) => i.id === id);
}

export function updateStock(id: string, quantity: number): InventoryItem | undefined {
  const item = mockInventory.find((i) => i.id === id);
  if (item) {
    item.quantity = quantity;
    item.lastRestocked = new Date().toISOString().split("T")[0];
  }
  return item;
}

export function getInventoryStats() {
  const lowStockItems = mockInventory.filter((i) => i.quantity <= i.reorderPoint);
  const totalValue = mockInventory.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  
  return {
    totalSKUs: mockInventory.length,
    totalItems: mockInventory.reduce((sum, i) => sum + i.quantity, 0),
    lowStockCount: lowStockItems.length,
    criticalStockCount: mockInventory.filter((i) => i.quantity <= i.reorderPoint * 0.5).length,
    totalValue: totalValue.toFixed(2),
    categories: [...new Set(mockInventory.map((i) => i.category))],
  };
}

// ============================================
// CUSTOMER SUCCESS DATA
// ============================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "professional" | "enterprise";
  mrr: number;
  healthScore: number;
  npsScore: number | null;
  lastContact: string;
  csm: string;
  status: "healthy" | "at_risk" | "churned";
  contractEnd: string;
}

const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Acme Corporation",
    email: "contact@acme.com",
    plan: "enterprise",
    mrr: 12000,
    healthScore: 92,
    npsScore: 9,
    lastContact: "2024-01-14",
    csm: "Emily Watson",
    status: "healthy",
    contractEnd: "2024-12-31",
  },
  {
    id: "CUST-002",
    name: "TechStart Inc",
    email: "hello@techstart.io",
    plan: "professional",
    mrr: 8500,
    healthScore: 45,
    npsScore: 5,
    lastContact: "2024-01-01",
    csm: "Emily Watson",
    status: "at_risk",
    contractEnd: "2024-06-30",
  },
  {
    id: "CUST-003",
    name: "Global Solutions Ltd",
    email: "support@globalsol.com",
    plan: "enterprise",
    mrr: 15000,
    healthScore: 78,
    npsScore: 8,
    lastContact: "2024-01-10",
    csm: "Marcus Chen",
    status: "healthy",
    contractEnd: "2025-03-31",
  },
  {
    id: "CUST-004",
    name: "DataFlow Analytics",
    email: "team@dataflow.co",
    plan: "professional",
    mrr: 5000,
    healthScore: 35,
    npsScore: 4,
    lastContact: "2023-12-15",
    csm: "Marcus Chen",
    status: "at_risk",
    contractEnd: "2024-04-30",
  },
  {
    id: "CUST-005",
    name: "CloudSync Systems",
    email: "info@cloudsync.io",
    plan: "starter",
    mrr: 2500,
    healthScore: 88,
    npsScore: 10,
    lastContact: "2024-01-13",
    csm: "Sarah Kim",
    status: "healthy",
    contractEnd: "2024-08-31",
  },
  {
    id: "CUST-006",
    name: "InnovateTech",
    email: "contact@innovatetech.com",
    plan: "enterprise",
    mrr: 20000,
    healthScore: 95,
    npsScore: 10,
    lastContact: "2024-01-15",
    csm: "Sarah Kim",
    status: "healthy",
    contractEnd: "2025-06-30",
  },
];

export function getCustomers(filters?: { status?: string; plan?: string }): Customer[] {
  let result = [...mockCustomers];
  if (filters?.status) {
    result = result.filter((c) => c.status === filters.status);
  }
  if (filters?.plan) {
    result = result.filter((c) => c.plan === filters.plan);
  }
  return result;
}

export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find((c) => c.id === id);
}

export function getCustomerStats() {
  const totalMRR = mockCustomers.reduce((sum, c) => sum + c.mrr, 0);
  const avgHealthScore = mockCustomers.reduce((sum, c) => sum + c.healthScore, 0) / mockCustomers.length;
  const npsScores = mockCustomers.filter((c) => c.npsScore !== null).map((c) => c.npsScore!);
  const avgNPS = npsScores.reduce((sum, s) => sum + s, 0) / npsScores.length;
  
  return {
    totalCustomers: mockCustomers.length,
    totalMRR: totalMRR,
    avgHealthScore: Math.round(avgHealthScore),
    avgNPS: avgNPS.toFixed(1),
    atRiskCount: mockCustomers.filter((c) => c.status === "at_risk").length,
    healthyCount: mockCustomers.filter((c) => c.status === "healthy").length,
    churnedCount: mockCustomers.filter((c) => c.status === "churned").length,
    byPlan: {
      starter: mockCustomers.filter((c) => c.plan === "starter").length,
      professional: mockCustomers.filter((c) => c.plan === "professional").length,
      enterprise: mockCustomers.filter((c) => c.plan === "enterprise").length,
    },
  };
}
