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
    <div className="bg-[#ffb74d] rounded-lg p-3 h-full flex flex-col border border-orange-400">
      <h3 className="text-sm font-semibold text-center mb-2">&quot;Print hello&quot; Application UI</h3>

      {/* Hellos display - scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 bg-white/50 rounded p-2 overflow-y-auto custom-scrollbar mb-2 min-h-0"
        style={{ overflowY: 'auto' }}
      >
        {hellos.length === 0 ? (
          <div className="text-gray-500 text-xs text-center">No hellos yet</div>
        ) : (
          <div className="space-y-1">
            {hellos.map((hello) => (
              <div
                key={hello.id}
                className={`text-xs px-2 py-1 rounded ${
                  hello.source === 'ui'
                    ? 'bg-orange-200'
                    : 'bg-purple-200'
                }`}
              >
                Hello{hello.name ? ` ${hello.name}` : ''}
                <span className="text-[9px] text-gray-500 ml-1">
                  ({hello.source === 'ui' ? 'UI' : 'LLM'})
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
          placeholder="(Optional) Type Name to say hello"
          className="w-full text-xs px-2 py-1 rounded border border-orange-300 bg-white/80"
        />
        <button
          onClick={handlePrintHello}
          className="w-full bg-orange-600 text-white text-xs py-1.5 rounded hover:bg-orange-700"
        >
          Print Hello
        </button>
      </div>
    </div>
  )
}
