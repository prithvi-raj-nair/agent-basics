export interface APILogEntry {
  id: string
  type: 'request' | 'response'
  timestamp: Date
  data: APIRequest | APIResponse
  stepNumber?: number // Activity log step number
}

export interface APIRequest {
  model: string
  messages: Array<{
    role: string
    content: string
    tool_calls?: unknown[]
    tool_call_id?: string
  }>
  tools?: unknown[]
  temperature?: number
}

export interface APIResponse {
  id: string
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string | null
      tool_calls?: Array<{
        id: string
        type: string
        function: {
          name: string
          arguments: string
        }
      }>
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
