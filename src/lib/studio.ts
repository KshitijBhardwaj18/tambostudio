export type TemplateId = 'support' | 'analytics' | 'sales' | 'engops' | 'knowledge'

export type StudioMessageRole = 'user' | 'studio'

export type StudioMessage = {
  id: string
  role: StudioMessageRole
  content: string
}

export type ToggleItem = {
  id: string
  name: string
  enabled: boolean
  description?: string
}

export type McpServer = ToggleItem & {
  tools: string[]
}

export type StudioConfig = {
  templateId: TemplateId
  templateName: string
  systemPrompt: string
  components: ToggleItem[]
  mcpServers: McpServer[]
}

export type DerivedStudioConfig = {
  config: StudioConfig
  summary: string
}

const TEMPLATES: Record<TemplateId, Omit<StudioConfig, 'templateId'>> = {
  support: {
    templateName: 'Support Desk Copilot',
    systemPrompt:
      'You are a support operations copilot. Help triage, summarize, and assign tickets using the enabled tools. Be concise and action-oriented.',
    components: [
      { id: 'kpiCards', name: 'KPI Cards', enabled: true },
      { id: 'ticketTable', name: 'Ticket Table', enabled: true },
      { id: 'ticketDetail', name: 'Ticket Detail Panel', enabled: true },
      { id: 'activityFeed', name: 'Activity Feed', enabled: false },
    ],
    mcpServers: [
      {
        id: 'ticketing',
        name: 'Ticketing',
        enabled: true,
        tools: ['searchTickets', 'assignTicket', 'setPriority', 'addInternalNote'],
      },
      {
        id: 'knowledge',
        name: 'Knowledge Base',
        enabled: true,
        tools: ['searchArticles', 'suggestMacro', 'draftReply'],
      },
      {
        id: 'analytics',
        name: 'Analytics',
        enabled: false,
        tools: ['ticketTrends', 'slaReport'],
      },
    ],
  },
  analytics: {
    templateName: 'Analytics Chat Analyst',
    systemPrompt:
      'You are an analytics copilot. Answer questions using the enabled tools and show the most relevant KPIs and breakdowns. Prefer tables and short explanations.',
    components: [
      { id: 'kpiCards', name: 'KPI Cards', enabled: true },
      { id: 'insightsChart', name: 'Insights Chart', enabled: true },
      { id: 'breakdownTable', name: 'Breakdown Table', enabled: true },
      { id: 'filtersPanel', name: 'Filters Panel', enabled: false },
    ],
    mcpServers: [
      {
        id: 'analytics',
        name: 'Analytics',
        enabled: true,
        tools: ['runQuery', 'comparePeriods', 'generateChart', 'summarizeChanges'],
      },
      {
        id: 'crm',
        name: 'CRM',
        enabled: false,
        tools: ['listAccounts', 'topOpportunities'],
      },
      {
        id: 'knowledge',
        name: 'Knowledge Base',
        enabled: false,
        tools: ['searchArticles'],
      },
    ],
  },
  sales: {
    templateName: 'Sales Assistant',
    systemPrompt:
      'You are a sales copilot. Help qualify leads, draft outreach, and summarize account context. Use the enabled tools when appropriate.',
    components: [
      { id: 'kpiCards', name: 'KPI Cards', enabled: true },
      { id: 'pipelineTable', name: 'Pipeline Table', enabled: true },
      { id: 'accountDetail', name: 'Account Detail Panel', enabled: true },
      { id: 'actionPanel', name: 'Action Buttons', enabled: true },
    ],
    mcpServers: [
      {
        id: 'crm',
        name: 'CRM',
        enabled: true,
        tools: ['findLead', 'createOpportunity', 'logCall', 'draftEmail'],
      },
      {
        id: 'analytics',
        name: 'Analytics',
        enabled: false,
        tools: ['pipelineReport'],
      },
      {
        id: 'knowledge',
        name: 'Knowledge Base',
        enabled: true,
        tools: ['searchPlaybook', 'suggestNextStep'],
      },
    ],
  },
  engops: {
    templateName: 'Engineering Ops Copilot',
    systemPrompt:
      'You are an engineering operations copilot. Help analyze incidents, summarize tickets, and propose next actions using the enabled tools.',
    components: [
      { id: 'kpiCards', name: 'KPI Cards', enabled: true },
      { id: 'incidentTable', name: 'Incident Table', enabled: true },
      { id: 'timeline', name: 'Timeline', enabled: true },
      { id: 'runbookPanel', name: 'Runbook Panel', enabled: false },
    ],
    mcpServers: [
      {
        id: 'ticketing',
        name: 'Ticketing',
        enabled: true,
        tools: ['createTicket', 'linkIncident', 'assignOncall'],
      },
      {
        id: 'knowledge',
        name: 'Knowledge Base',
        enabled: true,
        tools: ['searchRunbooks', 'suggestMitigation'],
      },
      {
        id: 'analytics',
        name: 'Analytics',
        enabled: false,
        tools: ['errorTrends'],
      },
    ],
  },
  knowledge: {
    templateName: 'Knowledge Chat',
    systemPrompt:
      'You are a knowledge assistant. Help find and synthesize answers from docs. Cite the most relevant sources (simulated) and ask clarifying questions when needed.',
    components: [
      { id: 'searchResults', name: 'Search Results', enabled: true },
      { id: 'docSummary', name: 'Document Summary', enabled: true },
      { id: 'actionPanel', name: 'Action Buttons', enabled: false },
      { id: 'kpiCards', name: 'KPI Cards', enabled: false },
    ],
    mcpServers: [
      {
        id: 'knowledge',
        name: 'Knowledge Base',
        enabled: true,
        tools: ['searchDocs', 'openDoc', 'summarizeDoc', 'extractSteps'],
      },
      {
        id: 'crm',
        name: 'CRM',
        enabled: false,
        tools: ['accountContext'],
      },
      {
        id: 'analytics',
        name: 'Analytics',
        enabled: false,
        tools: ['faqTrends'],
      },
    ],
  },
}

function cloneConfig(templateId: TemplateId): StudioConfig {
  const t = TEMPLATES[templateId]
  return {
    templateId,
    templateName: t.templateName,
    systemPrompt: t.systemPrompt,
    components: t.components.map((c) => ({ ...c })),
    mcpServers: t.mcpServers.map((s) => ({ ...s, tools: [...s.tools] })),
  }
}

export function getDefaultStudioConfig(): StudioConfig {
  return cloneConfig('analytics')
}

export function getEnabledToolNames(config: StudioConfig): string[] {
  const tools = config.mcpServers
    .filter((s) => s.enabled)
    .flatMap((s) => s.tools)
    .map((t) => t.trim())
    .filter(Boolean)

  return Array.from(new Set(tools)).sort((a, b) => a.localeCompare(b))
}

function pickTemplateIdFromPrompt(prompt: string): TemplateId {
  const p = prompt.toLowerCase()

  if (/(ticket|support|sla|triage|inbox|zendesk)/i.test(p)) return 'support'
  if (/(sales|lead|pipeline|outreach|crm|opportunit)/i.test(p)) return 'sales'
  if (/(incident|oncall|bug|sre|engineering ops|ops|pager)/i.test(p)) return 'engops'
  if (/(doc|knowledge|wiki|handbook|runbook|faq)/i.test(p)) return 'knowledge'

  return 'analytics'
}

export function deriveStudioConfigFromPrompt(prompt: string): DerivedStudioConfig {
  const templateId = pickTemplateIdFromPrompt(prompt)
  const config = cloneConfig(templateId)

  const enabledComponents = config.components.filter((c) => c.enabled).map((c) => c.name)
  const enabledMcpServers = config.mcpServers.filter((s) => s.enabled).map((s) => s.name)

  const summary =
    `Picked the ${config.templateName} template. ` +
    `Enabled components: ${enabledComponents.join(', ')}. ` +
    `Enabled MCP servers: ${enabledMcpServers.join(', ')}.`

  return { config, summary }
}

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
