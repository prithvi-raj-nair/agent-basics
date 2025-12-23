'use client'

import { useEffect } from 'react'
import VisualizationLayout from '@/components/layout/VisualizationLayout'
import { useActivityLogStore } from '@/lib/store/activityLogStore'

export default function Home() {
  const initializeEntries = useActivityLogStore((state) => state.initializeEntries)

  useEffect(() => {
    initializeEntries()
  }, [initializeEntries])

  return (
    <main className="min-h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-slate-700">LLM Application Visualization</h1>
        <span className="text-xs text-slate-400">Interactive demo of MCP and LLM integration</span>
      </div>
      <VisualizationLayout />
    </main>
  )
}
