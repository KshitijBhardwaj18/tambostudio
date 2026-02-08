import type { ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'

import type { StudioConfig, StudioMessage, ToggleItem } from './lib/studio'
import {
  createId,
  deriveStudioConfigFromPrompt,
  getDefaultStudioConfig,
  getEnabledToolNames,
} from './lib/studio'
import { Button } from './ui/Button'
import { Card, CardBody, CardHeader } from './ui/Card'
import { Switch } from './ui/Switch'
import type { ToastItem } from './ui/Toast'
import { ToastStack } from './ui/Toast'
import { cx } from './ui/cx'

type PreviewTab = 'preview' | 'chat'

type AppChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function formatTemplateLabel(templateName: string) {
  return templateName.replace('Copilot', '').trim()
}

function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function buildGeneratedConfig(config: StudioConfig) {
  const tools = getEnabledToolNames(config)
  return {
    template: config.templateId,
    systemPrompt: config.systemPrompt,
    mcpServers: config.mcpServers.filter((s) => s.enabled).map((s) => s.id),
    tools,
    components: config.components.filter((c) => c.enabled).map((c) => c.id),
  }
}

function toggleById<T extends ToggleItem>(items: T[], id: string, enabled: boolean): T[] {
  return items.map((i) => (i.id === id ? { ...i, enabled } : i))
}

function runFakeAssistantReply(userMessage: string, config: StudioConfig): string {
  const tools = getEnabledToolNames(config)
  const prefix = `System prompt (editable):\n${config.systemPrompt}\n\n`

  const toolLine = tools.length
    ? `Enabled tools: ${tools.join(', ')}.`
    : 'Enabled tools: none.'

  const intent = userMessage.toLowerCase()

  if (/(assign|owner|route)/i.test(intent) && tools.includes('assignTicket')) {
    return (
      `${prefix}I can assign this ticket. ${toolLine}\n\n` +
      'Proposed action: `assignTicket(ticketId="TCK-1042", assignee="oncall")`\n' +
      'Notes: Mark as P1 if customer impact is confirmed.'
    )
  }

  if (/(chart|trend|compare|period)/i.test(intent) && tools.includes('comparePeriods')) {
    return (
      `${prefix}I can compare periods and generate a chart. ${toolLine}\n\n` +
      'Proposed action: `comparePeriods(metric="activation", rangeA="last_7_days", rangeB="previous_7_days")`\n' +
      'Then render `Insights Chart` in the preview.'
    )
  }

  if (/(doc|runbook|how do i|steps)/i.test(intent) &&
    (tools.includes('searchDocs') || tools.includes('searchRunbooks'))) {
    return (
      `${prefix}I can search docs/runbooks. ${toolLine}\n\n` +
      'Proposed action: `searchDocs(query="' +
      userMessage.replaceAll('"', '\\"') +
      '")`\n' +
      'Then summarize the top result and extract a checklist.'
    )
  }

  return (
    `${prefix}${toolLine}\n\n` +
    'I can help refine this into the current template. Tell me what the primary user goal is and what data sources you want to simulate.'
  )
}

function MessageBubble({ message }: { message: StudioMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={cx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cx(
          'max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm',
          isUser
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200',
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function AppChatBubble({ message }: { message: AppChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={cx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cx(
          'max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm',
          isUser
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-800 ring-1 ring-inset ring-slate-200',
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
      {children}
    </span>
  )
}

function PreviewComponent({ id }: { id: string }) {
  if (id === 'kpiCards') {
    const cards = [
      { label: 'Active users', value: '12.4k', delta: '+6.2%' },
      { label: 'Resolution time', value: '2h 18m', delta: '-11%' },
      { label: 'Pipeline', value: '$184k', delta: '+3.1%' },
    ]
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-medium text-slate-500">{c.label}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{c.value}</div>
            <div className="mt-1 text-xs text-slate-600">{c.delta} vs last week</div>
          </div>
        ))}
      </div>
    )
  }

  if (id === 'ticketTable' || id === 'incidentTable' || id === 'pipelineTable') {
    const rows =
      id === 'pipelineTable'
        ? [
            { id: 'OPP-301', title: 'Acme renewal', status: 'Negotiation', owner: 'Maya' },
            { id: 'OPP-288', title: 'Northwind expansion', status: 'Proposal', owner: 'Jordan' },
            { id: 'OPP-274', title: 'Globex trial', status: 'Discovery', owner: 'Sam' },
          ]
        : id === 'incidentTable'
          ? [
              { id: 'INC-92', title: 'Elevated 500s', status: 'Investigating', owner: 'On-call' },
              { id: 'INC-91', title: 'Latency spike', status: 'Mitigating', owner: 'Infra' },
              { id: 'INC-88', title: 'Webhook delays', status: 'Resolved', owner: 'App' },
            ]
          : [
              { id: 'TCK-1042', title: 'Billing issue', status: 'Open', owner: 'Unassigned' },
              { id: 'TCK-1041', title: 'Login loop', status: 'Needs info', owner: 'Ava' },
              { id: 'TCK-1039', title: 'Export fails', status: 'In progress', owner: 'Noah' },
            ]

    const header =
      id === 'pipelineTable' ? 'Pipeline' : id === 'incidentTable' ? 'Incidents' : 'Tickets'

    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold text-slate-900">{header}</div>
          <div className="text-xs text-slate-500">Mock data</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse">
            <thead>
              <tr className="border-t border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-600">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Owner</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-200 text-sm">
                  <td className="px-4 py-2 font-mono text-xs text-slate-600">{r.id}</td>
                  <td className="px-4 py-2 text-slate-900">{r.title}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-700">{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (id === 'ticketDetail' || id === 'accountDetail') {
    const title = id === 'accountDetail' ? 'Account' : 'Ticket'
    const idLabel = id === 'accountDetail' ? 'ACC-17' : 'TCK-1042'
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-500">{title} detail</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              {id === 'accountDetail' ? 'Northwind' : 'Billing issue on Pro plan'}
            </div>
            <div className="mt-1 font-mono text-xs text-slate-600">{idLabel}</div>
          </div>
          <Badge>{id === 'accountDetail' ? 'High intent' : 'P2'}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
            <div className="text-xs font-medium text-slate-500">Summary</div>
            <div className="mt-1 text-slate-800">
              {id === 'accountDetail'
                ? '500 seats, renewal in 43 days. Expansion requested for Analytics add-on.'
                : 'Customer reports an invoice mismatch after upgrading. Needs investigation and a clear next step.'}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
            <div className="text-xs font-medium text-slate-500">Suggested next action</div>
            <div className="mt-1 text-slate-800">
              {id === 'accountDetail'
                ? 'Draft an email with pricing options and confirm procurement timeline.'
                : 'Assign to billing on-call, request invoice IDs, and set priority based on impact.'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (id === 'insightsChart') {
    const points = [22, 28, 24, 33, 31, 36, 42]
    const max = Math.max(...points)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Insights</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Activation trend</div>
          </div>
          <Badge>Fake chart</Badge>
        </div>
        <div className="mt-4 flex h-24 items-end gap-2">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-md bg-slate-100 ring-1 ring-inset ring-slate-200"
            >
              <div
                className="h-full w-full rounded-md bg-slate-900/80"
                style={{ height: `${Math.round((p / max) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-600">Last 7 days • compare available via tools</div>
      </div>
    )
  }

  if (id === 'breakdownTable') {
    const rows = [
      { label: 'US', value: '44%' },
      { label: 'EU', value: '32%' },
      { label: 'APAC', value: '24%' },
    ]
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Breakdown</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Users by region</div>
          </div>
          <Badge>Mock</Badge>
        </div>
        <div className="mt-4 space-y-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <div className="text-slate-700">{r.label}</div>
              <div className="font-mono text-xs text-slate-600">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'timeline') {
    const items = [
      { t: '10:24', label: 'Alert fired: elevated error rate' },
      { t: '10:28', label: 'Rollback started' },
      { t: '10:31', label: 'Errors dropping, monitoring' },
    ]
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Timeline</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Incident activity</div>
          </div>
          <Badge>Simulated</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {items.map((i) => (
            <div key={i.t} className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-slate-900" />
              <div className="min-w-0">
                <div className="font-mono text-xs text-slate-600">{i.t}</div>
                <div className="text-sm text-slate-800">{i.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'searchResults') {
    const results = [
      { title: 'How to rotate API keys', source: 'Security handbook' },
      { title: 'Onboarding checklist', source: 'People ops wiki' },
      { title: 'Incident response basics', source: 'SRE runbooks' },
    ]
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Search</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Top docs</div>
          </div>
          <Badge>Mock</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {results.map((r) => (
            <div key={r.title} className="rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
              <div className="text-sm font-medium text-slate-900">{r.title}</div>
              <div className="mt-1 text-xs text-slate-600">{r.source}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'docSummary') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Summary</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Selected document</div>
          </div>
          <Badge>Read-only</Badge>
        </div>
        <div className="mt-4 text-sm text-slate-800">
          This is where the assistant would synthesize the key steps and caveats from the most relevant doc.
        </div>
        <div className="mt-3 text-xs text-slate-600">
          Sources: handbook.md, runbook.md (simulated)
        </div>
      </div>
    )
  }

  if (id === 'actionPanel') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-xs font-medium text-slate-500">Actions</div>
        <div className="mt-1 text-sm font-semibold text-slate-900">One-click operations</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary">Create ticket</Button>
          <Button variant="secondary">Draft email</Button>
          <Button variant="secondary">Generate report</Button>
          <Button variant="secondary">Add internal note</Button>
        </div>
      </div>
    )
  }

  if (id === 'activityFeed') {
    const items = [
      { t: '1m', label: 'Macro suggested: “Billing investigation”' },
      { t: '5m', label: 'Ticket assigned to Ava' },
      { t: '12m', label: 'SLA risk: 2h remaining' },
    ]
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Feed</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Recent activity</div>
          </div>
          <Badge>Mock</Badge>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-800">
          {items.map((i) => (
            <div key={i.label} className="flex items-center justify-between gap-3">
              <div className="truncate">{i.label}</div>
              <div className="shrink-0 font-mono text-xs text-slate-500">{i.t}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'filtersPanel') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-xs font-medium text-slate-500">Filters</div>
        <div className="mt-1 text-sm font-semibold text-slate-900">Slice the data</div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {['Region', 'Plan', 'Segment', 'Channel'].map((l) => (
            <div key={l} className="rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
              <div className="text-xs text-slate-500">{l}</div>
              <div className="mt-1 text-slate-800">All</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'runbookPanel') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-xs font-medium text-slate-500">Runbook</div>
        <div className="mt-1 text-sm font-semibold text-slate-900">Suggested mitigations</div>
        <div className="mt-4 space-y-2 text-sm text-slate-800">
          <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
            1. Check deploy diff and error budget impact
          </div>
          <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
            2. Roll back the latest release if errors are correlated
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
      Unknown component: <span className="font-mono text-xs">{id}</span>
    </div>
  )
}

export default function App() {
  const [config, setConfig] = useState<StudioConfig>(() => getDefaultStudioConfig())
  const [previewTab, setPreviewTab] = useState<PreviewTab>('preview')
  const [bootstrapInput, setBootstrapInput] = useState('')
  const [bootstrapMessages, setBootstrapMessages] = useState<StudioMessage[]>(() => [
    {
      id: createId(),
      role: 'studio',
      content:
        'Describe the app you want. I will pick a template, enable components, and attach MCP servers (simulated).',
    },
  ])
  const [appChatInput, setAppChatInput] = useState('')
  const [appChatMessages, setAppChatMessages] = useState<AppChatMessage[]>(() => [
    {
      id: createId(),
      role: 'assistant',
      content: 'App chat is live. Ask for an action or insight to see how tools might be used.',
    },
  ])
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const enabledTools = useMemo(() => getEnabledToolNames(config), [config])
  const generatedConfigJson = useMemo(() => prettyJson(buildGeneratedConfig(config)), [config])
  const enabledComponentIds = useMemo(
    () => config.components.filter((c) => c.enabled).map((c) => c.id),
    [config.components],
  )
  const enabledMcpServerNames = useMemo(
    () => config.mcpServers.filter((s) => s.enabled).map((s) => s.name),
    [config.mcpServers],
  )

  function pushToast(next: Omit<ToastItem, 'id'>) {
    const id = createId()
    setToasts((prev) => [...prev, { ...next, id }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }

  async function copyGeneratedConfig() {
    try {
      await navigator.clipboard.writeText(generatedConfigJson)
      pushToast({ title: 'Copied', message: 'Generated config copied to clipboard.' })
    } catch {
      pushToast({ title: 'Copy failed', message: 'Clipboard is not available in this browser.' })
    }
  }

  function handleBootstrapSubmit() {
    const trimmed = bootstrapInput.trim()
    if (!trimmed) return

    const derived = deriveStudioConfigFromPrompt(trimmed)

    setBootstrapMessages((prev) => [
      ...prev,
      { id: createId(), role: 'user', content: trimmed },
      { id: createId(), role: 'studio', content: derived.summary },
    ])
    setConfig(derived.config)
    setBootstrapInput('')
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }))
  }

  function handleLaunch() {
    pushToast({ title: 'App snapshot created', message: 'Preview opened in the right panel.' })
    setPreviewTab('chat')
  }

  function handleAppChatSubmit() {
    const trimmed = appChatInput.trim()
    if (!trimmed) return

    const user: AppChatMessage = { id: createId(), role: 'user', content: trimmed }
    const assistant: AppChatMessage = {
      id: createId(),
      role: 'assistant',
      content: runFakeAssistantReply(trimmed, config),
    }

    setAppChatMessages((prev) => [...prev, user, assistant])
    setAppChatInput('')
    requestAnimationFrame(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">Tambo Studio</div>
            <div className="mt-0.5 truncate text-xs text-slate-500">
              Lovable-style, demo-first app builder (mocked)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge>{formatTemplateLabel(config.templateName)}</Badge>
            <Badge>{enabledTools.length ? `${enabledTools.length} tools` : 'no tools'}</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <Card>
          <CardHeader
            title="App Bootstrap Chat"
            subtitle="Describe your app — we map keywords → template + config (no real infra)."
          />
          <CardBody>
            <div className="h-44 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
              {bootstrapMessages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={bootstrapInput}
                onChange={(e) => setBootstrapInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBootstrapSubmit()
                }}
                placeholder='e.g. "Build me an AI that helps manage support tickets"'
                className={cx(
                  'h-10 flex-1 rounded-md bg-white px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200',
                  'placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2 focus:ring-slate-400',
                )}
              />
              <Button onClick={handleBootstrapSubmit} disabled={!bootstrapInput.trim()}>
                Generate
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-4">
            <CardHeader title="Sidebar" subtitle="Toggle capabilities and edit the master system prompt." />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Components
                  </div>
                  <div className="mt-2 space-y-3">
                    {config.components.map((c) => (
                      <Switch
                        key={c.id}
                        label={c.name}
                        checked={c.enabled}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            components: toggleById(prev.components, c.id, e.target.checked),
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    MCP Servers
                  </div>
                  <div className="mt-2 space-y-3">
                    {config.mcpServers.map((s) => (
                      <Switch
                        key={s.id}
                        label={s.name}
                        checked={s.enabled}
                        description={s.tools.slice(0, 3).join(', ')}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            mcpServers: toggleById(prev.mcpServers, s.id, e.target.checked),
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      System Prompt
                    </div>
                    <span className="text-xs text-slate-500">Editable</span>
                  </div>
                  <textarea
                    value={config.systemPrompt}
                    onChange={(e) => setConfig((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                    rows={7}
                    className={cx(
                      'mt-2 w-full resize-none rounded-lg bg-white p-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200',
                      'focus:outline-none focus:ring-2 focus:ring-slate-400',
                    )}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-8">
            <CardHeader
              title="Live Preview"
              subtitle={
                enabledMcpServerNames.length
                  ? `MCP servers enabled: ${enabledMcpServerNames.join(', ')}`
                  : 'No MCP servers enabled'
              }
              right={
                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 ring-1 ring-inset ring-slate-200">
                  <button
                    type="button"
                    className={cx(
                      'rounded-md px-2 py-1 text-xs font-medium',
                      previewTab === 'preview'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800',
                    )}
                    onClick={() => setPreviewTab('preview')}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className={cx(
                      'rounded-md px-2 py-1 text-xs font-medium',
                      previewTab === 'chat'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800',
                    )}
                    onClick={() => setPreviewTab('chat')}
                  >
                    App chat
                  </button>
                </div>
              }
            />
            <CardBody>
              {previewTab === 'preview' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Template: {config.templateId}</Badge>
                    <Badge>{enabledComponentIds.length} components</Badge>
                    <Badge>{enabledTools.length ? `${enabledTools.length} tools` : 'no tools'}</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {enabledComponentIds.length ? (
                      enabledComponentIds.map((id) => <PreviewComponent key={id} id={id} />)
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                        Enable at least one component in the sidebar.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-inset ring-slate-200">
                    <div className="font-semibold text-slate-700">Simulated tool belt</div>
                    <div className="mt-1">
                      {enabledTools.length ? enabledTools.join(' • ') : 'No tools enabled.'}
                    </div>
                  </div>

                  <div className="h-72 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
                    {appChatMessages.map((m) => (
                      <AppChatBubble key={m.id} message={m} />
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={appChatInput}
                      onChange={(e) => setAppChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAppChatSubmit()
                      }}
                      placeholder="Ask the app something…"
                      className={cx(
                        'h-10 flex-1 rounded-md bg-white px-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200',
                        'placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-slate-400',
                      )}
                    />
                    <Button onClick={handleAppChatSubmit} disabled={!appChatInput.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Generated Config / Code"
            subtitle="Read-only artifact (JSON)."
            right={
              <Button variant="secondary" onClick={copyGeneratedConfig}>
                Copy
              </Button>
            }
          />
          <CardBody>
            <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
              {generatedConfigJson}
            </pre>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Optimize for believability: fast, clear, and demo-stable.
          </div>
          <Button onClick={handleLaunch}>Launch / Preview</Button>
        </div>
      </main>

      <ToastStack
        items={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  )
}
