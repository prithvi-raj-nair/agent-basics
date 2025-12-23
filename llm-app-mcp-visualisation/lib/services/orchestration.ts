'use client'

import { useChatStore } from '@/lib/store/chatStore'
import { useActivityLogStore } from '@/lib/store/activityLogStore'
import { useAPILogStore } from '@/lib/store/apiLogStore'
import { callMCPTool } from './mcpClient'
import { simulateWebSearch } from './webSearch'
import { APIRequest, APIResponse, ChatMessage } from '@/lib/types'

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
  const getMessages = () => useChatStore.getState().messages
  const addEntry = useActivityLogStore((state) => state.addEntry)
  const getNextStepNumber = () => useActivityLogStore.getState().nextId
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
      let messageWithContext = content
      if (resources.length > 0) {
        const resourceContext = resources
          .map((r) => `[Using ${r.type}: ${r.name} - ${r.description}]`)
          .join('\n')
        messageWithContext = `${resourceContext}\n\nUser request: ${content}`
      }

      addEntry('Orchestration Layer', 'Call LLM')

      // Get all messages from chat history for context
      const chatMessages = getMessages()

      // Call LLM API with full message history
      const response = await callLLMAPI(chatMessages, messageWithContext, addRequest, addResponse, addEntry, getNextStepNumber)

      // Process response
      addEntry('Orchestration Layer', 'Parse response')

      if (response.toolCalls && response.toolCalls.length > 0) {
        // Helper function to execute a tool call
        const executeToolCall = async (toolCall: ToolCallResponse): Promise<string> => {
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
          return `[${toolCall.name}]: ${result}`
        }

        // Handle initial tool calls
        const toolResults: string[] = []

        for (const toolCall of response.toolCalls) {
          addEntry('Orchestration Layer', `call MCP tool: ${toolCall.name}`)
          const result = await executeToolCall(toolCall)
          toolResults.push(result)
        }

        // Call LLM again with tool results (will loop if more tools needed)
        addEntry('Orchestration Layer', 'Call LLM with tool results')
        const finalResponse = await callLLMWithToolResults(
          chatMessages,
          messageWithContext,
          response.toolCalls,
          toolResults,
          addRequest,
          addResponse,
          addEntry,
          getNextStepNumber,
          executeToolCall
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
  chatHistory: ChatMessage[],
  currentMessage: string,
  addRequest: (req: APIRequest, stepNumber?: number) => void,
  addResponse: (res: APIResponse, stepNumber?: number) => void,
  addEntry: (component: string, action: string) => void,
  getNextStepNumber: () => number
): Promise<{ content: string; toolCalls?: ToolCallResponse[] }> {
  // Build messages array from chat history (excluding the just-added user message)
  const historyMessages = chatHistory.slice(0, -1).map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  const request: APIRequest = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant in an LLM application visualization demo. You have access to tools for a "Print Hello" application and web search. Use the tools when appropriate to help the user.`,
      },
      ...historyMessages,
      { role: 'user', content: currentMessage },
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

  const requestStepNumber = getNextStepNumber()
  addRequest(request, requestStepNumber)
  addEntry('LLM API', 'request received')

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  const data: APIResponse = await res.json()
  const responseStepNumber = getNextStepNumber()
  addResponse(data, responseStepNumber)
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
  chatHistory: ChatMessage[],
  originalMessage: string,
  toolCalls: ToolCallResponse[],
  toolResults: string[],
  addRequest: (req: APIRequest, stepNumber?: number) => void,
  addResponse: (res: APIResponse, stepNumber?: number) => void,
  addEntry: (component: string, action: string) => void,
  getNextStepNumber: () => number,
  executeToolCall: (toolCall: ToolCallResponse) => Promise<string>
): Promise<string> {
  // Build messages array from chat history (excluding the just-added user message)
  const historyMessages = chatHistory.slice(0, -1).map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  // Keep track of all tool calls and results for multi-step execution
  let allToolCalls = [...toolCalls]
  let allToolResults = [...toolResults]

  // Loop until LLM returns a final response without tool calls
  while (true) {
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant in an LLM application visualization demo. You have access to tools for a "Print Hello" application and web search. Use the tools when appropriate to help the user. If you need to call multiple tools in sequence to complete a task, do so.`,
      },
      ...historyMessages,
      { role: 'user', content: originalMessage },
      {
        role: 'assistant',
        content: null,
        tool_calls: allToolCalls.map((tc) => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.name, arguments: tc.arguments },
        })),
      },
      ...allToolCalls.map((tc, i) => ({
        role: 'tool',
        tool_call_id: tc.id,
        content: allToolResults[i],
      })),
    ]

    const request: APIRequest = {
      model: 'gpt-4o-mini',
      messages: messages as APIRequest['messages'],
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

    const requestStepNumber = getNextStepNumber()
    addRequest(request, requestStepNumber)
    addEntry('LLM API', 'request received')

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    const data: APIResponse = await res.json()
    const responseStepNumber = getNextStepNumber()
    addResponse(data, responseStepNumber)
    addEntry('LLM API', 'response sent')

    const choice = data.choices[0]

    // Check if LLM wants to call more tools
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const newToolCalls = choice.message.tool_calls.map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments,
      }))

      // Execute the new tool calls
      const newToolResults: string[] = []
      for (const toolCall of newToolCalls) {
        addEntry('Orchestration Layer', `call MCP tool: ${toolCall.name}`)
        const result = await executeToolCall(toolCall)
        newToolResults.push(result)
      }

      // Add new tool calls and results to the accumulated list
      allToolCalls = [...allToolCalls, ...newToolCalls]
      allToolResults = [...allToolResults, ...newToolResults]

      addEntry('Orchestration Layer', 'Call LLM with additional tool results')
      // Continue the loop to call LLM again
    } else {
      // No more tool calls, return the final response
      return choice.message.content || ''
    }
  }
}
