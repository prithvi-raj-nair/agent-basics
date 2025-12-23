'use client'

import { useState } from 'react'
import { useAPILogStore } from '@/lib/store/apiLogStore'
import { Modal } from '@/components/ui'
import APIRequestCard from './APIRequestCard'
import APIResponseCard from './APIResponseCard'
import { APIRequest, APIResponse } from '@/lib/types'

export default function LLMAPI() {
  const [showModal, setShowModal] = useState(false)
  const entries = useAPILogStore((state) => state.entries)

  return (
    <>
      <div className="bg-[#d1c4e9] rounded-lg p-4 border border-purple-400">
        <h2 className="text-lg font-bold mb-3 text-center">LLM API</h2>
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          View input/output
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="LLM API Input/Output"
      >
        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No API calls yet</p>
          ) : (
            entries.map((entry) => (
              entry.type === 'request' ? (
                <APIRequestCard key={entry.id} request={entry.data as APIRequest} timestamp={entry.timestamp} />
              ) : (
                <APIResponseCard key={entry.id} response={entry.data as APIResponse} timestamp={entry.timestamp} />
              )
            ))
          )}
        </div>
      </Modal>
    </>
  )
}
