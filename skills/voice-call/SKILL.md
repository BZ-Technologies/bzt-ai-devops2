---
name: voice-call
description: Start voice calls via the BZ AI DevOps2 voice-call plugin.
metadata:
  {
    "openbz":
      {
        "emoji": "📞",
        "skillKey": "voice-call",
        "requires": { "config": ["plugins.entries.voice-call.enabled"] },
      },
  }
---

# Voice Call

Use the voice-call plugin to start or inspect calls (Twilio, Telnyx, Plivo, or mock).

## CLI

```bash
openbz voicecall call --to "+15555550123" --message "Hello from BZ AI DevOps2"
openbz voicecall status --call-id <id>
```

## Tool

Use `voice_call` for agent-initiated calls.

Actions:

- `initiate_call` (message, to?, mode?)
- `continue_call` (callId, message)
- `speak_to_user` (callId, message)
- `end_call` (callId)
- `get_status` (callId)

Notes:

- Requires the voice-call plugin to be enabled.
- Plugin config lives under `plugins.entries.voice-call.config`.
- Twilio config: `provider: "twilio"` + `twilio.accountSid/authToken` + `fromNumber`.
- Telnyx config: `provider: "telnyx"` + `telnyx.apiKey/connectionId` + `fromNumber`.
- Plivo config: `provider: "plivo"` + `plivo.authId/authToken` + `fromNumber`.
- Dev fallback: `provider: "mock"` (no network).
