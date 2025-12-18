# Basics of using LLMs in your app

## Page Outline

- [Understanding the LLM API](#understanding-the-llm-api)
  - [Summary](#summary)
    - [Input and output of LLM APIs](#input-and-output-of-llm-apis)
    - [Orchestration layer](#orchestration-layer)
    - [Tool calling and structured input/output](#tool-calling-and-structured-inputoutput)
    - [Stateless and non-deterministic](#stateless-and-non-deterministic)
    - [No access to chain of thought](#no-access-to-chain-of-thought)
- [API Request General Structure](#api-request-general-structure)
- [API Response General Structure](#api-response-general-structure)
  - [API Response Fields Descriptions](#api-response-fields-descriptions)
  - [Tool Call Response Example](#tool-call-response-example)
  - [Streaming Response Example](#streaming-response-example)
- [Quick Reference Table for API inputs and outputs](#quick-reference-table-for-api-inputs-and-outputs)
- [Tool calling and structured input/output](#tool-calling-and-structured-inputoutput-1)
- [Simulating chain of thought without access](#simulating-chain-of-thought-without-access)

---

# Understanding the LLM API

- To add LLM functionality to your application, you need to first understand the programming interface for the LLM (i.e. the APIs). This will give you the mental model required to reason about how to integrate LLMs into your systems.
- LLM is a pure “text in” - “text out” AI model which is just a collection of numeric parameters arranged in matrices.
- The LLM providers wrap this model with APIs that gives you a structured way to provide input and read the output of the model. Internally they convert your input into a structured text and train the model to provide output also in structured text which they parse and return as JSON.
- Modern LLM APIs follow a standard request-response pattern. The following explanation is generalised from how ChatGPT and Claude basic chat response APIs work. This generalised structure doesn't actually represent the exact API structure of either Claude or ChatGPT which have small differences (called out in the subsequent sections)

![image.png](Basics%20of%20using%20LLMs%20in%20your%20app/image.png)

## Summary

### Input and output of LLM APIs

You call the API with all the required context and it gives you an output in response. 

The context would include things like:

- the message history
- the model type
- the tools that are available for the model to call
- etc

The response would include:

- The actual message response
- Any tool calls that the LLM wants to do
- etc

### Orchestration layer

- This is the part of the system that actually decides -
    - When to call the LLM - connected with other flows of your app/system
    - How to call the LLM - structures input for the LLM based on context
    - What to do with the LLM response - call tools, show to user, etc
- This part of the system is purely deterministic - you have to write all the rules and flows in normal code
- Orchestration layer acts as the boundary between non-deterministic LLM and the remaining deterministic part of your system

### Tool calling and structured input/output

These APIs support tool calling. To do this, they have the following:

- Input fields to specify the tools available
- Response handling to specify when the LLM wants to call a tool (usually specified as the “reason” for termination of response)
- The required structured inputs for the tool call

You have to parse the response and actually perform the tool calling in your code. After you perform the tool call, you have to send the response back to the LLM as part of the message history with a specific type or field for the tool response. 

More details on tool calling and structure i/o in [Tool calling - Deep dive](../Tool%20calling%20-%20Deep%20dive/Tool%20calling%20-%20Deep%20dive.md) page

### Stateless and non-deterministic

- The basic chat or messages API by all providers are stateless.
- This means that when you make a call, it just gives you an output. It doesn't store any information or update any internal state.
- So if you want to have a back-and-forth conversation, you have to build the orchestration layer that will add the additional context of the conversation for each subsequent API call.
- Despite being stateless, you will NOT get the same output for the same input when calling the API twice
- This is because LLMs are non deterministic systems. The output is made by predicting the next token based on highest probability.
- LLM APIs bake in some randomness by NOT ALWAYS selecting most probably token to create more variety in responses and achieve better overall performance of the LLM in diverse situations
    - You can control this randomness in the input to the API
- This makes these systems harder to debug because even if you recreate the exact situation in which a bug occurred, the LLM might behave differently.

### No access to chain of thought

Model providers do not expose the actual chain of thought of the model due to various concerns. Any “thinking” you see in the LLM provider apps (like ChatGPT/Claude) or other apps built on these LLMs are simulation for better UX.

# **API Request General Structure**

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant specialized in Python programming."
    },
    {
      "role": "user",
      "content": "How do I reverse a string in Python?"
    },
    {
      "role": "agent",
      "content": "You do that by calling xyz function"
    }
  ],
  "max_tokens": 1000,
  "temperature": 0.7,
  "top_p": 1.0,
  "n": 1,
  "stream": false,
  "stop": null,
  "presence_penalty": 0.0,
  "frequency_penalty": 0.0,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "run_code",
        "description": "Execute Python code and return the result",
        "parameters": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Python code to execute"
            }
          },
          "required": ["code"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}

```

---

## **API Request Fields Descriptions**

### **1. `model`**

- **Type:** String
- **Description:** Identifier for which LLM model to use
- **Examples:**
    - `"gpt-4o"` - Latest GPT-4 optimized
    - `"claude-sonnet-4-5-20250929"` - Claude's model

---

### **2. `messages`**

- **Type:** Array of objects
- **Required:** ✅ Mandatory
- **Description:** The conversation history, including all previous turns in the correct order
- **Structure:** Each message object has `role` and `content`

**Message Roles:**

| Role | Required | Description | When to Use |
| --- | --- | --- | --- |
| `system` | Optional | Instructions for AI behavior | Set personality, expertise, constraints |
| `user` | Required | Human input | Every user message in chat |
| `assistant` | Optional | AI responses from previous turns | Every previous agent response in chat |
| `tool` | Optional | Results from tool/function calls | After AI requests tool use |

**Example Multi-Turn Conversation:**

```json
"messages": [
  {
    "role": "system",
    "content": "You are a helpful coding assistant."
  },
  {
    "role": "user",
    "content": "Write a function to calculate factorial"
  },
  {
    "role": "assistant",
    "content": "Here's a factorial function: def factorial(n): return 1 if n <= 1 else n * factorial(n-1)"
  },
  {
    "role": "user",
    "content": "Now make it iterative instead"
  }
]

```

**Key Points:**

- ✅ Must include at least one `user` message
- ✅ Include full history for context (API is stateless)
- ❌ Don't alternate roles incorrectly (most APIs auto-merge consecutive same-role messages)

> [!WARNING]
> System prompt is handled differently in Anthropic and ChatGPT. Anthropic has a separate field for the system message, whereas ChatGPT takes it as the first message in the list with the role system.

---

### **3. `max_tokens`**

- **Type:** Integer
- **Required:** ⚠️ Sometimes mandatory (Claude), optional (OpenAI)
- **Description:** Maximum number of tokens in the response
- **Range:** 1 to model's maximum (e.g., 4096, 8192, 16384)
- **Default:** Model-dependent
- **When to use:**
    - ✅ Set explicitly to control costs
    - ✅ Prevent excessively long responses
    - ✅ Ensure response fits your UI/system

**Important:** 1 Token ≈ 0.75 words in English

---

### **4. `temperature`**

- **Type:** Float
- **Required:** ❌ Optional
- **Description:** Controls randomness/creativity of responses
- **Range:** 0.0 to 2.0
- **Default:** 0.7 or 1.0 (provider-dependent)
- **When to use different values:**

| Temperature | Use Case | Example |
| --- | --- | --- |
| `0.0 - 0.3` | Deterministic, factual tasks | Code generation, data extraction, math |
| `0.4 - 0.7` | Balanced responses | General chatbots, Q&A |
| `0.8 - 1.2` | Creative tasks | Story writing, brainstorming |
| `1.3 - 2.0` | Highly creative/random | Experimental, artistic |

---

### **5. `top_p`**

- **Type:** Float
- **Required:** ❌ Optional
- **Description:** Alternative to temperature; nucleus sampling threshold
- **Range:** 0.0 to 1.0
- **Default:** 1.0
- **When to use:**
    - Use `top_p` OR `temperature`, not both
    - `top_p=0.1` - Only top 10% probable tokens (focused)
    - `top_p=0.9` - Top 90% probable tokens (diverse)
- **Recommended:** Stick with temperature unless you understand nucleus sampling

---

### **6. `n` parameter**

- **Type:** Integer
- **Required:** ❌ Optional
- **Description:** Number of response variations to generate
- **Default:** 1
- **Range:** 1 to ~10 (provider-dependent)
- **When to use:**
    - ✅ Comparing multiple response options
    - ✅ A/B testing prompts
    - ❌ Not for production (increases cost linearly)

---

### **7. `stream`**

- **Type:** Boolean
- **Required:** ❌ Optional
- **Description:** Enable Server-Sent Events (SSE) streaming
- **Default:** false
- **When to use:**

| Value | Use Case |
| --- | --- |
| `false` | Batch processing, simple scripts, when full response needed before action |
| `true` | Real-time UIs (ChatGPT-style), reducing perceived latency, live updates |

---

### **8. `stop`**

- **Type:** String or Array of strings
- **Required:** ❌ Optional
- **Description:** Stop sequences - model stops generating when these appear
- **Default:** null (model's natural stop)
- **Max:** Usually up to 4 sequences
- **When to use:**
    - ✅ Prevent unwanted continuation
    - ✅ Format control (stop at specific markers)
    - ✅ Extract specific sections

**Examples:**

```json
// Stop at newline (for single-line responses)
"stop": "\n"

// Stop at multiple markers
"stop": ["END", "\n\n", "User:"]

// Extract code only
"stop": "```"
```

---

### **9. `presence_penalty`**

- **Type:** Float
- **Required:** ❌ Optional
- **Description:** Penalizes tokens that have appeared in previous responses, encouraging topic diversity
- **Range:** -2.0 to 2.0
- **Default:** 0.0
- **When to use:**

| Value | Effect | Use Case |
| --- | --- | --- |
| `0.0` | No penalty | Default, balanced |
| `0.5 - 1.0` | Encourage new topics | Creative writing, brainstorming |
| `1.0 - 2.0` | Strong diversity | Avoid repetition |
| `-1.0 - 0` | Allow repetition | Technical docs, consistent terminology |

---

### **10. `frequency_penalty`**

- **Type:** Float
- **Required:** ❌ Optional
- **Description:** Penalizes tokens based on frequency, reducing repetitive phrasing
- **Range:** -2.0 to 2.0
- **Default:** 0.0
- **When to use:**

| Value | Effect | Use Case |
| --- | --- | --- |
| `0.0` | No penalty | Default |
| `0.5 - 1.0` | Reduce repetition | General conversation |
| `1.0 - 2.0` | Strong anti-repetition | Long-form content |

**Difference from presence_penalty:**

- **Presence:** Penalizes if token appeared at all
- **Frequency:** Penalizes based on how many times it appeared

---

### **11. `tools`**

- **Type:** Array of tool objects
- **Required:** ❌ Optional
- **Description:** Functions/tools the model can call
- **When to use:**
    - ✅ Need to fetch external data
    - ✅ Perform calculations
    - ✅ Execute actions (send email, update database)

**Structure:**

```json
"tools": [
  {
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Get current weather for a location. Call this whenever you need weather information.",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City name, e.g., 'San Francisco, CA'"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit"
          }
        },
        "required": ["location"]
      }
    }
  }
]
```

**Best Practices:**

- ✅ Clear, descriptive function names
- ✅ Detailed descriptions (helps model decide when to use)
- ✅ Precise parameter descriptions with examples
- ✅ Specify required vs optional parameters

---

### **12. `tool_choice`**

- **Type:** String or Object
- **Required:** ❌ Optional
- **Description:** Controls how model uses tools
- **Default:** "auto"

**Options:**

| Value | Behavior | When to Use |
| --- | --- | --- |
| `"auto"` | Model decides | Default, most flexible |
| `"none"` | Never use tools | Force text response only |
| `{"type": "function", "function": {"name": "X"}}` | Force specific tool | Guaranteed tool use |
| `"required"` | Must use a tool | Prevent non-tool responses |

---

# **API Response General Structure**

```json
{
  "id": "chatcmpl-8pP9mKR7K3f9H8sCx2n9Vx",
  "object": "chat.completion",
  "created": 1701234567,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "To reverse a string in Python, you can use slicing:\n\n```python\ntext = \"hello\"\nreversed_text = text[::-1]\nprint(reversed_text)  # Output: olleh\n```",
        "tool_calls": null
      },
      "finish_reason": "stop",
      "logprobs": null
    }
  ],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 62,
    "total_tokens": 107
  },
  "system_fingerprint": "fp_44709d6fcb"
}
```

---

## **API Response Fields Descriptions**

### **1. id**

- **Type:** String
- **Description:** Unique identifier for this completion
- **Purpose:**
    - Debugging
    - Logging/tracking
    - Reporting issues to provider

---

### **2. object**

- **Type:** String
- **Description:** Object type identifier
- **Values:**
    - `"chat.completion"` - Complete response
    - `"chat.completion.chunk"` - Streaming chunk
- **Purpose:** Parsing/type checking

---

### **3. created**

- **Type:** Integer (Unix timestamp)
- **Description:** When response was generated

---

### **4. model**

- **Type:** String
- **Description:** Actual model that generated the response
- **Note:** May differ from request if model was aliased

---

### **5. choices**

- **Type:** Array of choice objects
- **Description:** Generated completions (usually 1, or n if specified)
- **Structure:** Each choice contains:

### **5a. index**

- **Type:** Integer
- **Description:** Position in choices array (0, 1, 2...)
- **Purpose:** When `n > 1`, identifies which variation

### **5b. message**

- **Type:** Object
- **Description:** The actual response from the model

**Message Structure:**

```json
"message": {
  "role": "assistant",
  "content": "The actual text response",
  "tool_calls": [...]  // Present if model wants to use tools
}

```

**Message Fields:**

| Field | Type | Description | When Present |
| --- | --- | --- | --- |
| `role` | String | Always "assistant" | Always |
| `content` | String or null | Response text | When not using tools |
| `tool_calls` | Array or null | Tool/function calls | When model wants to use tools |

### **5c. finish_reason**

- **Type:** String
- **Description:** Why the model stopped generating
- **Values and meanings:**

| Value | Meaning | Action Needed |
| --- | --- | --- |
| `"stop"` | Natural completion | ✅ Response is complete |
| `"length"` | Hit max_tokens limit | ⚠️ Response may be truncated, increase max_tokens |
| `"tool_calls"` | Wants to use a tool | 🔧 Execute tools and continue conversation |
| `"content_filter"` | Blocked by safety filters | 🚫 Revise prompt or handle error |
| `"function_call"` | (Legacy) function calling | 🔧 Same as tool_calls |
| `stop_sequence`  | Stop sequence reached | ✅ Response is complete as per stop sequence in request |

### **5d. logprobs**

- **Type:** Object or null
- **Description:** Token-level probability information (if requested)
- **When present:** Only if `logprobs: true` in request
- **Purpose:**
    - Debugging model confidence
    - Fine-tuning analysis
    - Research

---

### **6. usage**

- **Type:** Object
- **Description:** Token consumption for billing/monitoring
- **Structure:**

```json
"usage": {
  "prompt_tokens": 45,      // Tokens in your input
  "completion_tokens": 62,   // Tokens in AI response
  "total_tokens": 107        // Sum of both
}

```

**Why it matters:**

- 💰 **Billing:** Charged per token
- 📊 **Monitoring:** Track API costs
- ⚠️ **Limits:** Some providers have rate limits on tokens/minute

---

### **7. system_fingerprint**

- **Type:** String or null
- **Description:** Backend configuration identifier
- **Purpose:**
    - Detecting model updates
    - Reproducing results
    - Debugging behavioral changes
- **Example:** `"fp_44709d6fcb"`

---

## **Tool Call Response Example**

When the model wants to use a tool:

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
            "arguments": "{\"location\": \"San Francisco\", \"unit\": \"celsius\"}"
          }
        }
      ]
    },
    "finish_reason": "tool_calls"
  }],
  "usage": {...}
}

```

**Tool Calls Fields:**

| Field | Description |
| --- | --- |
| `id` | Unique ID for this tool call (use when submitting results) |
| `type` | Always "function" |
| `function.name` | Which function to call |
| `function.arguments` | JSON string of parameters |

**Your workflow:**

1. Parse `arguments` JSON
2. Execute your actual function
3. Add result to next request as `tool` role message

---

## **Streaming Response Example**

When `stream: true`, you receive multiple events:

```json
data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"To"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" reverse"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" a"},"finish_reason":null}]}

...

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]

```

**Key differences:**

- `object`: `"chat.completion.chunk"` instead of `"chat.completion"`
- `delta`: Incremental content instead of full `message`
- Final chunk: Empty delta with `finish_reason`

---

# **Quick Reference Table for API inputs and outputs**

### **Request key Fields**

| Field | Required | Default | Use When |
| --- | --- | --- | --- |
| `model` | ✅ | - | Always |
| `messages` | ✅ | - | Always |
| `max_tokens` | ⚠️ | Varies | Control length/cost |
| `temperature` | ❌ | 0.7-1.0 | Adjust creativity |
| `stream` | ❌ | false | Real-time UI |
| `tools` | ❌ | - | Need external data/actions |

### **Response Key Fields**

| Field | Always Present | Use For |
| --- | --- | --- |
| `id` | ✅ | Tracking/debugging |
| `choices[0].message.content` | Usually | The actual response |
| `choices[0].finish_reason` | ✅ | Determine if complete |
| `usage` | ✅ | Cost tracking |

---

This structure is consistent across OpenAI, Anthropic (with minor field name differences), and most LLM providers following the OpenAI-compatible API standard.

# Tool calling and structured input/output

- All the functionality of LLM API is achieved by giving the model inputs and asking the model to output in structured format (usually XML) which can be parsed by normal code.
- Internally the JSON inputs you give to API are converted to text in XML format. The output is also in XML which is converted back to JSON for API response
- Example of what this structured XML looks like -

```xml
<!-- BASIC CONVERSATION STRUCTURE -->
<!-- System prompt defines Claude's behavior and context -->
<system>
You are a helpful AI assistant. You should be concise and accurate.
</system>

<!-- Messages array contains the conversation history -->
<messages>
  <!-- User message -->
  <message role="user">
    <content>What's the weather like in San Francisco?</content>
  </message>
  
  <!-- Assistant response -->
  <message role="assistant">
    <content>I don't have access to real-time weather data, but I can search for current conditions if you'd like.</content>
  </message>
  
  <!-- User follow-up -->
  <message role="user">
    <content>Yes, please check.</content>
  </message>
</messages>

<!-- TOOL DEFINITIONS -->
<!-- Tools are defined separately and made available to Claude -->
<tools>
  <tool>
    <name>web_search</name>
    <description>Search the web for current information</description>
    <input_schema type="object">
      <properties>
        <query type="string" description="Search query"/>
      </properties>
      <required>query</required>
    </input_schema>
  </tool>
  
  <tool>
    <name>get_weather</name>
    <description>Get current weather for a location</description>
    <input_schema type="object">
      <properties>
        <location type="string" description="City name"/>
        <units type="string" enum="['celsius', 'fahrenheit']"/>
      </properties>
      <required>location</required>
    </input_schema>
  </tool>
</tools>
```

# Simulating chain of thought without access

- Neither Anthropic nor OpenAI actually expose the internal chain of thought of the models
- This is due to security and privacy reasons, and proprietary data, and all of that nonsense
- Instead, if you are building agents using these APIs, you have to simulate the chain of thought in different ways

### Option 1 - Ask the model to output its thinking as a summary in structured response

- in this method, you ask the LLM to respond with structured output—separate sections or fields for the reasoning or chain of thought and the actual output.
- The reasoning or chain of thought that is exposed in this output will be a summary of the actual internal chain of thought which is not exposed

### Option 2 - Use non reasoning model but add an extra API call for reasoning/planning

- you can design your agent system in such a way that you use a non-reasoning model but use an additional API call to do the actual reasoning or planning, which you then use in subsequent steps

### Option 3 - Agent framework simulations

- when you use some agent frameworks, they will simulate a form of reasoning that you can visualise to the end user as a tool call or planning etc., which are just different actions that the agent is taking.
- This is not a true chain of thought, but this helps you show a visualisation to the end user about what the agent is doing