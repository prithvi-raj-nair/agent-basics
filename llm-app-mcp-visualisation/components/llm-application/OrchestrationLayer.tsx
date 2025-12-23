'use client'

import { useChatStore } from '@/lib/store/chatStore'

export default function OrchestrationLayer() {
  const isLoading = useChatStore((state) => state.isLoading)

  return (
    <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200 shadow-sm h-full flex flex-col">
      <h4 className="text-[10px] font-medium text-center mb-1 text-emerald-700 uppercase tracking-wide">Orchestration Layer</h4>
      <p className="text-[11px] text-slate-500 text-center mb-2 leading-relaxed">
        Decides when to call the LLM, structures inputs, and handles responses. Acts as the boundary between the non-deterministic LLM and deterministic app logic.
      </p>
      <div className="text-[10px] text-center mt-auto py-1 bg-emerald-100/50 rounded border border-emerald-200">
        {isLoading ? (
          <span className="text-emerald-600 animate-pulse font-medium">Processing...</span>
        ) : (
          <span className="text-slate-600">Status: Ready</span>
        )}
      </div>
    </div>
  )
}
