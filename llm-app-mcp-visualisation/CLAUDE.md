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
│   │   └── VisualizationLayout.tsx   # Main 3-column grid layout
│   │
│   ├── llm-application/
│   │   ├── LLMApplication.tsx        # Container (green section)
│   │   ├── ChatUI.tsx                # Chat with scrollable history + input
│   │   ├── ChatInput.tsx             # Input field with +/send buttons, prompt template preview
│   │   ├── ChatMessage.tsx           # Individual message bubble
│   │   ├── ResourceSelector.tsx      # Dropdown for MCP tools/resources/prompts
│   │   ├── OrchestrationLayer.tsx    # Shows processing state + description
│   │   ├── MCPClient.tsx             # Visual MCP client with description
│   │   └── BuiltInTools.tsx          # Web search simulation with description
│   │
│   ├── llm-api/
│   │   ├── LLMAPI.tsx                # Purple section with modal trigger
│   │   ├── APIModal.tsx              # Scrollable request/response history
│   │   ├── APIRequestCard.tsx        # Formatted API request with expandable tools
│   │   └── APIResponseCard.tsx       # Formatted API response display
│   │
│   ├── print-hello/
│   │   ├── PrintHelloApplication.tsx # Orange section container
│   │   ├── MCPServer.tsx             # Shows tools/resources/prompts + description + activity modal
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
│   │   ├── apiLogStore.ts            # API request/response history with step numbers
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── orchestration.ts          # Main flow: user input → LLM → tools → response (supports multi-step)
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
│   ├── feedback1.md                  # First round of feedback
│   ├── feedback1-plan.md             # Implementation plan for feedback
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
- Scrollable message history with auto-scroll
- Input with "+" dropdown for selecting MCP resources
- Real-time processing indicator with animated dots
- **Prompt template preview**: Shows the full prompt text when a templated prompt is selected, with parameter placeholders highlighted

### 2. LLM API Integration
- Real calls to OpenAI gpt-4o-mini
- Tool definitions for: `print_hello`, `get_last_hellos`, `get_hello_count`, `web_search`
- Modal shows formatted API requests/responses with:
  - Step numbers linked to activity log
  - Timestamps with labels
  - Expandable tools field
  - Full response content display
- **Multi-step tool execution**: Orchestration layer loops until LLM returns final response (supports chained tool calls)

### 3. MCP Simulation
- **Tools**: `print_hello(name?)`, `get_last_hellos(count)`, `get_hello_count()`
- **Resources**: `hello_count`
- **Prompts**: `find_name_in_hellos` with parameter input and template preview
- Visual MCP Server component showing available tools/resources/prompts with description

### 4. Component Descriptions
Each component includes a description explaining its role:
- **Orchestration Layer**: "Decides when to call the LLM, structures inputs, and handles responses. Acts as the boundary between the non-deterministic LLM and deterministic app logic."
- **MCP Client**: "Connects to MCP servers to fetch tools, resources, and prompts for the LLM."
- **MCP Server**: "Exposes tools, resources, and prompts via the MCP protocol for the LLM app to use."
- **Built-in Tools**: "Tools built into the app (not from MCP)."

### 5. System Activity Log
- Auto-populated with initialization events on start
- Logs all actions: user input, LLM calls, tool executions
- Color-coded badges by component
- Auto-scrolls to bottom on new entries

### 6. Print Hello Application
- Direct UI for printing hellos (bypasses LLM)
- Shows hellos from both UI and LLM sources with badges
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
    - Loop until no more tool_calls (multi-step support)
    ↓
Final response displayed in ChatUI
```

## Layout Structure

```
┌─────────────────────┬─────────────────┬────────────────┐
│ LLM Application     │ LLM API         │ System         │
│                     │ [View I/O btn]  │ Activity Log   │
│ ┌───────┬─────────┐ ├─────────────────┤                │
│ │ Chat  │ Orch    │ │ "Print hello"   │ 1. System...   │
│ │ UI    │ Layer   │ │ Application     │ 2. MCP...      │
│ │       │         │ │                 │ 3. ...         │
│ │       │ MCP     │ │ ┌─MCP Server──┐ │                │
│ │       │ Client  │ │ │Tools|Res|Pr│ │                │
│ │       │         │ │ └─────────────┘ │                │
│ │       │ Built   │ │ ┌─App UI─────┐ │                │
│ │       │ Tools   │ │ │ Hellos     │ │                │
│ │[input]│         │ │ │ [input]    │ │                │
│ └───────┴─────────┘ │ └─────────────┘ │                │
└─────────────────────┴─────────────────┴────────────────┘
```

## Visual Design

- **Color scheme**: Muted professional colors with good contrast
  - LLM Application: Emerald/green gradients (emerald-100 → green-100)
  - LLM API: Violet/purple gradients (violet-100 → purple-100)
  - Print Hello App: Amber/orange gradients (amber-100 → orange-100)
  - Activity Log: Slate gray (slate-100)
  - Body background: Slate gradient
- **Sub-components**: Use lighter tints of parent colors (e.g., emerald-50, amber-50)
- **Content areas**: Neutral slate-100 with slate-200 borders for contrast
- **Buttons**: Gradient buttons matching section colors

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

- Chat UI input is contained within the Chat UI border (flex layout)
- Activity log auto-scrolls to bottom on new entries
- API modal shows formatted field name + description + value (not raw JSON)
- API modal opens scrolled to bottom to show latest entries
- MCP is simulated in-browser (no actual MCP protocol implementation)
- Orchestration layer includes full message history in LLM API calls
- Multi-step tool execution: LLM can chain multiple tool calls (e.g., get_hello_count → get_last_hellos)
- Click outside resource selector dropdown closes it
- Prompt templates show parameter inputs and live preview of the full prompt
