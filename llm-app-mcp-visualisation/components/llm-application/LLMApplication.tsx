'use client'

import ChatUI from './ChatUI'
import OrchestrationLayer from './OrchestrationLayer'
import MCPClient from './MCPClient'
import BuiltInTools from './BuiltInTools'

export default function LLMApplication() {
  return (
    <div className="bg-[#c8e6c9] rounded-lg p-4 h-full flex flex-col border border-green-400">
      <h2 className="text-lg font-bold mb-3 text-center flex-shrink-0">LLM Application</h2>

      <div className="flex gap-3 flex-1 min-h-0">
        {/* Chat UI - Left side (larger) */}
        <div className="flex-[2] min-w-[200px] h-full">
          <ChatUI />
        </div>

        {/* Right side - Orchestration, MCP Client, Built-in Tools with arrows */}
        <div className="flex-1 flex flex-col gap-1 min-w-[150px] h-full">
          {/* Orchestration Layer with arrow from Chat UI */}
          <div className="relative flex-shrink-0">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 transform">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-600">
                <path d="M2 8 L12 8 M9 5 L13 8 L9 11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <OrchestrationLayer />
          </div>

          {/* Arrow down to MCP Client */}
          <div className="flex justify-center py-0.5 flex-shrink-0">
            <svg width="16" height="12" viewBox="0 0 16 12" className="text-gray-600">
              <path d="M8 1 L8 9 M5 7 L8 10 L11 7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>

          {/* MCP Client */}
          <div className="flex-1 min-h-0">
            <MCPClient />
          </div>

          {/* Built-in Tools */}
          <div className="flex-1 min-h-0">
            <BuiltInTools />
          </div>
        </div>
      </div>
    </div>
  )
}
