# FRONTEND

Frontend implementation guide for `alem`.

## Stack

- React 18 + TypeScript
- Vite 6
- Electron renderer via `vite-plugin-electron`
- Tailwind-based styling patterns

## Entry And Routing

- Entry: `src/main.tsx`
- App router: `src/App.tsx`
- Primary pages:
  - `src/pages/HomePage`
  - `src/pages/ChatPage`
  - `src/pages/UpdatesAndFaqPage`
- Additional prebuilt routes still come from root `templates/` via alias `@/templates`

## State And Data Flow

- `AlemContext` (`src/App.tsx`) stores user settings in memory
- settings persist through `window.alem` IPC bridge
- chat orchestration lives in `src/hooks/useAlemChat.ts`
- chat list/history persistence is in `src/stores/chat-store.ts` + `src/services/chat-service.ts`
- right sidebar history supports multi-select actions (`archive`, `delete`) backed by chat-store APIs
- archive is a soft state (`isArchived`) so archived chats are hidden from active history without hard deletion
- chat history items include the latest attached image preview when the conversation has image attachments
- Updates and FAQ UI reads content through `src/services/updates-faq-service.ts`
- Content loading/parsing is handled in `src/stores/updates-faq-store.ts`

## Provider And Model Handling

- provider catalog: `src/constants/providers.ts`
- provider key management UI: `src/components/Settings/AiProviders`
- active model switcher UI: `src/components/ModelSelector`
- model execution adapter: `src/services/ai-service.ts`

## Attachment Flow

1. user adds file in `Message` input
2. renderer converts file to base64
3. preload/main IPC saves attachment to local file store
4. chat message stores attachment metadata
5. AI service resolves attachment data for model calls

## Conventions

- prefer path aliases (`@/...`) over long relative imports
- keep reusable parts in `src/components/`
- `src/components/Icon` is the app-wide icon adapter and now maps legacy icon names to Heroicons
- keep page composition in `src/pages/`
- treat `templates/` as prebuilt reference surfaces; avoid editing unless requested

## Frontend Risks To Watch

- duplicated attachment handling logic between Home and Chat flows
- increasing route complexity as template pages transition into product pages
- future hybrid UI needs strict schema validation before rendering dynamic blocks
