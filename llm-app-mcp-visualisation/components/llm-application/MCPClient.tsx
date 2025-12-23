'use client'

export default function MCPClient() {
  return (
    <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200 shadow-sm h-full flex flex-col">
      <h4 className="text-[10px] font-medium text-center mb-1 text-emerald-700 uppercase tracking-wide">MCP Client</h4>
      <p className="text-[11px] text-slate-500 text-center leading-relaxed">
        Connects to MCP servers to fetch tools, resources, and prompts for the LLM.
      </p>
    </div>
  )
}
