# Hybrid UI

## Problem

Pure chat interfaces are flexible but inefficient for structured tasks such as learning sequences, multi-step operations, and agentic workflows.

## Goal

Enable a hybrid interaction model where AI can request specific UI components (cards, checklists, forms, progress views) when those components improve user outcomes.

## Non-Goals (Phase 1)

- fully autonomous UI replacement
- unrestricted model-driven DOM rendering
- dynamic code execution from model output

## User Value

- less conversational back-and-forth
- better comprehension in educational workflows
- clearer progress and decision states in complex tasks

## Functional Requirements (Phase 1)

- define a strict UI schema for model proposals
- validate proposals before rendering
- support a small whitelist of safe components
- allow users to collapse/disable hybrid UI blocks

## Safety Requirements

- reject unknown component types
- sanitize all textual content
- no executable payloads from model output
- preserve plain-chat fallback at all times

## Success Metrics

- reduction in turns-to-completion for target tasks
- user satisfaction on clarity and usefulness
- low invalid-schema rate after stabilization
