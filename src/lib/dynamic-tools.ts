/**
 * @file dynamic-tools.ts
 * @description Generate Tambo tools dynamically from user data sources
 */

import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { DataSource, DataField } from "./data-source-store";

/**
 * Generate a Zod schema for filtering based on data fields
 */
function generateFilterSchema(fields: DataField[]) {
  const schemaObj: Record<string, z.ZodTypeAny> = {};
  
  fields.forEach((field) => {
    switch (field.type) {
      case "number":
        schemaObj[field.name] = z.number().optional();
        break;
      case "boolean":
        schemaObj[field.name] = z.boolean().optional();
        break;
      default:
        schemaObj[field.name] = z.string().optional();
    }
  });
  
  return z.object(schemaObj).default({});
}

/**
 * Create a getData tool for a data source
 */
function createGetDataTool(dataSource: DataSource): TamboTool {
  const filterSchema = generateFilterSchema(dataSource.fields);
  const fieldNames = dataSource.fields.map((f) => f.name).join(", ");
  
  return {
    name: `get${dataSource.name.replace(/\s+/g, "")}Data`,
    description: `Get data from "${dataSource.name}". Available fields: ${fieldNames}. You can filter by any field.`,
    tool: async (filters?: Record<string, unknown>) => {
      let result = [...dataSource.data];
      
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
    toolSchema: z.function().args(filterSchema),
  };
}

/**
 * Create a getStats tool for a data source
 */
function createGetStatsTool(dataSource: DataSource): TamboTool {
  const numericFields = dataSource.fields.filter((f) => f.type === "number");
  
  return {
    name: `get${dataSource.name.replace(/\s+/g, "")}Stats`,
    description: `Get statistics for "${dataSource.name}" including count, sum, average, min, and max for numeric fields.`,
    tool: async () => {
      const stats: Record<string, unknown> = {
        totalCount: dataSource.data.length,
      };
      
      numericFields.forEach((field) => {
        const values = dataSource.data
          .map((row) => row[field.name])
          .filter((v): v is number => typeof v === "number");
        
        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          stats[`${field.name}_sum`] = sum;
          stats[`${field.name}_avg`] = Math.round((sum / values.length) * 100) / 100;
          stats[`${field.name}_min`] = Math.min(...values);
          stats[`${field.name}_max`] = Math.max(...values);
        }
      });
      
      return stats;
    },
    toolSchema: z.function().args(z.void()),
  };
}

/**
 * Create a groupBy tool for a data source
 */
function createGroupByTool(dataSource: DataSource): TamboTool {
  const stringFields = dataSource.fields.filter((f) => f.type === "string");
  const numericFields = dataSource.fields.filter((f) => f.type === "number");
  
  if (stringFields.length === 0) {
    return createGetStatsTool(dataSource); // Fallback
  }
  
  const groupByOptions = stringFields.map((f) => f.name);
  
  return {
    name: `groupBy${dataSource.name.replace(/\s+/g, "")}`,
    description: `Group "${dataSource.name}" data by a field and get aggregated statistics. Can group by: ${groupByOptions.join(", ")}`,
    tool: async (params: { groupBy: string; aggregate?: string }) => {
      const { groupBy, aggregate } = params;
      
      const groups: Record<string, Record<string, unknown>[]> = {};
      
      dataSource.data.forEach((row) => {
        const key = String(row[groupBy] || "Unknown");
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
      
      const result = Object.entries(groups).map(([key, rows]) => {
        const groupResult: Record<string, unknown> = {
          [groupBy]: key,
          count: rows.length,
        };
        
        // Aggregate numeric fields
        const targetField = aggregate ? numericFields.find((f) => f.name === aggregate) : numericFields[0];
        if (targetField) {
          const values = rows
            .map((r) => r[targetField.name])
            .filter((v): v is number => typeof v === "number");
          
          if (values.length > 0) {
            groupResult[`${targetField.name}_total`] = values.reduce((a, b) => a + b, 0);
            groupResult[`${targetField.name}_avg`] = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
          }
        }
        
        return groupResult;
      });
      
      return result;
    },
    toolSchema: z.function().args(
      z.object({
        groupBy: z.enum(groupByOptions as [string, ...string[]]),
        aggregate: z.string().optional(),
      })
    ),
  };
}

/**
 * Create a search tool for a data source
 */
function createSearchTool(dataSource: DataSource): TamboTool {
  return {
    name: `search${dataSource.name.replace(/\s+/g, "")}`,
    description: `Search "${dataSource.name}" data with a text query. Searches across all text fields.`,
    tool: async (query: string) => {
      const searchLower = query.toLowerCase();
      
      return dataSource.data.filter((row) => {
        return Object.values(row).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchLower);
          }
          return String(value).includes(searchLower);
        });
      });
    },
    toolSchema: z.function().args(z.string()),
  };
}

/**
 * Generate all tools for a data source
 */
export function generateToolsForDataSource(dataSource: DataSource): TamboTool[] {
  const tools: TamboTool[] = [
    createGetDataTool(dataSource),
    createGetStatsTool(dataSource),
    createSearchTool(dataSource),
  ];
  
  // Only add groupBy if there are string fields to group by
  const stringFields = dataSource.fields.filter((f) => f.type === "string");
  if (stringFields.length > 0) {
    tools.push(createGroupByTool(dataSource));
  }
  
  return tools;
}

/**
 * Generate tools for multiple data sources
 */
export function generateToolsForDataSources(dataSources: DataSource[]): TamboTool[] {
  return dataSources.flatMap(generateToolsForDataSource);
}

/**
 * Generate a system prompt based on data sources
 */
export function generateSystemPromptForDataSources(dataSources: DataSource[], appName: string): string {
  if (dataSources.length === 0) {
    return `You are ${appName}, an AI assistant. Help users with their questions.`;
  }
  
  const dataDescriptions = dataSources.map((ds) => {
    const fieldList = ds.fields.map((f) => `${f.name} (${f.type})`).join(", ");
    return `- "${ds.name}": ${ds.data.length} records with fields: ${fieldList}`;
  }).join("\n");
  
  return `You are ${appName}, an AI assistant with access to the following data sources:

${dataDescriptions}

You can:
1. Query and filter data from any source
2. Get statistics (sum, average, min, max) for numeric fields
3. Group data by categories and see aggregated results
4. Search across all data

When users ask questions about the data:
- Use the appropriate tools to fetch and analyze data
- Display results using visual components like graphs, tables, and KPI cards
- Provide insights and summaries based on the data

Be helpful, accurate, and proactive in suggesting relevant analyses.`;
}
