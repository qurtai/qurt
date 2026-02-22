# Agent Mode

## Problem

Users increasingly need AI help for executable tasks (browse, inspect files, run commands), not just text generation.

## Goal

Add an agent mode where `alem` can execute tool-based workflows on the user's machine with explicit user control and transparent actions.

## Non-Goals (Initial)

- silent background automation without user visibility
- broad unrestricted system access
- production-grade autonomy on day one

## Core Capabilities (Target)

- browser actions for web tasks
- terminal command execution for development workflows
- file read/write access for project operations

## Trust And Control Requirements

- explicit run start/stop controls
- action log visible to users
- permission prompts for sensitive scopes
- clear distinction between "plan" and "execute"

## Functional Milestones

1. Agent run lifecycle (queued, running, waiting, completed, failed)
2. Tool broker abstraction and provider-agnostic planner
3. Permission model and policy checks
4. Replayable run transcript and audit record

## Success Metrics

- task completion rate for agent-mode requests
- user trust score (control/transparency feedback)
- incident rate for unsafe or undesired tool actions
