# Feedback 1 Implementation Plan

## Overview

This plan addresses all feedback items from `feedback1.md`, organized by section with specific implementation details.

---

## 1. Orchestration Layer

### Issue: Message history not being sent correctly to LLM API

**Current Behavior:**
- In `lib/services/orchestration.ts`, only the current user message is being sent to the API, not the full conversation history.

**Fix:**
- Modify `handleUserMessage()` to build a proper messages array from `chatStore.messages`
- Convert stored ChatMessage objects to OpenAI message format
- Include all previous messages in correct order before the new user message

**Files to modify:**
- `lib/services/orchestration.ts`

**Implementation:**
```typescript
// Build messages array from chat history
const chatMessages = chatStore.getState().messages
const messagesForAPI = chatMessages.map(msg => ({
  role: msg.role,
  content: msg.content
}))
// Add current user message
messagesForAPI.push({ role: 'user', content: messageWithContext })
```

---

## 2. LLM Chat UI

### 2.1 Templated prompt parameter input

**Issue:** The "find_name_in_hellos" prompt has a `{name}` parameter but no UI to input it.

**Fix:**
- When user selects a prompt-type resource with parameters, show an input field
- Parse prompt template for `{paramName}` patterns
- Allow user to fill in parameter values before sending

**Files to modify:**
- `components/llm-application/ChatInput.tsx`
- `lib/types/chat.ts` (add parameter field to MCPResource)

**Implementation:**
- Add `parameters?: string[]` to MCPResource type
- Add state for parameter values in ChatInput
- Show parameter input UI when prompt selected
- Substitute parameter values when building message

### 2.2 Dropdown click-outside-to-close

**Issue:** ResourceSelector only closes when clicking "+" button again.

**Fix:**
- Add click-outside detection using useEffect with document event listener
- Close dropdown when clicking anywhere outside the dropdown area

**Files to modify:**
- `components/llm-application/ResourceSelector.tsx`

**Implementation:**
```typescript
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      onClose()
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [onClose])
```

### 2.3 Remove placeholder text boxes

**Issue:** Initial "user input text" and "Response or output text" placeholders should be removed.

**Fix:**
- Check if these are hardcoded initial messages in chatStore or ChatUI
- Remove them - chat should start empty

**Files to modify:**
- `lib/store/chatStore.ts` or `components/llm-application/ChatUI.tsx`

### 2.4 Chat UI scroll behavior

**Issue:** Chat starts small and grows, should start tall with internal scroll.

**Current:** Chat area uses `flex-1` but parent may not have fixed height.

**Fix:**
- Give ChatUI a fixed/minimum height that fills its container
- Ensure messages area has `overflow-y: auto` and proper height constraints
- Chat should be tall from start, scrollbar appears when messages overflow

**Files to modify:**
- `components/llm-application/ChatUI.tsx`
- Possibly `components/llm-application/LLMApplication.tsx`

**Implementation:**
- Ensure parent has `h-full` or explicit height
- ChatUI should use `h-full flex flex-col`
- Messages container: `flex-1 min-h-0 overflow-y-auto`
- May need to set a `min-h-[400px]` or similar on ChatUI

### 2.5 Modern chat UI look and feel

**Issue:** Update styling to look like a normal chat application.

**Fix:**
- Use cleaner message bubbles with proper spacing
- Add better visual hierarchy
- Use more subtle colors, shadows, and rounded corners
- Consider showing timestamps on messages
- Add avatar/icon indicators for user vs assistant

**Files to modify:**
- `components/llm-application/ChatUI.tsx`
- `components/llm-application/ChatMessage.tsx`
- `components/llm-application/ChatInput.tsx`
- `app/globals.css`

---

## 3. LLM API Input/Output Modal

### 3.1 Field value visualization cleanup

**Issue:** Not clear which text is field name/description vs value.

**Fix:**
- Redesign FieldRow component with clearer visual separation
- Use columns or cards to distinguish name, description, and value
- Consider: left column for field info, right for value with different background

**Files to modify:**
- `components/llm-api/APIRequestCard.tsx`
- `components/llm-api/APIResponseCard.tsx`

### 3.2 Tools field expansion

**Issue:** Tools field should be expandable to show the tools sent to LLM.

**Fix:**
- Make tools field expandable (similar to messages)
- Show tool name, description, and parameters schema when expanded

**Files to modify:**
- `components/llm-api/APIRequestCard.tsx`

### 3.3 Modal opens at bottom of scroll

**Issue:** Modal should scroll to bottom to show latest API calls.

**Fix:**
- Add useEffect to scroll modal content to bottom when opened
- Or reverse the order so newest entries are at top

**Files to modify:**
- `components/llm-api/LLMAPI.tsx` or `components/ui/Modal.tsx`

### 3.4 Add "Timestamp" label

**Issue:** Timestamp value needs a label.

**Fix:**
- Add "Timestamp:" prefix before the timestamp value

**Files to modify:**
- `components/llm-api/APIRequestCard.tsx`
- `components/llm-api/APIResponseCard.tsx`

### 3.5 Add step number from activity log

**Issue:** Show system activity log step number next to timestamp.

**Fix:**
- Track which activity log entry corresponds to each API call
- Store step number in apiLogStore entries
- Display step number alongside timestamp

**Files to modify:**
- `lib/store/apiLogStore.ts`
- `lib/services/orchestration.ts`
- `components/llm-api/APIRequestCard.tsx`
- `components/llm-api/APIResponseCard.tsx`

### 3.6 Remove "complex output" - show full output

**Issue:** Some outputs show as "complex output" instead of actual content.

**Fix:**
- Remove truncation/simplification logic
- Display full JSON or content for complex objects
- Use collapsible sections for long content

**Files to modify:**
- `components/llm-api/APIRequestCard.tsx`
- `components/llm-api/APIResponseCard.tsx`

---

## 4. System Activity Log

### 4.1 Log orchestration fetching MCP resources

**Issue:** Missing logs for when orchestration layer fetches tools, prompts, resources list.

**Fix:**
- Add activity log entries during initialization for:
  - "Fetching available tools"
  - "Fetching available resources"
  - "Fetching available prompts"
- Add entries when these are actually queried during orchestration

**Files to modify:**
- `lib/store/activityLogStore.ts` (initialization)
- `lib/services/orchestration.ts`

### 4.2 Auto-scroll to bottom

**Issue:** Activity log should always show latest entries.

**Current:** Already implemented with useEffect on entries change.

**Verify:** Check if scroll is working correctly, may need `scrollIntoView` or behavior: 'smooth'.

**Files to modify:**
- `components/activity-log/SystemActivityLog.tsx` (if needed)

---

## 5. Overall Visual Cleanup

### Issue: App should look like a sleek modern web app

**Changes needed:**
1. **Color palette**: Move away from bright green/purple/orange to more muted, professional tones
2. **Typography**: Use better font weights, sizes, and spacing
3. **Shadows and depth**: Add subtle shadows for card depth
4. **Borders**: Use softer borders or remove harsh outlines
5. **Spacing**: Increase whitespace for breathing room
6. **Consistency**: Unified button styles, consistent border radius

**Files to modify:**
- `app/globals.css` - update CSS variables with professional colors
- `tailwind.config.js` - may add custom theme colors
- All component files for styling updates

**Design direction:**
- Use a more neutral base (grays, whites)
- Use accent colors sparingly for emphasis
- Softer, more subtle section backgrounds
- Professional card styling with subtle shadows
- Clean, minimal borders

---

## Implementation Order

1. **High priority (functionality):**
   - Orchestration message history fix (1)
   - Chat UI scroll behavior fix (2.4)
   - Dropdown click-outside (2.2)
   - Remove placeholder texts (2.3)

2. **Medium priority (UX improvements):**
   - Templated prompt parameters (2.1)
   - API modal improvements (3.1-3.6)
   - Activity log MCP fetch logs (4.1)

3. **Lower priority (visual polish):**
   - Modern chat UI styling (2.5)
   - Overall visual cleanup (5)

---

## Estimated Changes by File

| File | Changes |
|------|---------|
| `lib/services/orchestration.ts` | Message history, activity log entries, step tracking |
| `components/llm-application/ChatUI.tsx` | Height/scroll fixes, styling |
| `components/llm-application/ChatInput.tsx` | Parameter input UI |
| `components/llm-application/ChatMessage.tsx` | Modern styling |
| `components/llm-application/ResourceSelector.tsx` | Click outside handler |
| `components/llm-api/APIRequestCard.tsx` | Field display, tools expand, timestamps, step number |
| `components/llm-api/APIResponseCard.tsx` | Field display, timestamps, step number, full output |
| `components/llm-api/LLMAPI.tsx` | Modal scroll to bottom |
| `lib/store/apiLogStore.ts` | Step number tracking |
| `lib/store/activityLogStore.ts` | MCP fetch entries |
| `lib/store/chatStore.ts` | Remove initial messages if present |
| `app/globals.css` | Modern color scheme, styling |

---

## Questions/Clarifications Needed

1. **Color scheme preference**: Should I use a specific color palette for the professional look, or choose based on best practices?

2. **Chat UI height**: Should the chat UI fill all available vertical space, or have a maximum height?

3. **Activity log step numbers**: Should step numbers persist across page refreshes, or reset each session?

4. **API modal scroll**: Should newest entries be at top (reversed order) or scroll to bottom automatically?
