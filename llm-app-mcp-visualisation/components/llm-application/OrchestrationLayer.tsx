'use client'

import { useChatStore } from '@/lib/store/chatStore'

export default function OrchestrationLayer() {
  const isLoading = useChatStore((state) => state.isLoading)

  return (
    <div className="bg-[#aed581] rounded-lg p-2 border border-green-500 flex-1">
      <h4 className="text-xs font-semibold text-center mb-1">Orchestration Layer</h4>
      <div className="text-[10px] text-center text-gray-600">
        {isLoading ? (
          <span className="text-green-700 animate-pulse">Processing...</span>
        ) : (
          'Ready'
        )}
      </div>
    </div>
  )
}
