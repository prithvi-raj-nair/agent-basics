'use client'

import { ActivityEntry } from '@/lib/types'

interface LogEntryProps {
  entry: ActivityEntry
}

const componentColors: Record<string, string> = {
  'System': 'text-gray-700',
  'User Input': 'text-blue-700',
  'Orchestration Layer': 'text-green-700',
  'LLM API': 'text-purple-700',
  'MCP Client': 'text-teal-700',
  'Print Hello MCP': 'text-orange-700',
  'Print Hello UI': 'text-amber-700',
  'Print Hello App': 'text-amber-700',
  'Built-in Tools': 'text-lime-700',
}

export default function LogEntry({ entry }: LogEntryProps) {
  const colorClass = componentColors[entry.component] || 'text-gray-600'

  return (
    <div className="text-xs leading-relaxed">
      <span className="text-gray-500">{entry.id}. </span>
      <span className={`font-medium ${colorClass}`}>{entry.component}</span>
      <span className="text-gray-600"> - {entry.action}</span>
    </div>
  )
}
