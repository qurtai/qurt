# SECURITY

Security notes for `alem`.

## Threat Model (Current)

Sensitive assets:

- user API keys
- user prompts and chat history
- user attachments stored on disk

Primary risks:

- accidental exposure of API keys
- unsafe handling of user-provided files
- over-privileged tool execution in future agent mode

## Existing Controls

- API keys are kept in local Electron store, not hardcoded in source
- renderer access to privileged actions goes through preload IPC bridge
- attachments are stored with sanitized file names
- attachment operations are mediated in main process

## Security Requirements

- never log raw API keys
- avoid rendering untrusted file content as executable content
- validate and sanitize all IPC inputs for future expansion
- keep default behavior least-privilege for any tool integrations

## Future Security Work (Roadmap-Critical)

1. Add key-masking and redaction checks in all error/report paths
2. Define explicit permission prompts for agent tool use
3. Add security review gate before enabling autonomous agent mode
4. Add storage-provider threat assessment for sync capabilities

## Security Review Checklist

- [ ] No secrets committed
- [ ] New IPC channels validated and bounded
- [ ] New file operations sanitize inputs and paths
- [ ] Agent/tool actions have user-visible intent and scope
