# Anthropic Agent Cookbook - Learning Guide

Here's a structured overview to help you learn AI agent development step-by-step:

---

## Overview

This cookbook implements patterns from Anthropic's "[Building Effective Agents](https://anthropic.com/research/building-effective-agents)" research. It progresses from simple building blocks to complex multi-agent systems.

---

## Learning Path

### Step 1: Understand the Foundation (`util.py`)

Start here. Two simple helper functions power everything:

```python
llm_call(prompt, system_prompt, model)  # Wrapper for API calls
extract_xml(text, tag)                   # Parse structured LLM responses
```

**Key insight**: Agents use XML tags to structure LLM outputs for reliable parsing.

---

### Step 2: Basic Workflows (`basic_workflows.ipynb`)

Learn three fundamental patterns, in order of complexity:

#### 2a. Prompt Chaining (`chain()`)
**Concept**: Sequential LLM calls where each output feeds the next.

```
Input → LLM₁ → Result₁ → LLM₂ → Result₂ → LLM₃ → Final Output
```

**Example in notebook**: Raw text → Extract metrics → Convert to percentages → Sort → Format as table

**When to use**: Multi-step transformations, progressive refinement

---

#### 2b. Parallelization (`parallel()`)
**Concept**: Process multiple inputs concurrently with the same prompt.

```
         ┌→ LLM(Input₁) → Result₁
Prompt ──┼→ LLM(Input₂) → Result₂
         └→ LLM(Input₃) → Result₃
```

**Example in notebook**: Analyze market impact for 4 stakeholder groups simultaneously

**When to use**: Same analysis on multiple items, speed optimization

---

#### 2c. Routing (`route()`)
**Concept**: Classify input first, then route to specialized prompts.

```
Input → Classifier LLM → [billing|technical|account|product] → Specialized LLM → Response
```

**Example in notebook**: Support tickets routed to appropriate specialist prompts

**When to use**: Different input types need different handling strategies

---

### Step 3: Evaluator-Optimizer (`evaluator_optimizer.ipynb`)

**Concept**: Two LLMs in a feedback loop - one generates, one evaluates.

```
Task → Generator → Output → Evaluator → PASS? → Done
                     ↑         ↓ NO
                     └── Feedback ──┘
```

**Key functions**:
- `generate()`: Produces a solution with chain-of-thought reasoning
- `evaluate()`: Returns PASS/NEEDS_IMPROVEMENT/FAIL + feedback
- `loop()`: Iterates until evaluation passes

**Example in notebook**: Implement a MinStack class, iteratively improved based on feedback about correctness, complexity, and style.

**When to use**:
- Clear evaluation criteria exist
- Iterative refinement adds value
- Self-improvement is possible

---

### Step 4: Orchestrator-Workers (`orchestrator_workers.ipynb`)

**Concept**: A central "orchestrator" LLM dynamically breaks down tasks and delegates to "worker" LLMs.

```
Task → Orchestrator (analyzes & plans)
              ↓
       ┌──────┼──────┐
       ↓      ↓      ↓
   Worker₁ Worker₂ Worker₃
       ↓      ↓      ↓
   Result₁ Result₂ Result₃
```

**Key class**: `FlexibleOrchestrator`
- Orchestrator analyzes task and decides subtasks *at runtime*
- Workers execute specialized subtasks
- XML format for structured communication

**Example in notebook**: Generate marketing copy - orchestrator decides which styles (formal, conversational, etc.) are valuable for *this specific product*.

**When to use**:
- Subtasks can't be predicted in advance
- Multiple perspectives/approaches are valuable
- Flexibility > fixed parallelization

---

## Bonus: Production Prompt Templates (`prompts/`)

Three real-world agent prompts for research systems:

| File | Role |
|------|------|
| `research_lead_agent.md` | Orchestrates research, classifies query types |
| `research_subagent.md` | Worker agent with OODA loop methodology |
| `citations_agent.md` | Adds citations to synthesized reports |

---

## Progression Summary

| Level | Pattern | Complexity | Key Concept |
|-------|---------|------------|-------------|
| 1 | Chain | Simple | Sequential transformation |
| 2 | Parallel | Simple | Concurrent processing |
| 3 | Route | Medium | Dynamic path selection |
| 4 | Evaluator-Optimizer | Medium | Feedback loops |
| 5 | Orchestrator-Workers | Advanced | Dynamic task decomposition |

---

## To Get Started

```bash
cd anthropic-agent-cookbook
pip install anthropic
export ANTHROPIC_API_KEY='your-key'
jupyter notebook basic_workflows.ipynb
```

Work through each notebook in order, running the cells and modifying the examples to build intuition.
