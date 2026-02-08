"use client";

import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import * as React from "react";

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, React.ReactNode>[];
  className?: string;
  onRowClick?: (row: Record<string, React.ReactNode>) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  className,
  onRowClick,
}) => {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    
    return [...data].sort((a, b) => {
      const aVal = String(a[sortKey] || "");
      const bVal = String(b[sortKey] || "");
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left font-medium text-xs uppercase tracking-wide text-muted-foreground",
                  col.sortable && "cursor-pointer hover:bg-muted/80 select-none"
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortDirection === "asc" 
                      ? <ChevronUp className="h-3 w-3" />
                      : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-t border-border",
                onRowClick && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

DataTable.displayName = "DataTable";
