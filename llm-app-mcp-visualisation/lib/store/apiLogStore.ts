import { create } from 'zustand'
import { APILogEntry, APIRequest, APIResponse } from '@/lib/types'

interface APILogState {
  entries: APILogEntry[]
  addRequest: (request: APIRequest) => void
  addResponse: (response: APIResponse) => void
  clearEntries: () => void
}

export const useAPILogStore = create<APILogState>((set) => ({
  entries: [],

  addRequest: (request) => {
    const entry: APILogEntry = {
      id: crypto.randomUUID(),
      type: 'request',
      timestamp: new Date(),
      data: request,
    }
    set((state) => ({
      entries: [...state.entries, entry],
    }))
  },

  addResponse: (response) => {
    const entry: APILogEntry = {
      id: crypto.randomUUID(),
      type: 'response',
      timestamp: new Date(),
      data: response,
    }
    set((state) => ({
      entries: [...state.entries, entry],
    }))
  },

  clearEntries: () => set({ entries: [] }),
}))
