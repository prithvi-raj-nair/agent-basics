'use client'

export default function BuiltInTools() {
  return (
    <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200 shadow-sm h-full flex flex-col">
      <h4 className="text-[10px] font-medium text-center mb-1 text-emerald-700 uppercase tracking-wide">Built-in Tools</h4>
      <p className="text-[11px] text-slate-500 text-center mb-1 leading-relaxed">
        Tools built into the app (not from MCP).
      </p>
      <div className="text-[11px] text-slate-600 bg-emerald-100/50 rounded p-1.5 border border-emerald-200 mt-auto">
        <div className="font-medium text-slate-700 text-center">Web Search <span className="text-slate-400">(simulated)</span></div>
      </div>
    </div>
  )
}
