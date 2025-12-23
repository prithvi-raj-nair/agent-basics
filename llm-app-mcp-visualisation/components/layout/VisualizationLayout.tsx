'use client'

import LLMApplication from '@/components/llm-application/LLMApplication'
import LLMAPI from '@/components/llm-api/LLMAPI'
import PrintHelloApplication from '@/components/print-hello/PrintHelloApplication'
import SystemActivityLog from '@/components/activity-log/SystemActivityLog'

export default function VisualizationLayout() {
  return (
    <div className="flex gap-2 h-[calc(100vh-80px)]">
      {/* LLM Application - Left Section (largest) */}
      <div className="flex-[2] min-w-[420px]">
        <LLMApplication />
      </div>

      {/* Arrows column */}
      <div className="flex flex-col w-8 flex-shrink-0">
        {/* Arrow to LLM API (top) */}
        <div className="h-24 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-500">
            <path d="M4 12 L18 12 M14 7 L20 12 L14 17" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        {/* Arrow to Print Hello (middle) - from MCP Client */}
        <div className="flex-1 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-500">
            <path d="M4 12 L18 12 M14 7 L20 12 L14 17" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Middle Section - LLM API and Print Hello App */}
      <div className="flex-1 flex flex-col gap-3 min-w-[300px]">
        <LLMAPI />
        <PrintHelloApplication />
      </div>

      {/* System Activity Log - Right Section */}
      <div className="flex-shrink-0 w-[280px]">
        <SystemActivityLog />
      </div>
    </div>
  )
}
