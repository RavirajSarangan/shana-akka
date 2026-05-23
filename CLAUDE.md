# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ElderEase** is a MERN-stack elder-care platform with three separate React/Vite frontends and one Node/Express backend.

## Running the Project

Each of the four services must be started independently:

```bash
# Backend (port 5000)
cd "New folder/elder-ease/server" && npm run dev

# Elder portal (port 5173)
cd "New folder/elder-ease/elder" && npm run dev

# Family portal (port 5175)
cd "New folder/elder-ease/family" && npm run dev

# Admin portal (port 5174)
cd "New folder/elder-ease/admin" && npm run dev
```

All three Vite frontends proxy `/api` requests to `http://localhost:5000` — always use relative paths like `/api/...` in frontend code, never hardcode `http://localhost:5000`.

## Architecture

```
server/          Node/Express + Socket.io backend
  routes/        14 API route modules
  models/        14 Mongoose models
  middleware/    auth.js — JWT + role-based auth
  socket/        callHandler.js — WebRTC signaling for in-app calls

elder/src/       Elder portal
  pages/         Full-page views (ElderDashboard, VirtualNurse, etc.)
  components/    Reusable UI (VoiceAssistant, CallButton, IncomingCall)
  hooks/         useVoiceAssistant.js, useCall.js
  context/       AuthContext, UIContext (language/accessibility)

family/src/      Family member portal
  pages/         FamilyDashboard (central hub)
  components/    IncomingCall
  hooks/         useCall.js

admin/src/       Admin portal
```

## Key Integrations

### ElevenLabs TTS
- API key in `server/.env` as `ELEVENLABS_API_KEY`
- Voice ID in `server/.env` as `ELEVENLABS_VOICE_ID` (default: Rachel `21m00Tcm4TlvDq8ikWAM`)
- Endpoint: `POST /api/assistant/speak` — takes `{ text }`, returns `audio/mpeg` stream
- All speak calls in `elder/` fetch this endpoint; browser TTS is the fallback
- The `speak()` function lives in `elder/src/hooks/useVoiceAssistant.js`

### In-App Voice Calling (WebRTC + Socket.io)
- Elder calls a linked family member by userId — no phone number needed
- Socket.io server (`server/socket/callHandler.js`) routes signaling events
- WebRTC peer connection is browser-to-browser (audio only)
- STUN server: `stun:stun.l.google.com:19302`
- Call flow: `call-request` → `call-accept/reject` → `webrtc-offer/answer` → `ice-candidate` → `call-end`
- Elder portal uses `useCall` hook + `<CallButton>` + `<IncomingCall>` components
- Family portal uses `useCall` hook + `<IncomingCall>` component
- Family contacts fetched from `GET /api/family/contacts` (ElderFamilyLink model, Approved status only)

### Virtual Nurse
- `POST /api/assistant/query` — intent-based keyword matching (6 intents: medication, reminder, routine, memory, notes, help)
- Frontend: `elder/src/components/VoiceAssistant.jsx` + `elder/src/pages/VirtualNurse.jsx`

## Authentication

- JWT stored in `localStorage` as `token`
- Backend: `Authorization: Bearer <token>` or `x-auth-token: <token>` header
- Roles: `Elder`, `Family Member`, `Admin`
- Family member access to elder data requires `ElderFamilyLink.consentStatus === 'Approved'`

## Environment Variables (`server/.env`)

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/elder-ease
JWT_SECRET=...
NODE_ENV=development
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

## Multi-language Support

- Languages: English, Sinhala, Tamil
- Translations in `elder/src/utils/translations.js`
- Access via `const { t } = useUI()` hook
