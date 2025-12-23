'use client'

import { useActivityLogStore } from '@/lib/store/activityLogStore'
import LogEntry from './LogEntry'
import { useEffect, useRef } from 'react'

export default function SystemActivityLog() {
  const entries = useActivityLogStore((state) => state.entries)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries])

  return (
    <div className="bg-[#e0e0e0] rounded-lg p-4 h-full flex flex-col border border-gray-400">
      <h2 className="text-lg font-bold mb-3 text-center">System activity log</h2>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-1 min-h-0 pr-1"
        style={{ overflowY: 'auto' }}
      >
        {entries.map((entry) => (
          <LogEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
