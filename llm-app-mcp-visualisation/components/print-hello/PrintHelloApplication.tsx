'use client'

import MCPServer from './MCPServer'
import PrintHelloUI from './PrintHelloUI'

export default function PrintHelloApplication() {
  return (
    <div className="bg-[#ffe0b2] rounded-lg p-4 h-full flex flex-col border border-orange-400">
      <h2 className="text-lg font-bold mb-3 text-center">&quot;Print hello&quot; Application</h2>

      <div className="flex flex-col gap-3 flex-1 min-h-0">
        {/* MCP Server - Top */}
        <MCPServer />

        {/* Print Hello UI - Bottom */}
        <div className="flex-1 min-h-0">
          <PrintHelloUI />
        </div>
      </div>
    </div>
  )
}
