'use client'

import { useEffect } from 'react'
import VisualizationLayout from '@/components/layout/VisualizationLayout'
import { Header } from '@/components/layout/Header'
import { useActivityLogStore } from '@/lib/store/activityLogStore'

export default function Home() {
  const initializeEntries = useActivityLogStore((state) => state.initializeEntries)

  useEffect(() => {
    initializeEntries()
  }, [initializeEntries])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <VisualizationLayout />
      </main>
    </div>
  )
}
