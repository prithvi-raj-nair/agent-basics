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
      <h1 className="text-sm text-gray-500 mb-2">LLM application visualization</h1>
      <VisualizationLayout />
    </main>
  )
}
