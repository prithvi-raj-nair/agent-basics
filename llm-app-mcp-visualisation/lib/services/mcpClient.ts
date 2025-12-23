// Simulated MCP Client
import { useActivityLogStore } from '@/lib/store/activityLogStore'
import { executeMCPTool, ToolResult } from './mcpServer'

export function callMCPTool(toolName: string, args: Record<string, unknown>): ToolResult {
  const { addEntry } = useActivityLogStore.getState()

  addEntry('MCP Client', `call tool: ${toolName}`)

  const result = executeMCPTool(toolName, args)

  return result
}
