'use client'

import { useState } from 'react'
import { APIResponse } from '@/lib/types'

interface APIResponseCardProps {
  response: APIResponse
  timestamp: Date
  stepNumber?: number
}

export default function APIResponseCard({ response, timestamp, stepNumber }: APIResponseCardProps) {
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})
  const choice = response.choices[0]
  const hasToolCalls = choice?.message?.tool_calls && choice.message.tool_calls.length > 0

  const toggleField = (field: string) => {
    setExpandedFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="bg-white rounded-lg border border-green-300 overflow-hidden shadow-sm">
      <div className="bg-green-200 px-3 py-2 flex justify-between items-center">
        <span className="font-semibold text-green-800">API Response</span>
        <div className="flex items-center gap-2 text-xs text-green-600">
          {stepNumber && <span className="bg-green-100 px-1.5 py-0.5 rounded">Step #{stepNumber}</span>}
          <span>Timestamp: {timestamp.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <FieldRow name="id" value={response.id} />
        <FieldRow name="model" value={response.model} />
        <FieldRow name="finish_reason" value={choice?.finish_reason || 'unknown'} />

        {choice?.message?.content && (
          <FieldRow
            name="content"
            value={choice.message.content.length > 50 ? `${choice.message.content.substring(0, 50)}...` : choice.message.content}
            expandable
            isExpanded={expandedFields['content']}
            onToggle={() => toggleField('content')}
          >
            <div className="mt-2 pl-3 border-l-2 border-green-200">
              <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 whitespace-pre-wrap">
                {choice.message.content}
              </div>
            </div>
          </FieldRow>
        )}

        {hasToolCalls && (
          <FieldRow
            name="tool_calls"
            value={`${choice.message.tool_calls!.length} call(s)`}
            expandable
            isExpanded={expandedFields['tool_calls']}
            onToggle={() => toggleField('tool_calls')}
          >
            <div className="mt-2 space-y-2 pl-3 border-l-2 border-green-200">
              {choice.message.tool_calls!.map((tc, i) => (
                <div key={i} className="bg-purple-50 p-2 rounded text-xs">
                  <div className="font-medium text-purple-700">{tc.function.name}</div>
                  <pre className="text-gray-600 mt-1 whitespace-pre-wrap break-all text-[11px]">
                    {tc.function.arguments}
                  </pre>
                </div>
              ))}
            </div>
          </FieldRow>
        )}

        <FieldRow
          name="usage"
          value={`${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion = ${response.usage.total_tokens} total`}
        />
      </div>
    </div>
  )
}

function FieldRow({
  name,
  value,
  expandable,
  isExpanded,
  onToggle,
  children,
}: {
  name: string
  value: string
  expandable?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  children?: React.ReactNode
}) {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-3 py-1">
        <span className="font-medium text-gray-700 min-w-[80px]">{name}</span>
        <span className="flex-1 text-gray-900 bg-gray-50 px-2 py-1 rounded text-xs truncate">{value}</span>
        {expandable && (
          <button
            onClick={onToggle}
            className="text-green-600 hover:text-green-800 text-xs px-2 py-0.5 rounded hover:bg-green-50 flex-shrink-0"
          >
            {isExpanded ? '▼ Hide' : '▶ Show'}
          </button>
        )}
      </div>
      {expandable && isExpanded && children}
    </div>
  )
}
