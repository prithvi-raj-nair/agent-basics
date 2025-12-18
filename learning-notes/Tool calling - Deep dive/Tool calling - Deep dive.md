# Tool calling - Deep dive

## Page Outline

- [How does an LLM call tools?](#how-does-an-llm-call-tools-)
  - [Most basic level of tool calling](#most-basic-level-of-tool-calling)
  - [Modern evolution](#modern-evolution)
  - [Structured response vs Tool calling](#structured-response-vs-tool-calling)
  - [Tool calling limitations](#tool-calling-limitations)
- [Tool use flow example with ChatGPT and Claude APIs](#tool-use-flow-example-with-chatgpt-and-claude-apis)
  - [OpenAI Chat Completions API Tool calling flow](#openai-chat-completions-api-tool-calling-flow)
  - [Claude Messages API Tool calling flow](#claude-messages-api-tool-calling-flow)

---

# How does an LLM call tools ?

- LLM is a pure “text in” - “text out” AI model which is just a collection of numeric parameters arranged in matrices
- It inherently cannot call tools (early versions like chatGPT 3.5 were like this)
- Tool calling is enabled by creating a system around this AI model that -
    - Provides it with context on tools
    - Checks the output to see when it wants to call tools
    - Calls the functions in code and returns output back to LLM

## Most basic level of tool calling

1. You give context to AI on which tools/functions are available along with info on the parameters and what the function does
2. You also specify how the AI should output text when it wants to call a particular function
3. You then parse the output in code to check for when the AI wants to call a tool
4. If you see that LLM wants to call a tool, use the info in response call the function in your code
5. When you get the result of the function you pass it back to the LLM in the next API call along with the previous context

## Modern evolution

- Lately models have also been trained in environments where they have tools, so they have gotten really good at using tools to complete objectives
- The LLM providers also wrap the raw AI input/output to expose tool related inputs/outputs in more easy to use ways
- For e.g.
    - Field in input JSON for tool specification with well defined structure on description, parameters etc
    - Field in output response that specifies stop reason which will say “tool call” when the model wants to call a tool
    - Output will also have structured JSON object with parameters of the tool that LLM wants to call
    - There is also structured way to give response of tool call back to LLM
- The above JSON wrapping makes it easier to interact with tool calling LLM but internally it is doing the same thing that is described in the “basic level” above

## Structured response vs Tool calling

- Tool calling requires LLM to output text in structured format to specify the tool input
- But LLMs can be instructed to output text in ANY structured format.
- It is such structured format that LLM providers use to extract the outputs which they return in API response as well as convert your JSON inputs into structured text for LLM
- Since models have been trained with such environments, they are pretty good at XML structuring
- You can ask the LLM to output custom structure for you independent of the structure used internally by model providers
- Some reasons you would need a custom structured output from a model -
    - extracting entities (dates, product names, IDs, email subject and body etc)
    - formatting intermediate outputs for multi-step LLM workflows

<aside>
⚠️

These limitations can cause problems in custom structures and tool calling. So at the orchestration layer you have to add checks to handle these issues.

</aside>

## Tool calling limitations

### Limitation of structured output in general

Being a probabilistic language model, structured outputs suffer from the traditional problems that a language model has when it comes to outputting long streams of text

1. **Format drift / text noise** — the LLM emits extra prose instead of strict JSON.
2. **Missing / wrong fields or types** — it omits required keys or uses wrong formats.
3. **Truncation** — long outputs get cut off by token limits, producing invalid JSON mid-stream.
4. **Hallucinated arguments** — it invents IDs, endpoints, or values that don’t exist.

### Context window clutter issues

- **More tools ≠ better performance** - Each tool adds more text to context window and you might end up with so many tools that the LLM finds it hard to choose the right ones for the task
- **Multi step tool use issues** - As the LLM calls more tools the context window grows and you will see decreasing performance for tasks requiring multiple tools

### Tech process issues

- **Observability for debugging** - you have to explicitly record the reasoning to know why the LLM called tools in the way it did when something breaks (wrong order, wrong tools, wrong inputs etc)
- **Maintenance of tools** - LLM tools must be kept up to date as APIs evolve due to product development
- **Retry mechanisms** - LLMs retry behaviour will be unpredictable, as much as possible errors must be handled in orchestration layer
- **Tool output not as per LLM expectation from description** - The text description needs to be tightly in sync with the output of the tool

# Tool use flow example with ChatGPT and Claude APIs

## **OpenAI Chat Completions API Tool calling flow**

### API call 1 - First message + tool definition

```json
POST https:*//api.openai.com/v1/chat/completions*

{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "What's the weather in Boston?"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the current weather for a location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name"
            }
          },
          "required": ["location"]
        }
      }
    }
  ]
}
```

### Response 1 - Model Wants to Use Tool

```json
{
  "id": "chatcmpl-abc123",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "get_weather",
            "arguments": "{\"location\": \"Boston\"}"
          }
        }
      ]
    },
    "finish_reason": "tool_calls"
  }]
}
```

### Orchestration layer - Call Your Function (in your code)

```python
*# YOU execute the tool*
weather_data = get_weather("Boston")  
*# Your implementation# Returns: {"temp": 72, "condition": "sunny"}*
```

### API call 2 - send tool response back

```jsx
POST https:*//api.openai.com/v1/chat/completions*

{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "What's the weather in Boston?"},
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"location\": \"Boston\"}"
        }
      }]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "{\"temp\": 72, \"condition\": \"sunny\"}"
    }
  ],
  "tools": [...]
}
```

### API Response 2 - Final response based on tool output

```jsx
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "The weather in Boston is currently 72°F and sunny."
    },
    "finish_reason": "stop"
  }]
}
```

---

## **Claude Messages API Tool calling flow**

### API call 1 - First message + tool definition

```jsx
POST https:*//api.anthropic.com/v1/messages*

{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 1024,
  "tools": [
    {
      "name": "get_weather",
      "description": "Get the current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City name"
          }
        },
        "required": ["location"]
      }
    }
  ],
  "messages": [
    {"role": "user", "content": "What's the weather in Boston?"}
  ]
}
```

### Response 1 - Model Wants to Use Tool

```jsx
{
  "id": "msg_01XYZ",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the weather for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A",
      "name": "get_weather",
      "input": {"location": "Boston"}
    }
  ],
  "stop_reason": "tool_use"
}
```

### API call 2 - Call Your Function (in your code) and send output

```jsx
POST https:*//api.anthropic.com/v1/messages*

{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 1024,
  "tools": [...],
  "messages": [
    {"role": "user", "content": "What's the weather in Boston?"},
    {
      "role": "assistant",
      "content": [
        {"type": "text", "text": "I'll check the weather for you."},
        {
          "type": "tool_use",
          "id": "toolu_01A",
          "name": "get_weather",
          "input": {"location": "Boston"}
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A",
          "content": "{\"temp\": 72, \"condition\": \"sunny\"}"
        }
      ]
    }
  ]
}
```

### API Response 2 - Final response based on tool output

```python
{
  "content": [
    {
      "type": "text",
      "text": "The weather in Boston is currently 72°F and sunny."
    }
  ],
  "stop_reason": "end_turn"
}
```