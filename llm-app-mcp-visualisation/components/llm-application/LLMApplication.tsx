'use client'

import ChatUI from './ChatUI'
import OrchestrationLayer from './OrchestrationLayer'
import MCPClient from './MCPClient'
import BuiltInTools from './BuiltInTools'

export default function LLMApplication() {
  return (
    <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl p-4 h-full flex flex-col border border-emerald-300 shadow-sm">
      <h2 className="text-base font-semibold mb-3 text-center flex-shrink-0 text-emerald-800">LLM Application</h2>

      <div className="flex gap-3 flex-1 min-h-0">
        {/* Chat UI - Left side (larger) */}
        <div className="flex-[2] min-w-[200px] h-full">
          <ChatUI />
        </div>

        {/* Right side - Orchestration, MCP Client, Built-in Tools */}
        <div className="flex-1 flex flex-col gap-2 min-w-[150px] h-full">
          {/* Orchestration Layer - larger */}
          <div className="flex-[2] min-h-0">
            <OrchestrationLayer />
          </div>

          {/* MCP Client - smaller */}
          <div className="flex-1 min-h-0">
            <MCPClient />
          </div>

          {/* Built-in Tools - smaller */}
          <div className="flex-1 min-h-0">
            <BuiltInTools />
          </div>
        </div>
      </div>
    </div>
  )
}
