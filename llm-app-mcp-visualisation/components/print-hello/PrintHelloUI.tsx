'use client'

import { useState, useRef, useEffect } from 'react'
import { useMCPStore } from '@/lib/store/mcpStore'
import { useActivityLogStore } from '@/lib/store/activityLogStore'

export default function PrintHelloUI() {
  const [name, setName] = useState('')
  const hellos = useMCPStore((state) => state.hellos)
  const addHello = useMCPStore((state) => state.addHello)
  const addEntry = useActivityLogStore((state) => state.addEntry)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [hellos])

  const handlePrintHello = () => {
    addEntry('Print Hello UI', 'Button clicked')
    addHello(name || undefined, 'ui')
    addEntry('Print Hello App', `Hello${name ? ` ${name}` : ''} printed`)
    setName('')
  }

  return (
    <div className="bg-amber-50 rounded-lg p-3 h-full flex flex-col border border-amber-200 shadow-sm">
      <h3 className="text-xs font-medium text-center mb-2 text-amber-700 uppercase tracking-wide">Application UI</h3>

      {/* Hellos display - scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 bg-slate-100 border border-slate-200 rounded-lg p-2 overflow-y-auto custom-scrollbar mb-2 min-h-0"
        style={{ overflowY: 'auto' }}
      >
        {hellos.length === 0 ? (
          <div className="text-slate-400 text-xs text-center py-4">No hellos yet</div>
        ) : (
          <div className="space-y-1.5">
            {hellos.map((hello) => (
              <div
                key={hello.id}
                className={`text-xs px-2.5 py-1.5 rounded-md flex items-center justify-between ${
                  hello.source === 'ui'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-violet-100 text-violet-800'
                }`}
              >
                <span>Hello{hello.name ? ` ${hello.name}` : '!'}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  hello.source === 'ui' ? 'bg-amber-200' : 'bg-violet-200'
                }`}>
                  {hello.source === 'ui' ? 'UI' : 'LLM'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input and button - fixed at bottom */}
      <div className="flex-shrink-0 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name (optional)"
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
        />
        <button
          onClick={handlePrintHello}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium"
        >
          Print Hello
        </button>
      </div>
    </div>
  )
}
