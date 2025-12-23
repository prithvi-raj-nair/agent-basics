'use client'

import { useChatStore } from '@/lib/store/chatStore'
import { MCPResource } from '@/lib/types'
import { useEffect, useRef } from 'react'

interface ResourceSelectorProps {
  onClose: () => void
}

const availableResources: MCPResource[] = [
  // Tools
  { type: 'tool', name: 'print_hello', description: 'Print hello with optional name' },
  { type: 'tool', name: 'get_last_hellos', description: 'Get last N printed hellos' },
  { type: 'tool', name: 'web_search', description: 'Search the web (simulation)' },
  // Resources
  { type: 'resource', name: 'hello_count', description: 'Number of hellos in session' },
  // Prompts
  {
    type: 'prompt',
    name: 'find_name_in_hellos',
    description: 'Find a name in all hellos',
    parameters: ['name'],
    template: 'First, get the hello_count from the resource to know how many hellos exist. Then use get_last_hellos with that count to fetch all hellos. Finally, search through them to find any that mention "{name}".'
  },
]

export default function ResourceSelector({ onClose }: ResourceSelectorProps) {
  const addSelectedResource = useChatStore((state) => state.addSelectedResource)
  const selectedResources = useChatStore((state) => state.selectedResources)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleSelect = (resource: MCPResource) => {
    if (!selectedResources.find((r) => r.name === resource.name)) {
      addSelectedResource(resource)
    }
    onClose()
  }

  const tools = availableResources.filter((r) => r.type === 'tool')
  const resources = availableResources.filter((r) => r.type === 'resource')
  const prompts = availableResources.filter((r) => r.type === 'prompt')

  return (
    <div ref={dropdownRef} className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-gray-300 z-10">
      <div className="p-2 max-h-48 overflow-auto custom-scrollbar">
        {/* Tools */}
        <div className="mb-2">
          <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Tools</div>
          {tools.map((r) => (
            <button
              key={r.name}
              onClick={() => handleSelect(r)}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
            >
              <div className="font-medium">{r.name}</div>
              <div className="text-gray-500 text-[10px]">{r.description}</div>
            </button>
          ))}
        </div>

        {/* Resources */}
        <div className="mb-2">
          <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Resources</div>
          {resources.map((r) => (
            <button
              key={r.name}
              onClick={() => handleSelect(r)}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
            >
              <div className="font-medium">{r.name}</div>
              <div className="text-gray-500 text-[10px]">{r.description}</div>
            </button>
          ))}
        </div>

        {/* Prompts */}
        <div>
          <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Prompts</div>
          {prompts.map((r) => (
            <button
              key={r.name}
              onClick={() => handleSelect(r)}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
            >
              <div className="font-medium">{r.name}</div>
              <div className="text-gray-500 text-[10px]">{r.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
