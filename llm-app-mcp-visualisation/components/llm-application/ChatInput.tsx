'use client'

import { useState } from 'react'
import { useChatStore } from '@/lib/store/chatStore'
import { useOrchestration } from '@/lib/services/orchestration'
import ResourceSelector from './ResourceSelector'

export default function ChatInput() {
  const [input, setInput] = useState('')
  const [showSelector, setShowSelector] = useState(false)
  const isLoading = useChatStore((state) => state.isLoading)
  const selectedResources = useChatStore((state) => state.selectedResources)
  const { handleUserMessage } = useOrchestration()

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return
    const message = input.trim()
    setInput('')
    await handleUserMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative">
      {/* Selected resources badges */}
      {selectedResources.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {selectedResources.map((r) => (
            <span
              key={r.name}
              className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded"
            >
              {r.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 bg-white/80 rounded p-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type text for input"
          className="flex-1 text-xs bg-transparent outline-none px-1"
          disabled={isLoading}
        />
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="w-6 h-6 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="w-6 h-6 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 flex items-center justify-center"
        >
          &gt;
        </button>
      </div>

      {/* Resource selector dropdown */}
      {showSelector && (
        <ResourceSelector onClose={() => setShowSelector(false)} />
      )}
    </div>
  )
}
