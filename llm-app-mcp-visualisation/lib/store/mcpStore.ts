import { create } from 'zustand'
import { HelloEntry, MCPActivityEntry } from '@/lib/types'

interface MCPState {
  hellos: HelloEntry[]
  isInitialized: boolean
  mcpActivity: MCPActivityEntry[]
  nextActivityId: number
  addHello: (name: string | undefined, source: 'ui' | 'llm') => void
  getLastNHellos: (n: number) => HelloEntry[]
  getHelloCount: () => number
  addMCPActivity: (type: MCPActivityEntry['type'], name: string, data: unknown) => void
  initialize: () => void
}

export const useMCPStore = create<MCPState>((set, get) => ({
  hellos: [],
  isInitialized: false,
  mcpActivity: [],
  nextActivityId: 1,

  addHello: (name, source) => {
    const entry: HelloEntry = {
      id: crypto.randomUUID(),
      name,
      source,
      timestamp: new Date(),
    }
    set((state) => ({
      hellos: [...state.hellos, entry],
    }))
  },

  getLastNHellos: (n) => {
    const { hellos } = get()
    return hellos.slice(-n)
  },

  getHelloCount: () => {
    return get().hellos.length
  },

  addMCPActivity: (type, name, data) => {
    const { nextActivityId } = get()
    const entry: MCPActivityEntry = {
      id: nextActivityId,
      type,
      name,
      data,
      timestamp: new Date(),
    }
    set((state) => ({
      mcpActivity: [...state.mcpActivity, entry],
      nextActivityId: state.nextActivityId + 1,
    }))
  },

  initialize: () => {
    set({ isInitialized: true })
  },
}))
