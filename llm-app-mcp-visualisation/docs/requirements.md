# Objective

I am trying to create a visualization to showcase how an LLM application works. The visualization needs to be hosted as a web app that can be publicly accessed. An image showing roughly what the visualization needs to look like can be seen at llm-app-mcp-visualisation/docs/llm-app-visual.png.

# Description of components

## LLM application

This is a simulation of an LLM chat application like chatGPT

### ChatUI

- This will be a chat UI where user can type inputs and see the responses from the LLM app
- This window must have its own internal scroll to see the chat history
- Along with the chat input, there is a “+” button to select a prompt, resource, or tool that is available to the LLM application.

### orchestration layer

- This is the orchestration layer of the chat application.

### MCP client (model context protocol)

- This is the MCP client within the LLM chat application.

### Built in tools

- This is a simulation of built-in tools in a chat application. For this simulation, we will just have a web search tool simulation.
- The web search tool is a simulation. The tool call just results in some short dummy text that looks like a web search response.

## LLM API

This represents the actual LLM API that such an application would call. 

There is a button to view the inputs and outputs to the API in this component. On clicking that button, a pop-up opens that shows the inputs and outputs. A visualization of this UI can be seen in llm-app-mcp-visualisation/docs/llm-io-popup.png.

The pop-up just shows the API requests and API responses in a linear flow which can be scrolled through. Each request and response is formatted neatly with the fields in the JSON, a short description about those fields and the value of that field. Don't just dump the JSON; create a nice UI to visualize this easily for the end user. 

## Print hello application

This is a simple application that prints "hello" in the UI. This application is to simulate a third-party application that you might connect to the LLM chat application over MCP. 

### Print hello application UI

This is the simulation of the UI of the application where you can:

1. Click a button to print "Hello" on the UI
2. Provide a name in the input box and click the button to print "Hello <name>"

### Print "hello” MCP server (model context protocol)

This is a simulation of the MCP server for the Print Hello application. It has the following tools, resources, and prompts. 

Tools

- Print hello {name} tool
- Get last {N} hello tool - fetches the last N printed hellos (including prints from LLM tool calls as well as prints from the UI)

Resource

- Get number of hellos in session

Prompt

- Find {name} in hellos - This prompt instructs to get the resource of number of hellos, use that number in Get last {N} hello to fetch all the hellos, searches for {name} in those hellos and returns if it is found

## System activity log

- This is a log of the system activity so that the user of the visualization can understand what's going on in the system.
- This log is a numbered list of key actions that are happening in the different components of the system.
- Each action starts with the name of the component that carried out that action and a brief description of that action.
- The log must be formatted neatly and shown with a number to specify the order in which these actions are occurring. The system log component must be scrollable for the user to see the logs cleanly.

```json
Example
User Input - <value>
Orchestration layer - Call LLM
LLM API - request received
LLM API - response sent
Orchestration layer - Parse response
Orchestration layer - call MCP tool
MCP client -  call tool
Print hello MCP - tool call received
Print hello MCP - tool executed
Print hello MCP - tool response sent

... so on
```

# How the visualisation will work

- When the visualization starts, there must be key actions already present, like the initialization of the MCP client and server, and things like that.
- Then when user does an input action on LLM chat UI, all the actions taken by sub components need to be logged
- If the user takes action directly on the print hello app, then that also needs to be logged

# Technical note

The visualisation web app needs to be created in llm-app-mcp-visualisation folder which will be one of the many sub projects in this repository. So it needs to have its own packages and folder structure which is isolated from the rest of the project. The project will be deployed on vercel.

There is already an env local file in the repository root. Use the API keys from there or create a copy of it in the sub project if required.

For LLM, use the cheapest model available always.

Use context7 to fetch documentation on model context protocol (MCP) or LLM APIs.