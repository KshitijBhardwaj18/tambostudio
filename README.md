# TamboStudio

Build AI-powered applications in minutes using natural language. Describe what you want, and TamboStudio creates a working app with configured components, tools, and system prompts.

## Features

- **Natural Language App Creation** - Describe your app in plain English
- **Pre-built Templates** - Sales Analytics, Support Ops, Engineering Ops, Inventory Manager, Customer Success
- **Live Preview** - See your app in real-time as you configure it
- **One-Click Launch** - Deploy your AI app instantly
- **Powered by Tambo** - Built on the Tambo AI platform

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and add your Tambo API key:
   ```bash
   cp example.env.local .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

1. Push your code to GitHub and import the project in [Vercel](https://vercel.com).
2. Set the **Root Directory** to this app folder (e.g. `tambostudio`) if it lives in a monorepo.
3. Add environment variables in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_TAMBO_API_KEY` – your Tambo API key (from [tambo.co/dashboard](https://tambo.co/dashboard))
   - `NEXT_PUBLIC_TAMBO_URL` (optional) – Tambo API base URL if you use a custom endpoint
4. Deploy. The build uses `outputFileTracingRoot` so monorepos and multiple lockfiles are handled correctly.

## Usage

1. Go to `/studio` or click "Open Studio" from the landing page
2. Describe your app or select a template
3. Customize components, MCP servers, and system prompt
4. Click "Launch App" to create your AI application
5. Chat with your AI assistant

## Tech Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS, Radix UI
- **State**: Zustand
- **Charts**: Recharts
- **AI**: Tambo SDK

## Links

- [Tambo Documentation](https://tambo.co/docs)
- [Tambo Website](https://tambo.co)

---

Built with [Tambo AI](https://tambo.co)
