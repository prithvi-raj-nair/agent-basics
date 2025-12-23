'use client'

export default function BuiltInTools() {
  return (
    <div className="bg-[#c5e1a5] rounded-lg p-2 border border-green-500 h-full">
      <h4 className="text-xs font-semibold text-center mb-1">Built in tools</h4>
      <div className="text-[10px] text-gray-600">
        <div>Web search simulation</div>
        <ul className="list-disc list-inside text-[9px] text-gray-500">
          <li>search text</li>
        </ul>
      </div>
    </div>
  )
}
