'use client'

import MCPServer from './MCPServer'
import PrintHelloUI from './PrintHelloUI'

export default function PrintHelloApplication() {
  return (
    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 h-full flex flex-col border border-amber-300 shadow-sm">
      <h2 className="text-base font-semibold mb-3 text-center text-amber-800">&quot;Print hello&quot; Application</h2>

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
