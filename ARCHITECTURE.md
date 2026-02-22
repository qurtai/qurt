# ARCHITECTURE

System architecture for `alem`.

## Product Shape

`alem` is a desktop-first AI app that gives users vendor choice:

- bring your own API keys
- pick provider/model per preference
- chat with attachments (files/images)
- keep the architecture open for future agentic execution

## Runtime Layers

1. **Electron main process**
   - window lifecycle
   - IPC handlers for settings, API keys, and attachments
   - files: `electron/main.ts`, `electron/store.ts`, `electron/file-store.ts`
2. **Electron preload bridge**
   - safe renderer API exposed via `window.alem`
   - file: `electron/preload.ts`
3. **Renderer (React + Vite)**
   - routes, UI, chat workflows, settings
   - files: `src/main.tsx`, `src/App.tsx`, `src/pages/**`, `src/components/**`

## Directory Map

- `src/components/`: reusable app components
- `src/pages/`: app-owned, routed pages (`HomePage`, `ChatPage`, `UpdatesAndFaqPage`)
- `templates/`: prebuilt template pages/layouts; do not edit unless explicitly requested
- `src/services/`: integration logic (`ai-service`, `chat-service`, `updates-faq-service`, search helpers)
- `src/hooks/`: chat orchestration (`useAlemChat`)
- `src/stores/`: client-side and content abstractions (`chat-store`, `updates-faq-store`)
- `electron/`: desktop process code and secure bridge
- `docs/faq/`, `docs/updates/`: markdown-driven content source for the Updates & FAQ UI

## Data And Persistence

- **Settings and API keys**
  - stored in `electron-store` (`alem-config`)
  - includes active provider/model, enabled models, theme, and API key map
- **Attachment binaries**
  - saved under app user data folder (`chat-attachments`)
  - metadata tracked in store `attachments` map
- **Chat history**
  - stored in browser `localStorage` under `alem.chat-history.v1`
  - normalized and validated by `BrowserChatStore`
  - sessions now include `chatListIds` plus `isArchived` for list grouping and archive semantics
- **Chat lists**
  - stored in browser `localStorage` under `alem.chat-lists.v1`
  - normalized and validated by `BrowserChatListStore`
  - default lists are `Favorites` and `Archived`
  - active list selection is carried in route query (`?list=<listId>`) to keep left/right sidebars in sync

## AI Provider Flow

- provider/model selection is user-driven in settings and model selector
- supported providers are currently OpenAI, Anthropic, Google
- `src/services/ai-service.ts` maps provider IDs to SDK clients
- attachments are converted into model file content parts before generation

## Current Scope And Boundaries

- current platform: desktop only
- no backend service is required for basic operation
- no shared cloud sync yet
- no in-app agent tool execution yet (planned)

## Forward Architecture Needs

Planned expansions and expected architecture impact:

1. **Hybrid UI**
   - add model-driven UI schema/renderer boundary
   - require strict validation for model-proposed UI blocks
2. **Agent mode**
   - tool broker abstraction (browser, terminal, files)
   - permission model, audit trail, and run lifecycle state machine
3. **Storage provider choice**
   - sync abstraction layer with pluggable providers
   - conflict handling and offline-first synchronization
4. **Mobile**
   - transport and persistence contracts that can be shared across desktop/mobile

## Architecture Decision Template

- Context:
- Decision:
- Consequences:
- Status:
- Date:
