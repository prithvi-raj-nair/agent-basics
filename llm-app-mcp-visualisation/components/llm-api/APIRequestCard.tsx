'use client'

import { APIRequest } from '@/lib/types'

interface APIRequestCardProps {
  request: APIRequest
  timestamp: Date
}

export default function APIRequestCard({ request, timestamp }: APIRequestCardProps) {
  return (
    <div className="bg-white rounded-lg border border-purple-300 overflow-hidden">
      <div className="bg-purple-200 px-3 py-2 flex justify-between items-center">
        <span className="font-semibold text-purple-800">API request</span>
        <span className="text-xs text-purple-600">{timestamp.toLocaleTimeString()}</span>
      </div>
      <div className="p-3 space-y-2">
        <FieldRow
          name="model"
          description="The LLM model to use"
          value={request.model}
        />
        <FieldRow
          name="messages"
          description="Conversation history"
          value={`${request.messages.length} message(s)`}
          expandable
          expandedContent={
            <div className="mt-1 space-y-1">
              {request.messages.map((msg, i) => (
                <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                  <span className="font-medium text-purple-700">{msg.role}:</span>{' '}
                  <span className="text-gray-700">
                    {typeof msg.content === 'string'
                      ? msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '')
                      : '[complex content]'}
                  </span>
                </div>
              ))}
            </div>
          }
        />
        {request.tools && request.tools.length > 0 && (
          <FieldRow
            name="tools"
            description="Available tools for the model"
            value={`${request.tools.length} tool(s)`}
          />
        )}
        {request.temperature !== undefined && (
          <FieldRow
            name="temperature"
            description="Randomness of the response"
            value={String(request.temperature)}
          />
        )}
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
        <span className="ml-auto text-gray-700">{value}</span>
      </div>
      {expandable && expandedContent}
    </div>
  )
}
