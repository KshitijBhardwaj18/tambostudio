"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";

export const dataTableSchema = z.object({
  title: z.string().optional().describe("Optional title for the table"),
  columns: z.array(z.object({
    key: z.string().describe("Unique key for the column"),
    label: z.string().describe("Display label for the column header"),
    align: z.enum(["left", "center", "right"]).optional().describe("Text alignment"),
  })).describe("Column definitions"),
  rows: z.array(z.record(z.string(), z.any())).describe("Array of row data objects"),
  emptyMessage: z.string().optional().describe("Message to show when no data"),
});

export type DataTableProps = z.infer<typeof dataTableSchema>;

export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ title, columns, rows, emptyMessage = "No data available" }, ref) => {
    return (
      <div ref={ref} className="rounded-lg border border-border overflow-hidden bg-card">
        {title && (
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      !col.align && "text-left"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-foreground",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right"
                        )}
                      >
                        {row[col.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

DataTable.displayName = "DataTable";
