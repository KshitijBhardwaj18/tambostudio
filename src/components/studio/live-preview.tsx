"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/studio-store";
import { Graph } from "@/components/tambo/graph";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Play, 
  Rocket,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import * as React from "react";

// Mock KPI Card component for preview
const KPICard: React.FC<{
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
}> = ({ title, value, change, trend, icon }) => (
  <div className="p-4 rounded-lg border border-border bg-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={cn(
            "text-xs mt-1",
            trend === "up" ? "text-green-500" : "text-red-500"
          )}>
            {trend === "up" ? "↑" : "↓"} {change}
          </p>
        )}
      </div>
      {icon && (
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
    </div>
  </div>
);

// Mock Data Table component for preview
const DataTable: React.FC<{
  columns: string[];
  rows: (string | React.ReactNode)[][];
}> = ({ columns, rows }) => (
  <div className="rounded-lg border border-border overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-muted">
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="px-3 py-2 text-left font-medium text-xs">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-border">
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-2 text-xs">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Status Badge component for preview
const StatusBadge: React.FC<{ status: string; variant?: "success" | "warning" | "error" | "default" }> = ({ 
  status, 
  variant = "default" 
}) => (
  <span className={cn(
    "px-2 py-0.5 rounded-full text-xs font-medium",
    variant === "success" && "bg-green-100 text-green-700",
    variant === "warning" && "bg-yellow-100 text-yellow-700",
    variant === "error" && "bg-red-100 text-red-700",
    variant === "default" && "bg-gray-100 text-gray-700",
  )}>
    {status}
  </span>
);

export const LivePreview: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const { selectedTemplate, components, launchApp } = useStudioStore();
  
  if (!selectedTemplate) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">Preview will appear here</p>
        </div>
      </div>
    );
  }
  
  const enabledComponents = components.filter((c) => c.enabled);
  const hasGraph = enabledComponents.some((c) => c.id === "graph");
  const hasKPI = enabledComponents.some((c) => c.id === "kpi-card");
  const hasTable = enabledComponents.some((c) => c.id === "data-table");
  
  // Template-specific mock data
  const getMockData = () => {
    switch (selectedTemplate.id) {
      case "sales-analytics":
        return {
          kpis: [
            { title: "Total Revenue", value: "$2.4M", change: "12.5%", trend: "up" as const, icon: <DollarSign className="h-4 w-4" /> },
            { title: "Active Deals", value: "156", change: "8.2%", trend: "up" as const, icon: <TrendingUp className="h-4 w-4" /> },
            { title: "Customers", value: "1,234", change: "5.1%", trend: "up" as const, icon: <Users className="h-4 w-4" /> },
          ],
          graphData: {
            type: "bar" as const,
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ label: "Revenue", data: [45, 52, 38, 61, 43, 55] }],
          },
          tableColumns: ["Deal", "Value", "Stage", "Close Date"],
          tableRows: [
            ["Enterprise Plan", "$45,000", <StatusBadge key="1" status="Negotiation" variant="warning" />, "Mar 15"],
            ["Team License", "$12,000", <StatusBadge key="2" status="Proposal" variant="default" />, "Mar 20"],
            ["Annual Contract", "$89,000", <StatusBadge key="3" status="Closed Won" variant="success" />, "Mar 10"],
          ],
        };
      case "support-ops":
        return {
          kpis: [
            { title: "Open Tickets", value: "47", change: "3 new", trend: "up" as const, icon: <AlertCircle className="h-4 w-4" /> },
            { title: "Avg Response", value: "2.4h", change: "15%", trend: "down" as const, icon: <MessageSquare className="h-4 w-4" /> },
            { title: "Resolved Today", value: "23", change: "8%", trend: "up" as const, icon: <TrendingUp className="h-4 w-4" /> },
          ],
          graphData: {
            type: "line" as const,
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            datasets: [{ label: "Tickets", data: [12, 19, 15, 8, 14] }],
          },
          tableColumns: ["Ticket", "Priority", "Status", "Assignee"],
          tableRows: [
            ["#1234 - Login issue", <StatusBadge key="1" status="High" variant="error" />, "Open", "Sarah"],
            ["#1235 - Payment failed", <StatusBadge key="2" status="Medium" variant="warning" />, "In Progress", "Mike"],
            ["#1236 - Feature request", <StatusBadge key="3" status="Low" variant="default" />, "Open", "Unassigned"],
          ],
        };
      case "engineering-ops":
        return {
          kpis: [
            { title: "System Health", value: "99.9%", change: "0.1%", trend: "up" as const, icon: <TrendingUp className="h-4 w-4" /> },
            { title: "Active Incidents", value: "2", change: "1 resolved", trend: "down" as const, icon: <AlertCircle className="h-4 w-4" /> },
            { title: "Deployments", value: "12", change: "Today", trend: "up" as const, icon: <Rocket className="h-4 w-4" /> },
          ],
          graphData: {
            type: "line" as const,
            labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
            datasets: [{ label: "Response Time (ms)", data: [120, 115, 180, 145, 130, 125] }],
          },
          tableColumns: ["Incident", "Severity", "Status", "Duration"],
          tableRows: [
            ["API Latency Spike", <StatusBadge key="1" status="P1" variant="error" />, "Investigating", "15m"],
            ["DB Connection Pool", <StatusBadge key="2" status="P2" variant="warning" />, "Monitoring", "2h"],
            ["Cache Miss Rate", <StatusBadge key="3" status="P3" variant="default" />, "Resolved", "45m"],
          ],
        };
      case "inventory-manager":
        return {
          kpis: [
            { title: "Total SKUs", value: "2,847", change: "23 new", trend: "up" as const, icon: <Users className="h-4 w-4" /> },
            { title: "Low Stock", value: "18", change: "5 critical", trend: "up" as const, icon: <AlertCircle className="h-4 w-4" /> },
            { title: "Orders Today", value: "156", change: "12%", trend: "up" as const, icon: <TrendingUp className="h-4 w-4" /> },
          ],
          graphData: {
            type: "bar" as const,
            labels: ["Electronics", "Clothing", "Home", "Sports", "Books"],
            datasets: [{ label: "Stock Level", data: [450, 320, 280, 190, 410] }],
          },
          tableColumns: ["Product", "SKU", "Stock", "Status"],
          tableRows: [
            ["Wireless Mouse", "WM-001", "12", <StatusBadge key="1" status="Low" variant="error" />],
            ["USB Cable", "UC-042", "245", <StatusBadge key="2" status="OK" variant="success" />],
            ["Keyboard", "KB-015", "38", <StatusBadge key="3" status="Medium" variant="warning" />],
          ],
        };
      case "customer-success":
        return {
          kpis: [
            { title: "Health Score", value: "78%", change: "3%", trend: "up" as const, icon: <TrendingUp className="h-4 w-4" /> },
            { title: "At Risk", value: "12", change: "2 new", trend: "up" as const, icon: <AlertCircle className="h-4 w-4" /> },
            { title: "NPS Score", value: "72", change: "5 pts", trend: "up" as const, icon: <Users className="h-4 w-4" /> },
          ],
          graphData: {
            type: "line" as const,
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ label: "Health Score", data: [72, 74, 71, 75, 76, 78] }],
          },
          tableColumns: ["Customer", "Health", "MRR", "Last Contact"],
          tableRows: [
            ["Acme Corp", <StatusBadge key="1" status="Healthy" variant="success" />, "$12,000", "2 days ago"],
            ["TechStart Inc", <StatusBadge key="2" status="At Risk" variant="error" />, "$8,500", "2 weeks ago"],
            ["Global Ltd", <StatusBadge key="3" status="Neutral" variant="warning" />, "$15,000", "5 days ago"],
          ],
        };
      default:
        return {
          kpis: [
            { title: "Metric 1", value: "1,234", change: "5%", trend: "up" as const },
            { title: "Metric 2", value: "567", change: "3%", trend: "up" as const },
            { title: "Metric 3", value: "89%", change: "2%", trend: "down" as const },
          ],
          graphData: {
            type: "bar" as const,
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{ label: "Data", data: [30, 45, 28, 52, 38] }],
          },
          tableColumns: ["Item", "Value", "Status"],
          tableRows: [
            ["Item 1", "100", <StatusBadge key="1" status="Active" variant="success" />],
            ["Item 2", "200", <StatusBadge key="2" status="Pending" variant="warning" />],
          ],
        };
    }
  };
  
  const mockData = getMockData();
  
  const handleLaunch = () => {
    const appId = launchApp();
    router.push(`/app/${appId}`);
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Live Preview</span>
        </div>
        <button
          onClick={handleLaunch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Rocket className="h-3.5 w-3.5" />
          Launch App
        </button>
      </div>
      
      {/* Preview content */}
      <div className="flex-1 overflow-auto p-4 bg-muted/30">
        <div className="space-y-4">
          {/* KPI Cards */}
          {hasKPI && (
            <div className="grid grid-cols-3 gap-3">
              {mockData.kpis.map((kpi, i) => (
                <KPICard key={i} {...kpi} />
              ))}
            </div>
          )}
          
          {/* Graph */}
          {hasGraph && (
            <Graph
              data={mockData.graphData}
              title={`${selectedTemplate.name} Overview`}
              variant="bordered"
            />
          )}
          
          {/* Data Table */}
          {hasTable && (
            <DataTable
              columns={mockData.tableColumns}
              rows={mockData.tableRows}
            />
          )}
          
          {/* Empty state if no components */}
          {enabledComponents.length === 0 && (
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Enable components to see preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
