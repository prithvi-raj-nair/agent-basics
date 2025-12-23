'use client'

import { useState } from 'react'
import { useMCPStore } from '@/lib/store/mcpStore'
import { Modal } from '@/components/ui'

export default function MCPServer() {
  const [showActivity, setShowActivity] = useState(false)
  const mcpActivity = useMCPStore((state) => state.mcpActivity)

  return (
    <>
      <div className="bg-[#ffcc80] rounded-lg p-3 border border-orange-400">
        <h3 className="text-sm font-semibold text-center mb-2">&quot;Print hello&quot; MCP Server</h3>

        <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
          {/* Tools */}
          <div>
            <div className="font-semibold mb-1">Tools</div>
            <ul className="text-gray-600 space-y-0.5">
              <li>• Print hello (name)</li>
              <li>• Get last (N) hello</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="font-semibold mb-1">Resources</div>
            <ul className="text-gray-600 space-y-0.5">
              <li>• Number of hellos</li>
            </ul>
          </div>

          {/* Prompt */}
          <div>
            <div className="font-semibold mb-1">Prompt</div>
            <ul className="text-gray-600 space-y-0.5">
              <li>• Find all names</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setShowActivity(true)}
          className="w-full bg-purple-500 text-white text-xs py-1 rounded hover:bg-purple-600"
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
