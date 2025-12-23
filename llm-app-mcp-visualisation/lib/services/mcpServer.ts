// Simulated MCP Server for Print Hello application
import { useMCPStore } from '@/lib/store/mcpStore'
import { useActivityLogStore } from '@/lib/store/activityLogStore'

export interface ToolResult {
  success: boolean
  result: string
}

// Tool: print_hello
export function executePrintHello(name?: string): ToolResult {
  const { addHello, addMCPActivity } = useMCPStore.getState()
  const { addEntry } = useActivityLogStore.getState()

  addEntry('Print Hello MCP', 'tool call received: print_hello')
  addMCPActivity('tool_call', 'print_hello', { name })

  addHello(name, 'llm')

  addEntry('Print Hello MCP', 'tool executed: print_hello')
  addMCPActivity('tool_result', 'print_hello', { success: true, name })
  addEntry('Print Hello MCP', 'tool response sent')

  return {
    success: true,
    result: name ? `Successfully printed "Hello ${name}"` : 'Successfully printed "Hello"',
  }
}

// Tool: get_last_hellos
export function executeGetLastHellos(count: number): ToolResult {
  const { getLastNHellos, addMCPActivity } = useMCPStore.getState()
  const { addEntry } = useActivityLogStore.getState()

  addEntry('Print Hello MCP', 'tool call received: get_last_hellos')
  addMCPActivity('tool_call', 'get_last_hellos', { count })

  const hellos = getLastNHellos(count)
  const result = hellos.map((h) => h.name ? `Hello ${h.name}` : 'Hello').join(', ') || 'No hellos found'

  addEntry('Print Hello MCP', 'tool executed: get_last_hellos')
  addMCPActivity('tool_result', 'get_last_hellos', { count, result: hellos })
  addEntry('Print Hello MCP', 'tool response sent')

  return {
    success: true,
    result: `Last ${count} hellos: ${result}`,
  }
}

// Resource: get_hello_count
export function getHelloCountResource(): ToolResult {
  const { getHelloCount, addMCPActivity } = useMCPStore.getState()
  const { addEntry } = useActivityLogStore.getState()

  addEntry('Print Hello MCP', 'resource read: hello_count')
  addMCPActivity('resource_read', 'hello_count', {})

  const count = getHelloCount()

  return {
    success: true,
    result: `Total hellos in session: ${count}`,
  }
}

// Execute tool by name
export function executeMCPTool(toolName: string, args: Record<string, unknown>): ToolResult {
  switch (toolName) {
    case 'print_hello':
      return executePrintHello(args.name as string | undefined)
    case 'get_last_hellos':
      return executeGetLastHellos(args.count as number)
    case 'get_hello_count':
      return getHelloCountResource()
    default:
      return {
        success: false,
        result: `Unknown tool: ${toolName}`,
      }
  }
}
