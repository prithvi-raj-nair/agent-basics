'use client'

import { useChatStore } from '@/lib/store/chatStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { useEffect, useRef } from 'react'

export default function ChatUI() {
  const messages = useChatStore((state) => state.messages)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="bg-[#81c784] rounded-lg p-3 w-full flex flex-col border-2 border-green-600">
      <h3 className="text-sm font-semibold mb-2 text-center flex-shrink-0">Chat UI</h3>

      {/* Messages area - scrollable, takes remaining space */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-2 pr-1 min-h-0"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 text-xs space-y-2 mt-4">
            <div className="bg-white/50 rounded p-2">User input text</div>
            <div className="bg-white/50 rounded p-2">Response or output text</div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Input area - fixed at bottom inside the box */}
      <div className="flex-shrink-0 border-t border-green-600 pt-2 mt-auto">
        <ChatInput />
      </div>
    </div>
  )
}
