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
    <div className="bg-slate-100 rounded-xl p-4 h-full flex flex-col border border-slate-300 shadow-sm">
      <h2 className="text-base font-semibold mb-3 text-center text-slate-700">System Activity Log</h2>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 min-h-0 pr-1 bg-slate-200/50 rounded-lg p-2"
        style={{ overflowY: 'auto' }}
      >
        {entries.map((entry) => (
          <LogEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
