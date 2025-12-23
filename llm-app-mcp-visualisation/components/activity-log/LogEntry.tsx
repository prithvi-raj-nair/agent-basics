'use client'

import { ActivityEntry } from '@/lib/types'

interface LogEntryProps {
  entry: ActivityEntry
}

const componentColors: Record<string, { bg: string; text: string }> = {
  'System': { bg: 'bg-slate-100', text: 'text-slate-600' },
  'User Input': { bg: 'bg-blue-50', text: 'text-blue-600' },
  'Orchestration Layer': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  'LLM API': { bg: 'bg-violet-50', text: 'text-violet-600' },
  'MCP Client': { bg: 'bg-teal-50', text: 'text-teal-600' },
  'Print Hello MCP': { bg: 'bg-amber-50', text: 'text-amber-600' },
  'Print Hello UI': { bg: 'bg-orange-50', text: 'text-orange-600' },
  'Print Hello App': { bg: 'bg-orange-50', text: 'text-orange-600' },
  'Built-in Tools': { bg: 'bg-lime-50', text: 'text-lime-600' },
}

export default function LogEntry({ entry }: LogEntryProps) {
  const colors = componentColors[entry.component] || { bg: 'bg-gray-50', text: 'text-gray-600' }

  return (
    <div className="text-[11px] leading-relaxed flex items-start gap-1.5 bg-white rounded-md px-2 py-1.5 border border-slate-100">
      <span className="text-slate-400 font-mono text-[10px] mt-0.5 min-w-[18px]">{entry.id}.</span>
      <span className={`font-medium ${colors.text} ${colors.bg} px-1.5 py-0.5 rounded text-[10px]`}>
        {entry.component}
      </span>
      <span className="text-slate-600 flex-1">{entry.action}</span>
    </div>
  )
}
