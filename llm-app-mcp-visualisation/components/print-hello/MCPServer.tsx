'use client'

import { useState } from 'react'
import { useMCPStore } from '@/lib/store/mcpStore'
import { Modal } from '@/components/ui'

export default function MCPServer() {
  const [showActivity, setShowActivity] = useState(false)
  const mcpActivity = useMCPStore((state) => state.mcpActivity)

  return (
    <>
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 shadow-sm">
        <h3 className="text-xs font-medium text-center mb-1 text-amber-700 uppercase tracking-wide">MCP Server</h3>
        <p className="text-[11px] text-slate-500 text-center mb-2 leading-relaxed">
          Exposes tools, resources, and prompts via the MCP protocol for the LLM app to use.
        </p>

        <div className="grid grid-cols-3 gap-2 text-[10px] mb-3">
          {/* Tools */}
          <div className="bg-amber-100/70 rounded-md p-2 border border-amber-200">
            <div className="font-semibold mb-1 text-amber-700">Tools</div>
            <ul className="text-slate-600 space-y-0.5">
              <li>• print_hello</li>
              <li>• get_last_hellos</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-amber-100/70 rounded-md p-2 border border-amber-200">
            <div className="font-semibold mb-1 text-amber-700">Resources</div>
            <ul className="text-slate-600 space-y-0.5">
              <li>• hello_count</li>
            </ul>
          </div>

          {/* Prompt */}
          <div className="bg-amber-100/70 rounded-md p-2 border border-amber-200">
            <div className="font-semibold mb-1 text-amber-700">Prompts</div>
            <ul className="text-slate-600 space-y-0.5">
              <li>• find_name</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setShowActivity(true)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs py-1.5 rounded-md hover:from-amber-600 hover:to-orange-600 transition-all font-medium"
        >
          View activity
        </button>
      </div>

      <Modal
        isOpen={showActivity}
        onClose={() => setShowActivity(false)}
        title="MCP Server Activity"
      >
        <div className="space-y-2">
          {mcpActivity.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity yet</p>
          ) : (
            mcpActivity.map((entry) => (
              <div key={entry.id} className="bg-white p-2 rounded border border-gray-200">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-purple-700">{entry.type}</span>
                  <span className="text-gray-500">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm">{entry.name}</div>
                <pre className="text-[10px] text-gray-600 mt-1 bg-gray-50 p-1 rounded">
                  {JSON.stringify(entry.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  )
}
