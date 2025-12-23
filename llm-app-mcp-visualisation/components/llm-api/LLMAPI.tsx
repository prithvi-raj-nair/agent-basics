'use client'

import { useState, useEffect, useRef } from 'react'
import { useAPILogStore } from '@/lib/store/apiLogStore'
import { Modal } from '@/components/ui'
import APIRequestCard from './APIRequestCard'
import APIResponseCard from './APIResponseCard'
import { APIRequest, APIResponse } from '@/lib/types'

export default function LLMAPI() {
  const [showModal, setShowModal] = useState(false)
  const entries = useAPILogStore((state) => state.entries)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when modal opens
  useEffect(() => {
    if (showModal && scrollRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 50)
    }
  }, [showModal])

  return (
    <>
      <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl p-4 border border-violet-300 shadow-sm">
        <h2 className="text-base font-semibold mb-3 text-center text-violet-800">LLM API</h2>
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2.5 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all font-medium text-sm shadow-sm"
        >
          View input/output
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="LLM API Input/Output"
        scrollRef={scrollRef}
      >
        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No API calls yet</p>
          ) : (
            entries.map((entry) => (
              entry.type === 'request' ? (
                <APIRequestCard
                  key={entry.id}
                  request={entry.data as APIRequest}
                  timestamp={entry.timestamp}
                  stepNumber={entry.stepNumber}
                />
              ) : (
                <APIResponseCard
                  key={entry.id}
                  response={entry.data as APIResponse}
                  timestamp={entry.timestamp}
                  stepNumber={entry.stepNumber}
                />
              )
            ))
          )}
        </div>
      </Modal>
    </>
  )
}
