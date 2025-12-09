# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains reference implementations for the "Building Effective Agents" patterns from Anthropic's research blog. It demonstrates multi-LLM workflows using the Anthropic Python SDK.

## Setup

```bash
pip install anthropic
export ANTHROPIC_API_KEY='your-key'
```

## Running Examples

The examples are in Jupyter notebooks in `anthropic-agent-cookbook/`:
- `basic_workflows.ipynb` - Prompt chaining, parallelization, and routing patterns
- `evaluator_optimizer.ipynb` - Iterative generation with evaluation feedback loops
- `orchestrator_workers.ipynb` - Dynamic task decomposition with worker LLMs

## Architecture

### Core Utility (`util.py`)

Two helper functions used across all notebooks:
- `llm_call(prompt, system_prompt="", model="claude-sonnet-4-5")` - Wrapper for Anthropic API calls
- `extract_xml(text, tag)` - Regex-based XML tag content extraction for parsing structured LLM responses

### Workflow Patterns

**Basic Workflows** (`basic_workflows.ipynb`):
- `chain(input, prompts)` - Sequential LLM calls where each step's output feeds the next
- `parallel(prompt, inputs)` - Concurrent processing using ThreadPoolExecutor
- `route(input, routes)` - Content-based routing to specialized prompts using LLM classification

**Evaluator-Optimizer** (`evaluator_optimizer.ipynb`):
- `generate(prompt, task, context)` - Produces solutions with chain-of-thought
- `evaluate(prompt, content, task)` - Returns PASS/NEEDS_IMPROVEMENT/FAIL with feedback
- `loop(task, evaluator_prompt, generator_prompt)` - Iterates until evaluation passes

**Orchestrator-Workers** (`orchestrator_workers.ipynb`):
- `FlexibleOrchestrator` class that analyzes tasks, breaks them into subtasks at runtime, and delegates to worker LLMs
- Uses XML format for structured communication between orchestrator and workers

### Prompt Templates (`prompts/`)

Production-quality prompts for multi-agent research systems:
- `research_lead_agent.md` - Orchestrates research with depth-first/breadth-first/straightforward query classification
- `research_subagent.md` - Worker agent with OODA loop methodology and tool call budgeting
- `citations_agent.md` - Adds citations to synthesized research reports

## Key Patterns

- **XML for structured output**: All workflows use XML tags for parsing LLM responses reliably
- **Chain-of-thought extraction**: Responses include `<thoughts>` tags for reasoning transparency
- **Temperature 0.1**: Used consistently for deterministic outputs
- **Model default**: `claude-sonnet-4-5` for balance of speed and capability
