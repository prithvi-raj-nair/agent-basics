'use client'

import { ChatMessage as ChatMessageType } from '@/lib/types'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`text-xs ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block max-w-[90%] p-2 rounded ${
          isUser
            ? 'bg-blue-100 text-blue-900'
            : 'bg-white/80 text-gray-800'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
