'use client'

import { Modal } from '@/components/ui/Modal'

interface HowToUseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to LLM App Visualiser">
      <div className="space-y-4 text-slate-700">
        <p className="text-sm">
          This webapp lets you visualise the different components that surround an LLM
          to achieve the LLM app experience that you use.
        </p>

        <div>
          <h3 className="font-semibold text-slate-800 mb-2">Quick Start</h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-slate-700 text-sm mb-1">Chatting and using tools</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-slate-600 ml-2">
                <li>Type into the LLM chat UI to send message</li>
                <li>Use the &apos;+&apos; to access tools, prompts and resources available to the LLM app</li>
                <li>Notice the UI for prompt templates</li>
                <li>Try saying hi to different names and using the prompt template to find</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 text-sm mb-1">LLM API calls visualisation</h4>
              <p className="text-sm text-slate-600 ml-2">
                View the inputs and outputs for the LLM API to understand how tool calling and responses are managed
              </p>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 text-sm mb-1">System activity log</h4>
              <p className="text-sm text-slate-600 ml-2">
                Read through linear flow of events across the system to understand how components interact
              </p>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 text-sm mb-1">Interact with the &quot;Print hello app&quot;</h4>
              <p className="text-sm text-slate-600 ml-2">
                A simulation of a third party app - watch how the changes you make there reflects in the tool calls made by the LLM
              </p>
              <p className="text-xs text-slate-500 ml-4 mt-1 italic">
                Example: total count of hellos will have latest based on LLM calls as well as UI interaction
              </p>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 text-sm mb-1">MCP server activity</h4>
              <p className="text-sm text-slate-600 ml-2">
                View inputs and outputs of the server
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
