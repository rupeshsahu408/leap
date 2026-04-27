# Foundry — A Hub for Indie Builders

A small, close hub for solo builders, indie hackers and tiny teams. The app feels like one shared room where everyone's building. MVP pillars:

1. **Builder profiles** with current project, "can help with" + "looking for" tags, and a home room.
2. **Niche rooms** — small focused feeds (SaaS, AI, Mobile, DTC, Devtools, Creators).
3. **Daily ship thread** — "What are you shipping today?" pinned at the top of the feed every day.
4. **Project pages with build logs** — append-only timeline of updates / milestones / learnings / ships.
5. **Feedback exchange** — structured asks (idea / product / landing) and rated reviews.

Co-founder match and AI advisor remain available as power-tools in the sidebar.

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
│   ├── auth.tsx         # AuthProvider + useAuth() hook (UserProfile incl. username, currentProject, niche, canHelpWith)
│   ├── posts.ts         # Firestore CRUD: posts, likes, comments, hashtag/room queries (Post incl. roomId, dailyShipDate)
│   ├── social.ts        # Users directory + follow/unfollow + counts
│   ├── messaging.ts     # Conversations + real-time messages
│   ├── startups.ts      # Startup CRUD + member queries
│   ├── buildLog.ts      # NEW — append-only build log entries (subcollection on each startup)
│   ├── feedback.ts      # NEW — feedback requests + structured reviews (top-level "feedback" collection)
│   ├── stories.ts       # NEW — Instagram-style 24-hour stories (top-level "stories" collection, client-side TTL filter + seen-set in localStorage)
│   ├── rooms.ts         # NEW — hardcoded niche room metadata (slug, name, emoji, accent)
│   ├── daily.ts         # NEW — todayKey() / prettyDate() helpers for the daily ship thread
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
│   ├── PostCard.tsx     # Post + likes + inline comments
│   ├── DailyPrompt.tsx  # NEW — "What are you shipping today?" card on the feed
│   ├── BuildLogTimeline.tsx # NEW — vertical timeline + composer for project build logs
│   └── StoryRail.tsx    # Founder spotlight scroller (kept for visual variety)
└── pages/
    ├── SignIn.tsx       # Google sign-in (indie-builder positioning)
    ├── Onboarding.tsx   # 4-step profile setup (identity → building → skills → looking for)
    ├── Feed.tsx         # Home feed — daily prompt + spotlight + composer + post list
    ├── Compose.tsx      # Full-page composer (mobile "Post" tab)
    ├── Tag.tsx          # Filtered feed for /tag/:tag
    ├── Profile.tsx      # Current user profile (handle, project, niche, can-help)
    ├── Network.tsx      # Discover + Following tabs, search
    ├── UserProfile.tsx  # Public profile at /u/:uid (follow + message)
    ├── Messages.tsx     # Conversation list at /messages
    ├── Conversation.tsx # 1-on-1 chat at /messages/:id
    ├── Rooms.tsx        # NEW — list of niche rooms at /rooms
    ├── Room.tsx         # NEW — single room feed + inline composer at /rooms/:slug
    ├── Feedback.tsx     # NEW — feedback exchange list with kind tabs at /feedback
    ├── FeedbackNew.tsx  # NEW — submit a feedback request
    ├── FeedbackPost.tsx # NEW — single feedback request + reviews at /feedback/:id
    ├── Startups.tsx     # Projects directory at /startups
    ├── StartupNew.tsx   # Create project form
    ├── StartupView.tsx  # Public project page at /startups/:id (now includes build log)
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

## Firestore collections (after the indie-builder pivot)

- `users/{uid}` — profile incl. `username`, `currentProject`, `niche`, `canHelpWith`, `lookingFor`, `skills`, etc.
- `posts/{postId}` — feed + room posts. Optional `roomId` (room slug) and `dailyShipDate` (`YYYY-MM-DD`).
- `posts/{postId}/likes/{uid}` and `/comments/{commentId}` (existing).
- `startups/{startupId}` and `startups/{startupId}/log/{entryId}` — NEW build-log subcollection. Entries have `kind: 'update'|'ship'|'milestone'|'learning'`, `text`, `authorId`, etc.
- `feedback/{id}` — NEW. `kind: 'idea'|'product'|'landing'`, `title`, `description`, `ask`, `link`, `reviewCount`. Subcollection `feedback/{id}/reviews/{reviewId}` with `text` + `rating` (1-5).
- `users/{uid}/following/*` and `/followers/*` (existing).

If your Firestore Security Rules previously locked things down, allow authenticated reads/writes for the new `feedback` collection and the `startups/{id}/log` subcollection.

## Roadmap

**Done — indie-hacker MVP**
- Niche rooms + per-room feeds
- Daily ship thread on the home feed
- Project build logs
- Feedback exchange with structured asks + rated reviews
- 4-step onboarding capturing handle, current project, home room, skills, can-help-with
- Indie-builder positioning across SignIn, nav, copy

**Next ideas**
- Notifications when someone reviews your feedback ask
- Weekly streak / "shipped 5 days this week" badges on profiles
- Room-pinned threads + room moderators
- Public profile at `@username` (in addition to `/u/:uid`)
- Gemini-powered "feedback drafts" so reviewers never stare at a blank box
