import { create } from 'zustand'
import { ChatMessage, MCPResource } from '@/lib/types'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  selectedResources: MCPResource[]
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void
  setLoading: (loading: boolean) => void
  addSelectedResource: (resource: MCPResource) => void
  removeSelectedResource: (name: string) => void
  clearSelectedResources: () => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  selectedResources: [],

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    set((state) => ({
      messages: [...state.messages, newMessage],
    }))
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }))
  },

  setLoading: (loading) => set({ isLoading: loading }),

  addSelectedResource: (resource) => {
    set((state) => ({
      selectedResources: [...state.selectedResources, resource],
    }))
  },

  removeSelectedResource: (name) => {
    set((state) => ({
      selectedResources: state.selectedResources.filter((r) => r.name !== name),
    }))
  },

  clearSelectedResources: () => set({ selectedResources: [] }),

  clearMessages: () => set({ messages: [] }),
}))
