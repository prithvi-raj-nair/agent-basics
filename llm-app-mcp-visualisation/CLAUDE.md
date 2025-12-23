# LLM Application MCP Visualization

## Project Overview

A web visualization that demonstrates how an LLM chat application works, including the Model Context Protocol (MCP) for tool integration. Built with Next.js 14, Tailwind CSS, and Zustand for state management.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **LLM**: OpenAI gpt-4o-mini (real API calls)
- **MCP**: Simulated client/server (visual representation, not actual protocol)

## Project Structure

```
llm-app-mcp-visualisation/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main page, initializes activity log
│   ├── globals.css             # Tailwind + custom scrollbar styles
│   └── api/chat/route.ts       # OpenAI API endpoint with tool definitions
│
├── components/
│   ├── layout/
│   │   └── VisualizationLayout.tsx   # Main 4-section grid with arrows
│   │
│   ├── llm-application/
│   │   ├── LLMApplication.tsx        # Container (green section)
│   │   ├── ChatUI.tsx                # Chat with scrollable history + input
│   │   ├── ChatInput.tsx             # Input field with +/> buttons
│   │   ├── ChatMessage.tsx           # Individual message bubble
│   │   ├── ResourceSelector.tsx      # Dropdown for MCP tools/resources/prompts
│   │   ├── OrchestrationLayer.tsx    # Shows processing state
│   │   ├── MCPClient.tsx             # Visual MCP client component
│   │   └── BuiltInTools.tsx          # Web search simulation display
│   │
│   ├── llm-api/
│   │   ├── LLMAPI.tsx                # Purple section with modal trigger
│   │   ├── APIModal.tsx              # Scrollable request/response history
│   │   ├── APIRequestCard.tsx        # Formatted API request display
│   │   └── APIResponseCard.tsx       # Formatted API response display
│   │
│   ├── print-hello/
│   │   ├── PrintHelloApplication.tsx # Orange section container
│   │   ├── MCPServer.tsx             # Shows tools/resources/prompts + activity modal
│   │   └── PrintHelloUI.tsx          # Button + input for manual hellos
│   │
│   ├── activity-log/
│   │   ├── SystemActivityLog.tsx     # Scrollable numbered log
│   │   └── LogEntry.tsx              # Color-coded log entries
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       └── ScrollArea.tsx
│
├── lib/
│   ├── store/
│   │   ├── activityLogStore.ts       # Activity log entries + initialization
│   │   ├── chatStore.ts              # Chat messages + loading state
│   │   ├── mcpStore.ts               # Hellos list + MCP activity
│   │   ├── apiLogStore.ts            # API request/response history
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── orchestration.ts          # Main flow: user input → LLM → tools → response
│   │   ├── mcpClient.ts              # Simulated MCP client (calls mcpServer)
│   │   ├── mcpServer.ts              # Simulated MCP server (tool implementations)
│   │   └── webSearch.ts              # Dummy web search results
│   │
│   └── types/
│       ├── activity.ts               # ActivityEntry
│       ├── chat.ts                   # ChatMessage, ToolCall, MCPResource
│       ├── mcp.ts                    # HelloEntry, MCPActivityEntry, etc.
│       ├── api.ts                    # APILogEntry, APIRequest, APIResponse
│       └── index.ts
│
├── docs/
│   ├── requirements.md               # Original requirements
│   ├── implementation-plan.md        # Detailed implementation plan
│   ├── llm-app-visual.png           # Wireframe reference
│   └── llm-io-popup.png             # API modal wireframe reference
│
├── .env.local                        # OPENAI_API_KEY
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Key Features

### 1. Chat UI
- Scrollable message history
- Input with "+" dropdown for selecting MCP resources
- Real-time processing indicator

### 2. LLM API Integration
- Real calls to OpenAI gpt-4o-mini
- Tool definitions for: `print_hello`, `get_last_hellos`, `get_hello_count`, `web_search`
- Modal shows formatted API requests/responses (not raw JSON)

### 3. MCP Simulation
- **Tools**: `print_hello(name?)`, `get_last_hellos(count)`
- **Resources**: `hello_count`
- **Prompts**: `find_name_in_hellos`
- Visual MCP Server component showing available tools/resources/prompts

### 4. System Activity Log
- Auto-populated with initialization events on start
- Logs all actions: user input, LLM calls, tool executions
- Color-coded by component
- Scrollable

### 5. Print Hello Application
- Direct UI for printing hellos (bypasses LLM)
- Shows hellos from both UI and LLM sources
- MCP Server visual with "View activity" modal

## Data Flow

```
User types message → ChatInput
    ↓
Orchestration adds to activity log
    ↓
API route called with tools defined
    ↓
OpenAI returns response (may include tool_calls)
    ↓
If tool_calls:
    - Execute each tool via mcpClient → mcpServer
    - Log each step to activity log
    - Call LLM again with tool results
    ↓
Final response displayed in ChatUI
```

## Layout Structure

```
┌─────────────────┬────┬─────────────────┬────────────────┐
│ LLM Application │ →  │ LLM API         │ System         │
│                 │    │ [View I/O btn]  │ activity log   │
│ ┌─────┬───────┐ │    ├─────────────────┤                │
│ │Chat │Orch   │ │    │ "Print hello"   │ 1. System...   │
│ │ UI  │Layer  │ │ →  │ Application     │ 2. MCP...      │
│ │     │  ↓    │ │    │                 │ 3. ...         │
│ │     │MCP    │ │    │ ┌─MCP Server──┐ │                │
│ │     │Client │ │    │ │Tools|Res|Pr│ │                │
│ │     │       │ │    │ └─────────────┘ │                │
│ │     │Built  │ │    │ ┌─App UI─────┐ │                │
│ │     │Tools  │ │    │ │ Hellos     │ │                │
│ │[___]│       │ │    │ │ [input]    │ │                │
│ └─────┴───────┘ │    │ └─────────────┘ │                │
└─────────────────┴────┴─────────────────┴────────────────┘
```

## Running the Project

```bash
cd llm-app-mcp-visualisation
npm install
npm run dev
# Open http://localhost:3000
```

## Environment Variables

```
OPENAI_API_KEY=sk-...  # Required for LLM calls
```

## Deployment

Configured for Vercel deployment:
1. Push to GitHub
2. Connect to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy

## Implementation Notes

- Arrows between components use inline SVGs for flexibility
- Chat UI input is contained within the Chat UI border (flex layout)
- Activity log auto-scrolls to bottom on new entries
- API modal shows formatted field name + description + value (not raw JSON)
- MCP is simulated in-browser (no actual MCP protocol implementation)
- Colors match the wireframe: green (LLM App), purple (LLM API), orange (Print Hello), gray (Activity Log)
