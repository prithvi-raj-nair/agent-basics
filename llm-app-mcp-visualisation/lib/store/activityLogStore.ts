import { create } from 'zustand'
import { ActivityEntry } from '@/lib/types'

interface ActivityLogState {
  entries: ActivityEntry[]
  nextId: number
  addEntry: (component: string, action: string) => void
  initializeEntries: () => void
  clearEntries: () => void
}

export const useActivityLogStore = create<ActivityLogState>((set, get) => ({
  entries: [],
  nextId: 1,

  addEntry: (component: string, action: string) => {
    const { nextId } = get()
    const entry: ActivityEntry = {
      id: nextId,
      component,
      action,
      timestamp: new Date(),
    }
    set((state) => ({
      entries: [...state.entries, entry],
      nextId: state.nextId + 1,
    }))
  },

  initializeEntries: () => {
    const { entries: currentEntries } = get()
    if (currentEntries.length > 0) return // Already initialized

    const initialActions = [
      { component: 'System', action: 'Application initialized' },
      { component: 'MCP Client', action: 'Initializing' },
      { component: 'MCP Client', action: 'Connecting to Print Hello MCP Server' },
      { component: 'Print Hello MCP', action: 'Server initialized' },
      { component: 'Print Hello MCP', action: 'Tools registered: print_hello, get_last_hellos' },
      { component: 'Print Hello MCP', action: 'Resources registered: hello_count' },
      { component: 'Print Hello MCP', action: 'Prompts registered: find_name_in_hellos' },
      { component: 'MCP Client', action: 'Connection established' },
      { component: 'Built-in Tools', action: 'Web Search simulation ready' },
      { component: 'System', action: 'Ready for user input' },
    ]

    let id = 1
    const newEntries: ActivityEntry[] = initialActions.map((item) => ({
      id: id++,
      component: item.component,
      action: item.action,
      timestamp: new Date(),
    }))

    set({ entries: newEntries, nextId: id })
  },

  clearEntries: () => set({ entries: [], nextId: 1 }),
}))
