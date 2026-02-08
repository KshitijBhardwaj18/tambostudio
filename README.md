# Tambo Studio

A Lovable-style AI app builder for creating AI-native applications using Tambo.

![Tambo Studio](https://img.shields.io/badge/Tambo-Studio-blue)

## Features

### Bootstrap Chat
- Natural language input to describe your app
- Quick-start templates for common use cases
- AI-powered template matching based on keywords

### 5 App Templates
1. **Sales Analytics** - Revenue tracking, forecasting, team performance
2. **Support Operations** - Ticket management, routing, resolution tracking
3. **Engineering Ops** - Incident management, deployments, system health
4. **Inventory Manager** - Stock levels, reorder alerts, supplier management
5. **Customer Success** - Health monitoring, engagement tracking, churn prediction

### Builder Interface
- **Config Sidebar**: Toggle components, MCP servers, edit system prompt
- **Live Preview**: Real-time preview with template-specific mock data
- **Code Preview**: Generated JSON configuration

### Components (10 total)
- Graph, KPI Card, Data Table, Detail Panel, Action Buttons
- Form Builder, Select Form, Status Badge, Timeline, Metric Trend

### MCP Servers (6 total)
- Ticketing, Analytics, CRM, Knowledge Base, Notifications, Inventory

## Project Structure

```
src/
├── app/
│   ├── studio/page.tsx          # Studio page route
│   └── chat/page.tsx            # Original chat page
├── components/
│   ├── studio/
│   │   ├── bootstrap-chat.tsx   # Lovable-style chat interface
│   │   ├── config-sidebar.tsx   # Configuration panel
│   │   ├── code-preview.tsx     # Generated config display
│   │   ├── live-preview.tsx     # Live preview with mock data
│   │   ├── studio-layout.tsx    # Main layout
│   │   └── index.ts             # Exports
│   ├── tambo/                   # Tambo components (Graph, SelectForm, etc.)
│   └── ui/                      # UI components
├── lib/
│   ├── studio-templates.ts      # Template definitions
│   ├── studio-store.ts          # Zustand state management
│   ├── tambo.ts                 # Tambo configuration
│   └── utils.ts                 # Utilities
└── services/
    └── analytics-data.ts        # Mock data services
```

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp example.env.local .env.local
   ```
   Add your Tambo API key to `.env.local`:
   ```
   NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
   ```

3. **Run dev server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Studio: `http://localhost:3000/studio`
   - Chat: `http://localhost:3000/chat`

## Demo Flow

1. User describes app in chat or selects template
2. AI matches to best template and configures
3. User customizes in builder (components, MCP, prompt)
4. Preview shows live mock data
5. Launch button shows success state

## Tech Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS, Radix UI
- **State**: Zustand
- **Charts**: Recharts
- **AI**: Tambo SDK

## License

MIT

---

Built for hackathon - optimized for demo reliability and visual polish.
