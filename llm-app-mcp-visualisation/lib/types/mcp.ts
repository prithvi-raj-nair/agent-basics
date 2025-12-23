export interface HelloEntry {
  id: string
  name?: string
  source: 'ui' | 'llm'
  timestamp: Date
}

export interface MCPActivityEntry {
  id: number
  type: 'tool_call' | 'tool_result' | 'resource_read'
  name: string
  data: unknown
  timestamp: Date
}

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export interface MCPResourceDef {
  name: string
  description: string
}

export interface MCPPrompt {
  name: string
  description: string
  template: string
}
