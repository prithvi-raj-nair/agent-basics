'use client'

import LLMApplication from '@/components/llm-application/LLMApplication'
import LLMAPI from '@/components/llm-api/LLMAPI'
import PrintHelloApplication from '@/components/print-hello/PrintHelloApplication'
import SystemActivityLog from '@/components/activity-log/SystemActivityLog'

export default function VisualizationLayout() {
  return (
    <div className="flex gap-4 h-[calc(100vh-120px)]">
      {/* LLM Application - Left Section (largest) */}
      <div className="flex-[2] min-w-[420px]">
        <LLMApplication />
      </div>

      {/* Middle Section - LLM API and Print Hello App */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
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
