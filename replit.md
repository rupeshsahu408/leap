# Foundry — A Network for Builders

A social network and platform built specifically for entrepreneurs to find co-founders, share ideas, get AI-powered guidance, and grow their startups together.

## Tech Stack

### Frontend
- **React 18 + TypeScript** + **Vite 6** (port 5000, PWA-enabled)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v6** for routing
- **lucide-react** for icons
- **Inter** + **Playfair Display** (Google Fonts)
- **vite-plugin-pwa** for installable Progressive Web App

### Backend / Data
- **Local dev:** Express + Vite middleware (`server/index.ts`) on port 5000 — handles `/api/*` routes for streaming AI.
- **Production (Vercel):** static Vite build (`dist/`) served from Vercel + serverless **Edge Functions** in `api/` (e.g. `api/advisor/chat.ts`). `vercel.json` rewrites all non-`/api/*` paths to `index.html` so client routing works.
- **Firebase Auth** (Google sign-in)
- **Firebase Firestore** (real-time database, accessed directly from client)
- **Cloudinary** (image storage — unsigned uploads from the client)
- **Google Gemini** (`@google/genai`) — uses `GEMINI_API_KEY` from env. In Replit dev only, falls back to the managed Replit AI Integrations vars (`AI_INTEGRATIONS_GEMINI_BASE_URL` + `AI_INTEGRATIONS_GEMINI_API_KEY`) so no key is needed locally.

## Project Structure

```
src/
├── App.tsx              # Routes + auth guards
├── main.tsx             # Entry, registers service worker
├── index.css            # Tailwind v4 + theme
├── lib/
│   ├── firebase.ts      # Firebase init (auth, firestore, providers)
│   ├── auth.tsx         # AuthProvider + useAuth() hook
│   ├── posts.ts         # Firestore CRUD: posts, likes, comments, hashtag query
│   ├── social.ts        # Users directory + follow/unfollow + counts
│   ├── messaging.ts     # Conversations + real-time messages
│   ├── startups.ts      # Startup CRUD + member queries
│   ├── match.ts         # Co-founder scoring + ranking (client-side)
│   ├── advisor.ts       # Firestore CRUD for advisor chat history
│   ├── cloudinary.ts    # Unsigned image upload helper
│   └── time.ts          # timeAgo() formatter
├── components/
│   ├── AppShell.tsx     # Layout (desktop sidebar + mobile bottom nav)
│   ├── Logo.tsx
│   ├── Avatar.tsx
│   ├── FollowButton.tsx
│   ├── UserCard.tsx
│   ├── StartupCard.tsx
│   ├── StartupForm.tsx  # Shared create/edit form
│   ├── MatchCard.tsx    # Co-founder match recommendation card
│   ├── HashtagText.tsx  # Renders #hashtags as Links
│   ├── PostComposer.tsx # Text + optional image, hashtag-aware
│   └── PostCard.tsx     # Post + likes + inline comments
└── pages/
    ├── SignIn.tsx       # Google sign-in
    ├── Onboarding.tsx   # 3-step profile setup
    ├── Feed.tsx         # Home feed — composer + real-time post list
    ├── Compose.tsx      # Full-page composer (mobile "Post" tab)
    ├── Tag.tsx          # Filtered feed for /tag/:tag
    ├── Profile.tsx      # Current user profile
    ├── Network.tsx      # Discover + Following tabs, search
    ├── UserProfile.tsx  # Public profile at /u/:uid (follow + message)
    ├── Messages.tsx     # Conversation list at /messages
    ├── Conversation.tsx # 1-on-1 chat at /messages/:id
    ├── Startups.tsx     # Ventures directory at /startups
    ├── StartupNew.tsx   # Create venture form
    ├── StartupView.tsx  # Public venture page at /startups/:id
    ├── StartupEdit.tsx  # Owner-only edit + delete
    ├── Match.tsx        # Co-founder match recommendations at /match
    └── Advisor.tsx      # AI advisor chat at /advisor (streaming)
server/                  # Local dev only (not deployed to Vercel)
├── index.ts             # Express + Vite SSR-middleware host (port 5000)
└── ai.ts                # POST /api/advisor/chat — SSE stream from Gemini
api/                     # Vercel serverless Edge Functions (production)
└── advisor/
    └── chat.ts          # POST /api/advisor/chat — Edge runtime, streams Gemini
public/
├── icons/               # PWA icons (SVG)
└── favicon.svg
```

## Routing & Auth

- `/signin` — public, Google sign-in
- `/onboarding` — auth required, completed once per user
- `/` — feed (auth + onboarded required)
- `/profile` — current user profile

`AuthProvider` listens to Firebase Auth, ensures a `users/{uid}` document
exists in Firestore, and exposes `signInWithGoogle`, `signOut`, and
`saveProfile` helpers.

## Environment Variables (required for Firebase)

Stored as Replit secrets (Vite reads them at build/dev via `import.meta.env`):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Server-side only (do **not** prefix with VITE_, never expose to the browser):
- `GEMINI_API_KEY` — Google Gemini API key from https://aistudio.google.com (required in production on Vercel)

Auto-managed by Replit during local dev (used as a fallback when `GEMINI_API_KEY` is unset):
- `AI_INTEGRATIONS_GEMINI_BASE_URL`, `AI_INTEGRATIONS_GEMINI_API_KEY`

A full template lives in `.env.example`.

## Run
- `npm run dev` (port 5000) — handled by the "Start application" workflow.
- `npm run build` — produces the static SPA in `dist/` for Vercel.

## Deploy (Vercel)
1. Push to GitHub, then import the repo on Vercel.
2. Framework auto-detects as Vite. No build settings needed (`vercel.json` covers it).
3. In **Project → Settings → Environment Variables**, add every var listed in `.env.example` (Firebase, Cloudinary, and `GEMINI_API_KEY`).
4. In Firebase Console → Authentication → Settings → **Authorized domains**, add the Vercel domain (e.g. `foundry.vercel.app`) and any custom domain.
5. Deploy.

## Roadmap (phased build)
0. **Foundation** — Firebase + PWA + clean app shell ✅
1. **Identity & Profiles** — onboarding + profile pages ✅
2. **Social Feed** — posts, likes, comments, hashtags, Cloudinary images ✅
3. **Network & DMs** — people directory, follow, public profiles, real-time DMs ✅
4. **Startup Pages** — public startup profiles, directory, ownership/edit ✅
5. **Co-founder Match** — smart ranking by complementary skills, stage, intent ✅
6. **AI Advisor** — Gemini chat tailored to founder profile, streaming, history in Firestore ✅
7. **Investors & Funding** — pitch + warm intros
8. **Communities & Events** — groups, meetups, AMAs
9. **Mentorship & Learning** — mentor booking, resources
10. **Polish & Growth** — notifications, search, recommendations
