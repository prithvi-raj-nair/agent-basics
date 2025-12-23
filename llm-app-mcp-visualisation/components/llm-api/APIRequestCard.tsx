'use client'

import { useState } from 'react'
import { APIRequest } from '@/lib/types'

interface APIRequestCardProps {
  request: APIRequest
  timestamp: Date
  stepNumber?: number
}

export default function APIRequestCard({ request, timestamp, stepNumber }: APIRequestCardProps) {
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})

  const toggleField = (field: string) => {
    setExpandedFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="bg-white rounded-lg border border-purple-300 overflow-hidden shadow-sm">
      <div className="bg-purple-200 px-3 py-2 flex justify-between items-center">
        <span className="font-semibold text-purple-800">API Request</span>
        <div className="flex items-center gap-2 text-xs text-purple-600">
          {stepNumber && <span className="bg-purple-100 px-1.5 py-0.5 rounded">Step #{stepNumber}</span>}
          <span>Timestamp: {timestamp.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <FieldRow name="model" value={request.model} />

        <FieldRow
          name="messages"
          value={`${request.messages.length} message(s)`}
          expandable
          isExpanded={expandedFields['messages']}
          onToggle={() => toggleField('messages')}
        >
          <div className="mt-2 space-y-2 pl-3 border-l-2 border-purple-200">
            {request.messages.map((msg, i) => (
              <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                <div className="font-medium text-purple-700 mb-1">{msg.role}</div>
                <div className="text-gray-700 whitespace-pre-wrap break-words">
                  {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
                </div>
                {msg.tool_calls && (
                  <div className="mt-1 text-purple-600">
                    Tool calls: {JSON.stringify(msg.tool_calls)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FieldRow>

        {request.tools && request.tools.length > 0 && (
          <FieldRow
            name="tools"
            value={`${request.tools.length} tool(s)`}
            expandable
            isExpanded={expandedFields['tools']}
            onToggle={() => toggleField('tools')}
          >
            <div className="mt-2 space-y-2 pl-3 border-l-2 border-purple-200">
              {(request.tools as Array<{ type: string; function: { name: string; description: string; parameters: unknown } }>).map((tool, i) => (
                <div key={i} className="bg-purple-50 p-2 rounded text-xs">
                  <div className="font-medium text-purple-700">{tool.function.name}</div>
                  <div className="text-gray-600 text-[11px]">{tool.function.description}</div>
                  <details className="mt-1">
                    <summary className="text-purple-500 cursor-pointer text-[10px]">Parameters</summary>
                    <pre className="text-gray-500 mt-1 text-[10px] overflow-auto">
                      {JSON.stringify(tool.function.parameters, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </FieldRow>
        )}

        {request.temperature !== undefined && (
          <FieldRow name="temperature" value={String(request.temperature)} />
        )}
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
        <span className="flex-1 text-gray-900 bg-gray-50 px-2 py-1 rounded text-xs">{value}</span>
        {expandable && (
          <button
            onClick={onToggle}
            className="text-purple-600 hover:text-purple-800 text-xs px-2 py-0.5 rounded hover:bg-purple-50"
          >
            {isExpanded ? '▼ Hide' : '▶ Show'}
          </button>
        )}
      </div>
      {expandable && isExpanded && children}
    </div>
  )
}
