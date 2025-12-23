'use client'

import { useChatStore } from '@/lib/store/chatStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { useEffect, useRef } from 'react'

export default function ChatUI() {
  const messages = useChatStore((state) => state.messages)
  const isLoading = useChatStore((state) => state.isLoading)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="bg-emerald-50 rounded-xl p-3 w-full h-full flex flex-col border border-emerald-200 shadow-sm">
      <h3 className="text-xs font-medium mb-2 text-center flex-shrink-0 text-emerald-700 uppercase tracking-wide">Chat</h3>

      {/* Messages area - scrollable, takes remaining space */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-2 pr-1 min-h-0 bg-slate-100 border border-slate-200 rounded-lg p-2"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-xs">Start a conversation...</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Input area - fixed at bottom inside the box */}
      <div className="flex-shrink-0 pt-2 mt-auto">
        <ChatInput />
      </div>
    </div>
  )
}
