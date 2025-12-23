import { create } from 'zustand'
import { APILogEntry, APIRequest, APIResponse } from '@/lib/types'

interface APILogState {
  entries: APILogEntry[]
  addRequest: (request: APIRequest, stepNumber?: number) => void
  addResponse: (response: APIResponse, stepNumber?: number) => void
  clearEntries: () => void
}

export const useAPILogStore = create<APILogState>((set) => ({
  entries: [],

  addRequest: (request, stepNumber) => {
    const entry: APILogEntry = {
      id: crypto.randomUUID(),
      type: 'request',
      timestamp: new Date(),
      data: request,
      stepNumber,
    }
    set((state) => ({
      entries: [...state.entries, entry],
    }))
  },

  addResponse: (response, stepNumber) => {
    const entry: APILogEntry = {
      id: crypto.randomUUID(),
      type: 'response',
      timestamp: new Date(),
      data: response,
      stepNumber,
    }
    set((state) => ({
      entries: [...state.entries, entry],
    }))
  },

  clearEntries: () => set({ entries: [] }),
}))
