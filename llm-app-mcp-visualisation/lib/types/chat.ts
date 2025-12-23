export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  result?: string
}

export interface MCPResource {
  type: 'tool' | 'resource' | 'prompt'
  name: string
  description: string
  parameters?: string[] // Parameter names like ['name'] for prompts with {name} placeholders
  template?: string // The prompt template with placeholders like "Find {name} in hellos"
}
