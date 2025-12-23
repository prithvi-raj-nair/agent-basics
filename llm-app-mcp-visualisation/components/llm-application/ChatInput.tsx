'use client'

import { useState, useMemo } from 'react'
import { useChatStore } from '@/lib/store/chatStore'
import { useOrchestration } from '@/lib/services/orchestration'
import ResourceSelector from './ResourceSelector'

export default function ChatInput() {
  const [input, setInput] = useState('')
  const [showSelector, setShowSelector] = useState(false)
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({})
  const isLoading = useChatStore((state) => state.isLoading)
  const selectedResources = useChatStore((state) => state.selectedResources)
  const removeSelectedResource = useChatStore((state) => state.removeSelectedResource)
  const { handleUserMessage } = useOrchestration()

  // Find any prompt with parameters that's selected
  const promptWithParams = useMemo(() => {
    return selectedResources.find(r => r.type === 'prompt' && r.parameters && r.parameters.length > 0)
  }, [selectedResources])

  // Check if all required parameters are filled
  const allParamsFilled = useMemo(() => {
    if (!promptWithParams?.parameters) return true
    return promptWithParams.parameters.every(p => parameterValues[p]?.trim())
  }, [promptWithParams, parameterValues])

  const handleSubmit = async () => {
    if (isLoading) return

    let message = input.trim()

    // If there's a prompt with a template, use it with substituted parameters
    if (promptWithParams?.template) {
      let template = promptWithParams.template
      promptWithParams.parameters?.forEach(param => {
        template = template.replace(`{${param}}`, parameterValues[param] || '')
      })
      message = template + (message ? `\n\nAdditional context: ${message}` : '')
    }

    if (!message) return

    setInput('')
    setParameterValues({})
    await handleUserMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSubmit = promptWithParams ? allParamsFilled : input.trim().length > 0

  return (
    <div className="relative">
      {/* Selected resources badges */}
      {selectedResources.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {selectedResources.map((r) => (
            <span
              key={r.name}
              className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded flex items-center gap-1"
            >
              {r.name}
              <button
                onClick={() => {
                  removeSelectedResource(r.name)
                  setParameterValues({})
                }}
                className="hover:text-purple-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Show prompt template when a prompt is selected */}
      {promptWithParams?.template && (
        <div className="mb-2 bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-[9px] font-medium text-purple-600 uppercase tracking-wide mb-1">Prompt Template</div>
          <div className="text-[11px] text-purple-800 leading-relaxed">
            {(() => {
              let displayTemplate = promptWithParams.template
              promptWithParams.parameters?.forEach(param => {
                const value = parameterValues[param]
                if (value) {
                  displayTemplate = displayTemplate.replace(
                    `{${param}}`,
                    `<span class="bg-purple-200 px-1 rounded font-medium">${value}</span>`
                  )
                } else {
                  displayTemplate = displayTemplate.replace(
                    `{${param}}`,
                    `<span class="bg-purple-100 px-1 rounded text-purple-500">{${param}}</span>`
                  )
                }
              })
              return <span dangerouslySetInnerHTML={{ __html: displayTemplate }} />
            })()}
          </div>
        </div>
      )}

      {/* Parameter input for prompts with parameters */}
      {promptWithParams?.parameters && (
        <div className="mb-2 space-y-1">
          {promptWithParams.parameters.map(param => (
            <div key={param} className="flex items-center gap-2">
              <label className="text-[10px] text-gray-700 font-medium min-w-[50px]">{param}:</label>
              <input
                type="text"
                value={parameterValues[param] || ''}
                onChange={(e) => setParameterValues(prev => ({ ...prev, [param]: e.target.value }))}
                placeholder={`Enter ${param}`}
                className="flex-1 text-xs bg-white/90 rounded px-2 py-1 outline-none border border-gray-300 focus:border-purple-400"
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={promptWithParams ? "Additional context (optional)" : "Type a message..."}
          className="flex-1 text-xs bg-transparent outline-none px-2 text-slate-700 placeholder:text-slate-400"
          disabled={isLoading}
        />
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="w-7 h-7 bg-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-300 flex items-center justify-center transition-colors"
        >
          +
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !canSubmit}
          className="w-7 h-7 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>

      {/* Resource selector dropdown */}
      {showSelector && (
        <ResourceSelector onClose={() => setShowSelector(false)} />
      )}
    </div>
  )
}
