import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/Octo-Icon.svg"
              alt="TamboStudio"
              width={36}
              height={36}
            />
            <span className="text-xl font-semibold">TamboStudio</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://tambo.co/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Docs
            </a>
            <a 
              href="https://github.com/tambo-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/studio"
              className="px-4 py-2 bg-[#7FFFC3] text-gray-900 rounded-lg text-sm font-medium hover:bg-[#6ee6b0] transition-colors"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7FFFC3]/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7FFFC3]/10 rounded-full blur-3xl opacity-20" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Image
              src="/Octo-Icon.svg"
              alt="Tambo"
              width={20}
              height={20}
            />
            <span className="text-sm text-gray-400">Powered by <span className="text-[#7FFFC3] font-medium">Tambo AI</span></span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build AI Apps
            <br />
            <span className="bg-gradient-to-r from-[#7FFFC3] to-[#4ade80] bg-clip-text text-transparent">In Minutes</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Describe your app in natural language. TamboStudio generates a fully functional 
            AI application with smart components, tools, and custom system prompts.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              href="/studio"
              className="group px-8 py-4 bg-[#7FFFC3] text-gray-900 rounded-xl text-lg font-semibold hover:bg-[#6ee6b0] transition-all hover:scale-105 shadow-lg shadow-[#7FFFC3]/25"
            >
              Start Building
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href="https://tambo.co"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Learn About Tambo
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 text-center">
            <div>
              <div className="text-3xl font-bold text-[#7FFFC3]">5+</div>
              <div className="text-sm text-gray-500">Templates</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-3xl font-bold text-[#7FFFC3]">10+</div>
              <div className="text-sm text-gray-500">Components</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-3xl font-bold text-[#7FFFC3]">∞</div>
              <div className="text-sm text-gray-500">Possibilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent shadow-2xl">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white/5 text-xs text-gray-500">
                  tambostudio.app/studio
                </div>
              </div>
            </div>
            
            {/* App Preview */}
            <div className="p-8 bg-[#111]">
              <div className="grid grid-cols-3 gap-6">
                {/* Chat Panel */}
                <div className="col-span-1 bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
                  <div className="text-sm font-medium mb-4 text-gray-400">Describe your app</div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#7FFFC3] text-gray-900 text-sm">
                      Build me a customer support dashboard with ticket tracking
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-[#7FFFC3] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[#7FFFC3] text-xs">Generated</span>
                      </div>
                      <span className="text-gray-300">I&apos;ve created <strong className="text-[#7FFFC3]">Support Ops AI</strong> with ticket management, priority tracking, and analytics.</span>
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="col-span-2 bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
                  <div className="text-sm font-medium mb-4 text-gray-400">Live Preview</div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-xs text-gray-500">Open Tickets</div>
                      <div className="text-2xl font-bold">47</div>
                      <div className="text-xs text-[#7FFFC3]">↑ 3 new</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-xs text-gray-500">Avg Response</div>
                      <div className="text-2xl font-bold">2.4h</div>
                      <div className="text-xs text-[#7FFFC3]">↓ 15%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-xs text-gray-500">Resolved</div>
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-xs text-[#7FFFC3]">↑ 8%</div>
                    </div>
                  </div>
                  <div className="h-32 rounded-lg bg-white/5 flex items-end p-4 gap-2">
                    {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-[#7FFFC3] to-[#7FFFC3]/60 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tambo Features - Highlighted */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-[#7FFFC3]/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7FFFC3]/10 border border-[#7FFFC3]/20 mb-4">
              <Image src="/Octo-Icon.svg" alt="Tambo" width={16} height={16} />
              <span className="text-xs text-[#7FFFC3] font-medium">Powered by Tambo</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built on the <span className="text-[#7FFFC3]">Tambo AI Platform</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              TamboStudio leverages Tambo&apos;s powerful AI infrastructure to deliver 
              intelligent, responsive applications that understand your users.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tambo Feature 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/10 to-transparent border border-[#7FFFC3]/20 hover:border-[#7FFFC3]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#7FFFC3]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#7FFFC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Native Components</h3>
              <p className="text-sm text-gray-400">
                Components that understand context and respond intelligently to user interactions.
              </p>
            </div>

            {/* Tambo Feature 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/10 to-transparent border border-[#7FFFC3]/20 hover:border-[#7FFFC3]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#7FFFC3]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#7FFFC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">MCP Tools</h3>
              <p className="text-sm text-gray-400">
                Model Context Protocol integration for powerful AI tool calling and data access.
              </p>
            </div>

            {/* Tambo Feature 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/10 to-transparent border border-[#7FFFC3]/20 hover:border-[#7FFFC3]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#7FFFC3]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#7FFFC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Streaming</h3>
              <p className="text-sm text-gray-400">
                Instant responses with streaming AI output for a fluid, responsive experience.
              </p>
            </div>

            {/* Tambo Feature 4 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7FFFC3]/10 to-transparent border border-[#7FFFC3]/20 hover:border-[#7FFFC3]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#7FFFC3]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#7FFFC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom System Prompts</h3>
              <p className="text-sm text-gray-400">
                Fine-tune AI behavior with custom prompts tailored to your specific use case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            From idea to working AI app in three simple steps
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#7FFFC3] text-gray-900 flex items-center justify-center text-xl font-bold">1</div>
              <div className="p-6 pt-10 rounded-2xl bg-white/5 border border-white/10 h-full">
                <h3 className="text-xl font-semibold mb-3">Describe Your App</h3>
                <p className="text-gray-400">
                  Tell us what you want to build in plain English. &quot;Build me a sales dashboard&quot; or &quot;Create a support ticket system&quot; - we understand it all.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#7FFFC3] text-gray-900 flex items-center justify-center text-xl font-bold">2</div>
              <div className="p-6 pt-10 rounded-2xl bg-white/5 border border-white/10 h-full">
                <h3 className="text-xl font-semibold mb-3">AI Generates Your App</h3>
                <p className="text-gray-400">
                  Our AI analyzes your requirements and generates a custom configuration with the right components, tools, and system prompts.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#7FFFC3] text-gray-900 flex items-center justify-center text-xl font-bold">3</div>
              <div className="p-6 pt-10 rounded-2xl bg-white/5 border border-white/10 h-full">
                <h3 className="text-xl font-semibold mb-3">Launch & Use</h3>
                <p className="text-gray-400">
                  Preview your app, customize if needed, and launch with one click. Your AI assistant is ready to help users immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Start with a template
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Choose from our collection of pre-built templates or describe 
            your own custom application.
          </p>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { icon: "📊", name: "Sales Analytics", desc: "Revenue & deals" },
              { icon: "🎫", name: "Support Ops", desc: "Ticket management" },
              { icon: "⚙️", name: "Engineering", desc: "Incidents & deploys" },
              { icon: "📦", name: "Inventory", desc: "Stock tracking" },
              { icon: "💚", name: "Customer Success", desc: "Health scores" },
            ].map((template, i) => (
              <Link
                key={i}
                href="/studio"
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#7FFFC3]/50 hover:bg-white/10 transition-all text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{template.icon}</div>
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-gray-500">{template.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-[#7FFFC3]/20 to-transparent border border-[#7FFFC3]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/Octo-Icon.svg')] bg-no-repeat bg-right-bottom opacity-5 bg-[length:300px]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to build your AI app?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join developers who are building the next generation of 
                AI-powered applications with TamboStudio and Tambo AI.
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#7FFFC3] text-gray-900 rounded-xl text-lg font-semibold hover:bg-[#6ee6b0] transition-all hover:scale-105 shadow-lg shadow-[#7FFFC3]/25"
              >
                Open TamboStudio
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/Octo-Icon.svg"
              alt="TamboStudio"
              width={28}
              height={28}
            />
            <span className="text-sm text-gray-400">
              TamboStudio — Built with <a href="https://tambo.co" target="_blank" rel="noopener noreferrer" className="text-[#7FFFC3] hover:underline">Tambo AI</a>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://tambo.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Tambo
            </a>
            <a 
              href="https://tambo.co/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a 
              href="https://github.com/tambo-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
