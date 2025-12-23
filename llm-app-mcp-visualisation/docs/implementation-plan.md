# LLM Application MCP Visualization - Implementation Plan

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **LLM**: OpenAI gpt-4o-mini (real API calls)
- **MCP**: Simulated (visual representation)
- **Deployment**: Vercel

---

## Project Structure

```
llm-app-mcp-visualisation/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Main visualization page
│   ├── globals.css                   # Tailwind styles
│   └── api/chat/route.ts             # OpenAI API route
│
├── components/
│   ├── layout/
│   │   └── VisualizationLayout.tsx   # 4-column grid layout
│   │
│   ├── llm-application/
│   │   ├── LLMApplication.tsx        # Container (green section)
│   │   ├── ChatUI.tsx                # Chat with scrollable history
│   │   ├── ChatInput.tsx             # Input + "+" dropdown + send
│   │   ├── ResourceSelector.tsx      # Dropdown for prompts/resources/tools
│   │   ├── OrchestrationLayer.tsx    # Visual orchestration component
│   │   ├── MCPClient.tsx             # MCP client visual
│   │   └── BuiltInTools.tsx          # Web search simulation
│   │
│   ├── llm-api/
│   │   ├── LLMAPI.tsx                # LLM API component (purple)
│   │   ├── APIModal.tsx              # Input/output modal
│   │   ├── APIRequestCard.tsx        # Formatted request display
│   │   └── APIResponseCard.tsx       # Formatted response display
│   │
│   ├── print-hello/
│   │   ├── PrintHelloApplication.tsx # Container (orange section)
│   │   ├── PrintHelloUI.tsx          # Button + input for hellos
│   │   ├── HelloDisplay.tsx          # List of printed hellos
│   │   ├── MCPServer.tsx             # MCP server visual
│   │   └── ActivityModal.tsx         # MCP activity viewer
│   │
│   ├── activity-log/
│   │   ├── SystemActivityLog.tsx     # Scrollable log (gray section)
│   │   └── LogEntry.tsx              # Individual log entry
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       └── ScrollArea.tsx
│
├── lib/
│   ├── store/
│   │   ├── chatStore.ts              # Chat messages state
│   │   ├── activityLogStore.ts       # Activity log state
│   │   ├── mcpStore.ts               # MCP state (hellos, activity)
│   │   └── apiLogStore.ts            # API request/response history
│   │
│   ├── services/
│   │   ├── orchestration.ts          # Main flow coordination
│   │   ├── mcpClient.ts              # Simulated MCP client
│   │   ├── mcpServer.ts              # Simulated MCP server
│   │   └── webSearch.ts              # Web search simulation
│   │
│   └── types/
│       ├── chat.ts
│       ├── mcp.ts
│       ├── api.ts
│       └── activity.ts
│
├── .env.local                        # OPENAI_API_KEY
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Implementation Phases

### Phase 1: Project Setup
1. Initialize Next.js with `npx create-next-app@latest`
2. Configure Tailwind CSS
3. Install dependencies: `zustand`, `openai`
4. Copy/create `.env.local` with `OPENAI_API_KEY`

### Phase 2: Types and State
1. Define TypeScript types in `lib/types/`
2. Create Zustand stores for chat, activity log, MCP, API log
3. Implement initialization logic for activity log

### Phase 3: Layout and UI Shell
1. Build `VisualizationLayout` - 4-column grid matching mockup
2. Create section containers with correct background colors:
   - LLM Application: Green
   - LLM API: Purple/lavender
   - Print Hello App: Orange/yellow
   - Activity Log: Gray
3. Build reusable UI components (Button, Modal, Card, ScrollArea)

### Phase 4: LLM Application Section
1. ChatUI with scrollable message history
2. ChatInput with "+" dropdown and send button
3. ResourceSelector dropdown (prompts, resources, tools)
4. OrchestrationLayer visual component
5. MCPClient visual component
6. BuiltInTools (web search simulation)

### Phase 5: Print Hello Application
1. MCPServer component showing tools/resources/prompts
2. PrintHelloUI with name input and button
3. HelloDisplay for printed hellos list
4. ActivityModal for MCP activity

### Phase 6: LLM API Section
1. LLMAPI component with "View input/output" button
2. API route (`/api/chat`) for OpenAI calls with tool definitions
3. APIModal with scrollable request/response history
4. Formatted cards (not raw JSON) showing:
   - Field name | Description | Value

### Phase 7: System Activity Log
1. SystemActivityLog scrollable component
2. LogEntry with format: `{n}. {Component} - {action}`
3. Auto-populate initialization events on start

### Phase 8: Orchestration Logic
1. Implement `lib/services/orchestration.ts` to coordinate:
   - User input → LLM call
   - Response parsing
   - Tool call execution
   - MCP client ↔ server communication
2. Log all actions to activity log

### Phase 9: Integration & Testing
1. Test full chat → tool call → response flow
2. Test direct Print Hello UI interactions
3. Verify all events logged correctly
4. Test API modal displays properly

### Phase 10: Deploy
1. Deploy to Vercel
2. Add `OPENAI_API_KEY` to Vercel env vars

---

## MCP Simulation Details

### Tools
| Tool | Description |
|------|-------------|
| `print_hello(name?)` | Prints "Hello" or "Hello {name}" |
| `get_last_hellos(count)` | Returns last N hellos |

### Resources
| Resource | Description |
|----------|-------------|
| `hello_count` | Number of hellos in session |

### Prompts
| Prompt | Description |
|--------|-------------|
| `find_name_in_hellos(name)` | Get hello count, fetch all hellos, search for name |

---

## Data Flow

### Chat Input Flow
```
User types message
  → "+" dropdown: optionally select prompts/resources/tools
  → Click send
  → [Log] User Input - {value}
  → [Log] Orchestration Layer - Call LLM
  → API route formats request with tools
  → [Log] LLM API - request received
  → OpenAI API call
  → [Log] LLM API - response sent
  → [Log] Orchestration Layer - Parse response
  → If tool calls:
      → [Log] Orchestration Layer - call MCP tool
      → [Log] MCP Client - call tool
      → [Log] Print Hello MCP - tool call received
      → Execute tool
      → [Log] Print Hello MCP - tool executed
      → [Log] Print Hello MCP - tool response sent
      → Loop back to LLM if needed
  → Display response in ChatUI
```

### Direct Print Hello Flow
```
User clicks "Print Hello" in PrintHelloUI
  → [Log] Print Hello UI - button clicked
  → Add hello to store
  → [Log] Print Hello App - Hello printed
  → Update HelloDisplay
```

---

## Initialization Events

On app start, activity log shows:
1. System - Application initialized
2. MCP Client - Initializing
3. MCP Client - Connecting to Print Hello MCP Server
4. Print Hello MCP - Server initialized
5. Print Hello MCP - Tools registered: print_hello, get_last_hellos
6. Print Hello MCP - Resources registered: hello_count
7. Print Hello MCP - Prompts registered: find_name_in_hellos
8. MCP Client - Connection established
9. Built-in Tools - Web Search simulation ready
10. System - Ready for user input

---

## Critical Files

| File | Purpose |
|------|---------|
| `app/api/chat/route.ts` | OpenAI API integration with tool calling |
| `lib/services/orchestration.ts` | Coordinates all component interactions |
| `lib/store/activityLogStore.ts` | Activity log state management |
| `components/layout/VisualizationLayout.tsx` | Main 4-column grid layout |
| `lib/services/mcpServer.ts` | Simulated MCP server with tools/resources/prompts |

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "openai": "^4.x",
    "zustand": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x"
  }
}
```

---

## Environment Variables

```
OPENAI_API_KEY=<from .env.local in repo root>
```
