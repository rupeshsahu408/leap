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
- **Firebase Auth** (Google sign-in)
- **Firebase Firestore** (real-time database, accessed directly from client)
- **Cloudinary** (image storage — unsigned uploads from the client)
- **Google Gemini AI** (`@google/generative-ai`) — wired up in a later phase

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
│   ├── cloudinary.ts    # Unsigned image upload helper
│   └── time.ts          # timeAgo() formatter
├── components/
│   ├── AppShell.tsx     # Layout (desktop sidebar + mobile bottom nav)
│   ├── Logo.tsx
│   ├── Avatar.tsx
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
    └── ComingSoon.tsx   # Stub for /discover and /network (Phase 3/4)
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

Later phases:
- `GEMINI_API_KEY` — for the AI advisor (Phase 6)

## Run
- `npm run dev` (port 5000) — handled by the "Start application" workflow

## Roadmap (phased build)
0. **Foundation** — Firebase + PWA + clean app shell ✅
1. **Identity & Profiles** — onboarding + profile pages ✅
2. **Social Feed** — posts, likes, comments, hashtags, Cloudinary images ✅
3. **Network & DMs** — follow / connect, real-time messaging
4. **Startup Pages** — public startup profiles
5. **Co-founder Match** — smart matching by skills & stage
6. **AI Advisor** — Gemini chat + idea analysis
7. **Investors & Funding** — pitch + warm intros
8. **Communities & Events** — groups, meetups, AMAs
9. **Mentorship & Learning** — mentor booking, resources
10. **Polish & Growth** — notifications, search, recommendations
