'use client'

import { APIResponse } from '@/lib/types'

interface APIResponseCardProps {
  response: APIResponse
  timestamp: Date
}

export default function APIResponseCard({ response, timestamp }: APIResponseCardProps) {
  const choice = response.choices[0]
  const hasToolCalls = choice?.message?.tool_calls && choice.message.tool_calls.length > 0

  return (
    <div className="bg-white rounded-lg border border-green-300 overflow-hidden">
      <div className="bg-green-200 px-3 py-2 flex justify-between items-center">
        <span className="font-semibold text-green-800">API response</span>
        <span className="text-xs text-green-600">{timestamp.toLocaleTimeString()}</span>
      </div>
      <div className="p-3 space-y-2">
        <FieldRow
          name="id"
          description="Response identifier"
          value={response.id}
        />
        <FieldRow
          name="model"
          description="Model used"
          value={response.model}
        />
        <FieldRow
          name="finish_reason"
          description="Why the response ended"
          value={choice?.finish_reason || 'unknown'}
        />
        {choice?.message?.content && (
          <FieldRow
            name="content"
            description="The response text"
            value={choice.message.content.substring(0, 50) + (choice.message.content.length > 50 ? '...' : '')}
            expandable
            expandedContent={
              <div className="mt-1 bg-gray-50 p-2 rounded text-xs text-gray-700">
                {choice.message.content}
              </div>
            }
          />
        )}
        {hasToolCalls && (
          <FieldRow
            name="tool_calls"
            description="Tools the model wants to call"
            value={`${choice.message.tool_calls!.length} call(s)`}
            expandable
            expandedContent={
              <div className="mt-1 space-y-1">
                {choice.message.tool_calls!.map((tc, i) => (
                  <div key={i} className="bg-purple-50 p-2 rounded text-xs">
                    <span className="font-medium text-purple-700">{tc.function.name}</span>
                    <pre className="text-gray-600 mt-1">{tc.function.arguments}</pre>
                  </div>
                ))}
              </div>
            }
          />
        )}
        <FieldRow
          name="usage"
          description="Token usage"
          value={`${response.usage.prompt_tokens} + ${response.usage.completion_tokens} = ${response.usage.total_tokens}`}
        />
      </div>
    </div>
  )
}

function FieldRow({
  name,
  description,
  value,
  expandable,
  expandedContent,
}: {
  name: string
  description: string
  value: string
  expandable?: boolean
  expandedContent?: React.ReactNode
}) {
  return (
    <div className="text-sm">
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-gray-800">{name}</span>
        <span className="text-xs text-gray-500">- {description}</span>
        <span className="ml-auto text-gray-700 text-xs">{value}</span>
      </div>
      {expandable && expandedContent}
    </div>
  )
}
