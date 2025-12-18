# Model Context Protocol (MCP)

## Page Outline

- [Motivation](#motivation)
- [MCP architecture](#mcp-architecture)
  - [Host, client, and server](#host-client-and-server)
  - [Tools](#tools)
  - [Resources](#resources)
  - [Prompt templates](#prompt-templates)
  - [MCP implementation compared to tool calling](#mcp-implementation-compared-to-tool-calling)
- [MCP limitations](#mcp-limitations)
  - [API can NOT be 1:1 mapped to MCP tools](#api-can-not-be-11-mapped-to-mcp-tools)
- [MCP at a more technical level (for builders)](#mcp-at-a-more-technical-level-for-builders)
  - [Prerequisite technical knowledge quickie](#prerequisite-technical-knowledge-quickie)
  - [MCP protocol as a stack](#mcp-protocol-as-a-stack)
  - [Creating an MCP server](#creating-an-mcp-server)
  - [Creating an MCP client](#creating-an-mcp-client)
  - [Connecting server and client](#connecting-server-and-client)
  - [Authentication in MCP](#authentication-in-mcp)

---

# Motivation

- Now that you understand how LLMs call tools ([Tool calling - Deep dive](../Tool%20calling%20-%20Deep%20dive/Tool%20calling%20-%20Deep%20dive.md)), it is only natural to think that LLMs given access to different tools can perform various operations which are actually useful to users
- To facilitate this, LLM service providers would have to integrate “tools” for many apps like google drive, gmail, github etc
- It is not feasible for the apps or the LLM providers to make custom integrations (N apps, M providers = N x M integrations)
- To standardise this process of providing app specific tools to LLMs, the model context protocol was developed

# MCP architecture

![Screenshot 2025-12-10 at 2.49.27 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-10_at_2.49.27_PM.png)

![Screenshot 2025-12-10 at 2.51.46 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-10_at_2.51.46_PM.png)

## Host, client, and server

- At a high level the images above provide a pretty good mental model to think about the entities involved in the protocol
- If you are actually building MCP servers or clients, reading the section [MCP at a more technical level (for builders)](#mcp-at-a-more-technical-level-for-builders) will give a much better mental model since there are a lot of nuances
- For example - MCP “servers” doesn’t necessarily mean a server that is located in the cloud as we are used to traditionally when we talk about servers.

## Tools

- Tools work pretty much the same way as described in [Tool calling - Deep dive](../Tool%20calling%20-%20Deep%20dive/Tool%20calling%20-%20Deep%20dive.md)
- MCP just provides a layer to standardise how application developers create tools that can connect with any LLM host app

## Resources

- These are data (files) that can be fetched from the MCP server to be included as context in prompts
- Since resources are just data, they just get added to the context of the LLM when used (part of the structured input to LLM).
    - How exactly it is included in context is handled by the LLM application
- The data can be constantly updated by the server if needed (it need not be static)
- Examples
    - you can include a python script that performs a certain operation which can be used by the AI when user asks to perform that operation
    - If you are building a database MCP, then you can have a resource which has context of all the tables present so that user doesn’t have to explain every time
- Resources can also have dynamic parameters instead of just being a single piece of data (called templated resources).
- Example
    - A “doc name” to fetch from a set of documents
- This is useful when the full list of resources might be long (like list of file names in a code base)

> [!TIP]
> - Effectively resources are the same as a GET API requests.
> - Resources are not "actions" so fetching of a resource as a tool call "Get resource X" is token inefficient (although functionally it is equivalent)

### How resources are used

- How the resources are shown in host UI is left up to the developer of the host application.
- For e.g.
    - Claude shows resources on clicking the ‘+’ button in the chat input and allows user to include them in a prompt
    - Cursor uses the @ symbol to access documents
- The user can explicitly include a resource in a prompt or the LLM can decide on its own too when it wants to use some resources

## Prompt templates

- Prompt templates allow MCP servers to give prompts with placeholders which can be filled in by the user when using the template
- A practical reason to use this as someone developing an MCP server for an application is to provide a prompt template that has specific instructions on some complicated set of tool uses to achieve a task
- Example
    - You are building an MCP for app XYZ
    - You have tools t1,t2, …. t10
    - For a common task, user might give input X and the LLM needs to call tools t1 → t7 → t5 → t8
    - Instead of relying on the LLM to figure it out from the tool descriptions, it is better to provide a prompt template where user can just provide the input X and the prompt has the instructions on how to use the tools

### How prompt templates are used

- Almost exactly same as resources
- Only difference is that if the prompt has placeholders then the client needs to handle the UI for taking user input for those placeholders (if there are any placeholders)

## MCP implementation compared to tool calling

- Similar to normal tool calling, MCP is implemented by the system that surrounds the LLM by structuring the inputs and outputs as text for the LLM to understand
- The LLM is still just “text in”-”text out” AI model
- So like you provide tool context in structured inputs and the LLM says it wants to call tools via structured outputs, similarly other MCP resources are exposed to LLMs and LLMs access MCP tools and resources
- MCP just standardises the way you provide structured context on tools and other useful things like resources and prompts that application builders can use to connect their apps to AI host apps

# MCP limitations

- MCP suffers from all the limitations that regular tool calling does. Its just a standardised way to expose tools to an LLM application.

### API can NOT be 1:1 mapped to MCP tools

- APIs suck, they were meant for machine readability and they are structured in ways that made sense to the engineers for their system architecture
- APIs have to be wrapped around more higher level abstractions that a human can easily understand when exposing to LLMs
- For example -
    - If you are swiggy, you will have APIs for searching restaurants and you may have a separate API to apply filters on the list of restaurants
    - You can expose those two APIs separately and hope that the model will understand how to use them properly
    - But you notice that most users want to search and then filter by ratings and distance
    - So giving a single wrapper tool that searches and filters makes more sense for the user as well as LLM
    - You can also provide context in the “search and filter” tool description to prompt the LLM to ask user whether they want to apply any filters if they don’t specify in their first prompt

# MCP at a more technical level (for builders)

## ⚠️ Prerequisite technical knowledge quickie

There are some nuances in how the MCP client and server communicate with each other for which the below information will be helpful to understand

### Internet protocol stack

- The internet works on a layered set of protocols starting from the physical hardware level (ethernet or wifi protocols) to the application layer (HTTP, FTP etc)
- This layered stack allows separation of concerns for developers working at different layers of the stack and standardises the interface between the stacks
- Overly simplified example
    - Companies developing wifi routers only implement the wifi protocol
    - Companies manufacturing wifi chips for a phones know all wifi routers implement the protocol so they write their chips accordingly and implement the interface for the next higher layer of the protocol (lets say network layer)
    - Companies developing OS for phones know that all wifi chips implement network layer protocol so they write code to handle that and implement the interface for the next higher layer (application layer)
    - Application developers for the OS can then implement applications based on the application layer protocols without worrying about the lower levels of the stack

> [!TIP]
> **Takeaway: Protocols are stacked in layers for separation of concerns (abstraction)**
>
> - Application developer doesn't have to think about whether the device is connected via ethernet or wifi

### JSON-RPC protocol

- For any layer of the protocol stack, you have to write code to structure your APIs and to structure the data that you send and receive from those APIs
    - “API” here is used in the general sense as the “interface” (”I” of API) between any two entities communicating using a protocol
- For example - REST APIs is a way of structuring APIs at the application layer and most APIs use JSON to structure the information for the input and output
    - REST isn’t a protocol but more like a guideline on how to structure APIs
- Similarly RPC (Remote procedure calls) is a different way to structure your APIs
- JSON-RPC is specific protocol that covers both the RPC paradigm for structuring APIs and the way to structure the information using JSON for the remote procedure calls

> [!TIP]
> **Takeaway: Functionally both JSON-RPC and REST APIs are equivalent. It's just a way for two entities to talk to each other in a standard way.**
>
> - What can be done with one can be done with the other
> - The only difference is in how some systems/functionality might be easier to understand or develop with one approach vs the other
> - So no need to think more about the nuances and differences.

### STDIO streams

- When a program runs on a computer via the operating system, the OS needs to provide inputs to the program and receive outputs from the program
- The OS manages this by implementing an input and output stream for every program
    - These streams are managed by the OS using the computers memory, details can be ignored
- STDIN and STDOUT are those input and output streams and they are accessible via the OS APIs in any programming language
- The default STDIN is mapped to keyboard input and default STDOUT is mapped to the terminal screen
- The OS APIs give you ways to intercept the streams or map it to different channels. This allows programs to talk to each other using these streams
- Example of this in basic terminal commands

```bash
# Redirect stdin from a file (program reads file instead of keyboard)
python script.py < input.txt

# Redirect stdout to a file (output goes to file instead of screen)
python script.py > output.txt

# The pipe operator: connect one program's stdout to another's stdin
cat data.json | python process.py | grep "error"
```

That last one creates this:
```
┌───────────┐ stdout    stdin ┌───────────┐ stdout    stdin ┌──────────┐
│    cat    │ ──────────────► │  python   │ ──────────────► │   grep   │
└───────────┘                 └───────────┘                 └──────────┘
```

> [!TIP]
> **Takeaway: STDIO is just a way for programs running on a computer to talk to each other**
>
> - It's a channel of data exchange just like server and client are just programs communicating over the internet as the channel

### Package managers and executors

- When writing complex programs, you don’t write all the code yourself. Instead you use publicly available “packages” or “libraries” that give you functions that perform standard operations that you don’t need to write again yourself
    - For e.g. you can import a library for editing PDFs or processing images
- The number of available open source libraries is really large
- To manage this, open source communities built “package managers” that allow you to easily explore, download and install the required packages into your system when needed for use in your code
- These package managers are open source and maintained by the community
- One of the package manager for javascript is called `npm` (node package manager) and for python there are package managers like `pip` and `uv`
- Package managers also provide terminal commands like `uvx` and `npx` that allow you to download certain packages from the library and execute them immediately
    - Since package managers are just hosting code, they evolved to host code that can be run directly instead of just imported into other programs
- So these commands are just running a program on your computer and they are integrated with the package manager to download the required program and any dependancies first
- These package managers also cleverly isolate the environment for downloading packages so that different programs on the computer can use different versions of packages without conflicts

> [!TIP]
> **Takeaway: Package manager and executors are just a way to download and run programs that are uploaded by others to the package library**
>
> - Its equivalent to downloading google chrome and running it on your computer except its down using the terminal CLI

## MCP protocol as a stack

- The diagram on the right shows the MCP protocol stack
- MCP protocol documentation talks about the “data layer” and the “transport layer” of the stack (this diagram adds a third)

![Screenshot 2025-12-11 at 7.21.55 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-11_at_7.21.55_PM.png)

### Semantic layer (the logic)

- This layer has the actual semantics of the MCP protocol with functions like “get tools list” “call tool”
- This layer is implemented as libraries in various different programming languages which you can use depending on your client or server
- Client and server can be in different languages as long as they implement the same protocol

### Data layer (message format)

- MCP uses JSON-RPC to structure its APIs and format the messages for interaction between client and server

### Transport (sending and receiving messages)

- This is where MCP provides two options
- MCP allows transport in two ways
    - HTTP for remote servers that are not running on your own local system
    - STDIO for servers that are running on your own local system

> [!NOTE]
> This might be confusing how a server is running on your local system since we are used to servers always being in the cloud (remote). This will be explained in subsequent sections.

## Creating an MCP server

- The MCP server is just a program that implements functions for all the tools, resources and prompts that it wants to expose
    - So internally calling a tool “create_todo” is a function that might call a traditional API over the network
    - Even resources are functions (because you need to write code to fetch the resource)
- Those functions are then wrapped in the MCP’s JSON-RPC protocol (this is done easily by using MCP library for your programming language)
    - The exact way in which these functions are wrapped varies for different programming languages
    - You specify which function is a tool/resource/prompt to the MCP library when wrapping
- When you wrap your functions using the MCP protocol libraries, the protocol then exposes the standard functions that you can call for any application connecting to the MCP server

![Screenshot 2025-12-11 at 7.45.32 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-11_at_7.45.32_PM.png)

![Screenshot 2025-12-11 at 7.45.50 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-11_at_7.45.50_PM.png)

![Screenshot 2025-12-11 at 7.46.06 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-11_at_7.46.06_PM.png)

### Why have local servers ?

- Local servers are primarily useful for exposing tools that perform action on your computer which cannot be done with a remote server (like editing and creating files, navigating folders etc)
- Local servers cannot connect with remote applications like chatGPT because chatGPT is in the cloud
- Local servers can only connect with local applications like Cursor or claude code which run on your computer

**Remote servers pretending to be local**

- Some MCP servers use this design where they have a local server which actually talks to remote server in the backend.
- There are some technical reason why this makes sense right now but largely this design exists because the protocol is evolving and people are just building same things in different ways to figure out what works well
- An example of this is mongoDB MCP server

![Screenshot 2025-12-12 at 3.54.12 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-12_at_3.54.12_PM.png)

**Local servers pretending to be remote**

- Another interesting case is of the Figma app which runs on your computer and hosts its MCP on local host.
- What that means is that your computer is acting as a server except it is not publicly connected so only other applications on your device can access it
- In this case other application might be Cursor or Claude Code running on your machine
- The configuration you see below looks like a remote server but the IP address refers to `localhost` (your own system)
- The reason Figma does this because it is a GUI application which is opened by the user and not created as a subprocess of the Client application (this will make sense in the subsequent section [Connecting server and client](#connecting-server-and-client) )

```json
"figma-desktop": {
        "type": "http",
        "url": "http://127.0.0.1:3845/mcp"
      }
```

## Creating an MCP client

- MCP client is a lot more open ended and depends on how you implement your LLM application
- Essentially the protocol specifies the functions you have available from any MCP server.
- Its up to you to use those functions to build a good UX as well as build the orchestration layer for the model to get the required context
- This includes stuff like
    - UX for connecting new MCP servers
    - Fetching the tools and adding to LLM context in the orchestration layer
    - UX for attaching resources or prompts
- Additionally the client can also expose features to the server (two way communication)

![Screenshot 2025-12-12 at 3.31.07 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-12_at_3.31.07_PM.png)

## Connecting server and client

### Remote server

| Running server | Deploy the MCP server program like you would any other backend server. Say the URL is `https://abc.com/mcp` |
| --- | --- |
| Host application UX for connecting a server | -UX depends on host app but essentially you have to specify the URL of the remote server and any other details. 
-Typically this looks like a JSON configuration you save in a file but can have better UI (like “connectors” on chatGPT)
-If there is any authentication (login) required, then the server returns a URL for user to login, this UX has to be handled by host
-Example JSON for context7 MCP:
`"context7": {
"type": "http",
"url": "https://mcp.context7.com/mcp"
}` |
| Connection | -The host application starts an MCP client using an MCP library which then talks to the URL over the network to establish a connecting with the server
-This works just like any other API call but with a specific protocol (MCP and JSON-RPC) |

### Local server

| Running server | The server is actually a program that is made available via one of the package managers like `npm` or `uv` 
So there is no running server until the client runs the command to start the server locally |
| --- | --- |
| Host application UX for connecting a server | -Same as remote server but the JSON configuration looks different. 
-The configuration tells the host application what command to run to actually download the server from the package manager and run it
-You might remember from package manager section that commands like `npx` actually download and run programs from the package manager
-Example JSON for playwright MCP:
`"MongoDB": {
        "command": "npx",
        "args": ["-y", "mongodb-mcp-server@latest"],
        "env": {
          "MDB_MCP_CONNECTION_STRING": "<placeholder>"
        }
      }` |
| Connection | -The host application starts an MCP client using an MCP library which then runs the command to create the MCP server as a child process running on the device
-The client uses OS apis to connect to the STDIO streams of the child process to communicate with it
-This is where the “transport layer” of the MCP stack is different but the other layers work the same. 
-So it is the same API calls but instead of going over the network, it goes through the STDIO channel |

## Authentication in MCP

- Some remote servers require you to complete authentication (login)
- This is what happens when you connect Google drive to chatGPT
- Here is a flow of what happens. The UX has to be handled by the host application.
- The flow is similar to “login with Google” type authentication you see on many websites

![Screenshot 2025-12-11 at 1.38.32 PM.png](Model%20Context%20Protocol%20(MCP)/Screenshot_2025-12-11_at_1.38.32_PM.png)