'use client'

import { useChatStore } from '@/lib/store/chatStore'
import { useActivityLogStore } from '@/lib/store/activityLogStore'
import { useAPILogStore } from '@/lib/store/apiLogStore'
import { callMCPTool } from './mcpClient'
import { simulateWebSearch } from './webSearch'
import { APIRequest, APIResponse } from '@/lib/types'

interface ToolCallResponse {
  id: string
  name: string
  arguments: string
}

export function useOrchestration() {
  const addMessage = useChatStore((state) => state.addMessage)
  const setLoading = useChatStore((state) => state.setLoading)
  const selectedResources = useChatStore((state) => state.selectedResources)
  const clearSelectedResources = useChatStore((state) => state.clearSelectedResources)
  const addEntry = useActivityLogStore((state) => state.addEntry)
  const addRequest = useAPILogStore((state) => state.addRequest)
  const addResponse = useAPILogStore((state) => state.addResponse)

  const handleUserMessage = async (content: string) => {
    // Log user input
    addEntry('User Input', content.substring(0, 50) + (content.length > 50 ? '...' : ''))

    // Add user message to chat
    addMessage({ role: 'user', content })

    // Clear selected resources
    const resources = [...selectedResources]
    clearSelectedResources()

    setLoading(true)

    try {
      // Prepare context with selected resources
      let contextMessage = content
      if (resources.length > 0) {
        const resourceContext = resources
          .map((r) => `[Using ${r.type}: ${r.name} - ${r.description}]`)
          .join('\n')
        contextMessage = `${resourceContext}\n\nUser request: ${content}`
      }

      addEntry('Orchestration Layer', 'Call LLM')

      // Call LLM API
      const response = await callLLMAPI(contextMessage, addRequest, addResponse, addEntry)

      // Process response
      addEntry('Orchestration Layer', 'Parse response')

      if (response.toolCalls && response.toolCalls.length > 0) {
        // Handle tool calls
        const toolResults: string[] = []

        for (const toolCall of response.toolCalls) {
          addEntry('Orchestration Layer', `call MCP tool: ${toolCall.name}`)

          let result: string
          if (toolCall.name === 'web_search') {
            addEntry('Built-in Tools', 'Web search called')
            const args = JSON.parse(toolCall.arguments)
            result = simulateWebSearch(args.query)
            addEntry('Built-in Tools', 'Web search completed')
          } else {
            const args = JSON.parse(toolCall.arguments)
            const toolResult = callMCPTool(toolCall.name, args)
            result = toolResult.result
          }

          toolResults.push(`[${toolCall.name}]: ${result}`)
        }

        // Call LLM again with tool results
        addEntry('Orchestration Layer', 'Call LLM with tool results')
        const finalResponse = await callLLMWithToolResults(
          contextMessage,
          response.toolCalls,
          toolResults,
          addRequest,
          addResponse,
          addEntry
        )

        addMessage({ role: 'assistant', content: finalResponse })
      } else {
        // No tool calls, just add the response
        addMessage({ role: 'assistant', content: response.content })
      }
    } catch (error) {
      console.error('Error in orchestration:', error)
      addMessage({
        role: 'assistant',
        content: 'Sorry, an error occurred while processing your request.',
      })
    } finally {
      setLoading(false)
    }
  }

  return { handleUserMessage }
}

async function callLLMAPI(
  message: string,
  addRequest: (req: APIRequest) => void,
  addResponse: (res: APIResponse) => void,
  addEntry: (component: string, action: string) => void
): Promise<{ content: string; toolCalls?: ToolCallResponse[] }> {
  const request: APIRequest = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant in an LLM application visualization demo. You have access to tools for a "Print Hello" application and web search. Use the tools when appropriate to help the user.`,
      },
      { role: 'user', content: message },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'print_hello',
          description: 'Prints hello with an optional name',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Optional name to greet' },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_last_hellos',
          description: 'Gets the last N printed hellos',
          parameters: {
            type: 'object',
            properties: {
              count: { type: 'number', description: 'Number of hellos to retrieve' },
            },
            required: ['count'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_hello_count',
          description: 'Gets the total number of hellos in the session',
          parameters: {
            type: 'object',
            properties: {},
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'web_search',
          description: 'Searches the web for information (simulation)',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
            },
            required: ['query'],
          },
        },
      },
    ],
  }

  addRequest(request)
  addEntry('LLM API', 'request received')

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  const data: APIResponse = await res.json()
  addResponse(data)
  addEntry('LLM API', 'response sent')

  const choice = data.choices[0]
  if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
    return {
      content: choice.message.content || '',
      toolCalls: choice.message.tool_calls.map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments,
      })),
    }
  }

  return { content: choice.message.content || '' }
}

async function callLLMWithToolResults(
  originalMessage: string,
  toolCalls: ToolCallResponse[],
  toolResults: string[],
  addRequest: (req: APIRequest) => void,
  addResponse: (res: APIResponse) => void,
  addEntry: (component: string, action: string) => void
): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `You are a helpful assistant in an LLM application visualization demo.`,
    },
    { role: 'user', content: originalMessage },
    {
      role: 'assistant',
      content: null,
      tool_calls: toolCalls.map((tc) => ({
        id: tc.id,
        type: 'function',
        function: { name: tc.name, arguments: tc.arguments },
      })),
    },
    ...toolCalls.map((tc, i) => ({
      role: 'tool',
      tool_call_id: tc.id,
      content: toolResults[i],
    })),
  ]

  const request: APIRequest = {
    model: 'gpt-4o-mini',
    messages: messages as APIRequest['messages'],
  }

  addRequest(request)
  addEntry('LLM API', 'request received')

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  const data: APIResponse = await res.json()
  addResponse(data)
  addEntry('LLM API', 'response sent')

  return data.choices[0].message.content || ''
}
