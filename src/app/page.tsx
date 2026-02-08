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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#7FFFC3] animate-pulse" />
            <span className="text-sm text-gray-400">Powered by Tambo AI</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build AI Apps
            <br />
            <span className="text-[#7FFFC3]">In Minutes</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Describe your app in natural language and get a working AI-powered 
            application with configured components, tools, and system prompts.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/studio"
              className="px-8 py-4 bg-[#7FFFC3] text-gray-900 rounded-xl text-lg font-semibold hover:bg-[#6ee6b0] transition-all hover:scale-105"
            >
              Start Building
            </Link>
            <a
              href="https://tambo.co/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
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
                    <div className="p-3 rounded-lg bg-white/5 text-sm">
                      Build me a customer support dashboard with ticket tracking
                    </div>
                    <div className="p-3 rounded-lg bg-[#7FFFC3]/10 border border-[#7FFFC3]/20 text-sm text-[#7FFFC3]">
                      Creating your Support Ops app with ticket management, priority tracking, and analytics...
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="col-span-2 bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
                  <div className="text-sm font-medium mb-4 text-gray-400">Live Preview</div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-gray-500">Open Tickets</div>
                      <div className="text-2xl font-bold">47</div>
                      <div className="text-xs text-green-400">↑ 3 new</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-gray-500">Avg Response</div>
                      <div className="text-2xl font-bold">2.4h</div>
                      <div className="text-xs text-green-400">↓ 15%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="text-xs text-gray-500">Resolved</div>
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-xs text-green-400">↑ 8%</div>
                    </div>
                  </div>
                  <div className="h-32 rounded-lg bg-white/5 flex items-end p-4 gap-2">
                    {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-[#7FFFC3]/60 rounded-t"
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

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything you need to build AI apps
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            TamboStudio provides all the tools and components to create 
            production-ready AI applications without writing code.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7FFFC3]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#7FFFC3]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#7FFFC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Language</h3>
              <p className="text-gray-400">
                Describe what you want to build in plain English. Our AI understands 
                your intent and configures everything automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7FFFC3]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#7FFFC3]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#7FFFC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pre-built Templates</h3>
              <p className="text-gray-400">
                Start with templates for sales, support, engineering, inventory, 
                and customer success. Customize to fit your needs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7FFFC3]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#7FFFC3]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#7FFFC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Launch</h3>
              <p className="text-gray-400">
                Preview your app in real-time and launch with one click. 
                Your AI assistant is ready to help users immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-[#7FFFC3]/5 to-transparent">
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
                <div className="text-3xl mb-2">{template.icon}</div>
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
          <div className="p-12 rounded-3xl bg-gradient-to-br from-[#7FFFC3]/20 to-transparent border border-[#7FFFC3]/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to build your AI app?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join developers who are building the next generation of 
              AI-powered applications with TamboStudio.
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#7FFFC3] text-gray-900 rounded-xl text-lg font-semibold hover:bg-[#6ee6b0] transition-all hover:scale-105"
            >
              Open TamboStudio
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
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
              TamboStudio — Built with Tambo AI
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
