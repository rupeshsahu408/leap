# LEAP Startup Platform

A full-stack startup ecosystem platform with AI advisor, co-founder matching, course enrollment, and funding resources.

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite 6 (port 5000)
- React Router v6
- Google Fonts (Inter + Playfair Display)

### Backend
- Express.js (port 8000)
- PostgreSQL (Replit DB)
- JWT authentication
- bcryptjs password hashing
- Google Gemini AI (gemini-1.5-flash)

## Pages & Features

### Public Pages
- `/` — Homepage (hero, stats, features, courses, testimonials)
- `/platform` — All programs with module details and pricing
- `/locations` — 6 Indian city campuses
- `/institutions` — Partnership models
- `/community` — Events, alumni, Discord
- `/contact` — Application form
- `/login` — Login
- `/register` — Register

### Protected Dashboard (requires login)
- `/dashboard` — Overview stats, quick actions, enrolled courses
- `/dashboard/ai-advisor` — Gemini AI startup advisor chat
- `/dashboard/ideas` — Create & AI-analyze startup ideas
- `/dashboard/cofounders` — Find and connect with co-founders
- `/dashboard/courses` — Enroll and track course progress
- `/dashboard/profile` — Edit skills, bio, stage, looking-for

## Database Tables
- `users` — Auth + profile (skills, stage, location, looking_for)
- `startup_ideas` — Ideas with AI feedback
- `cofounder_requests` — Connection requests between users
- `course_enrollments` — Course enrollment + progress
- `ai_conversations` — Chat history with AI advisor

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `JWT_SECRET` — JWT signing key (auto-generated)
- `GEMINI_API_KEY` — Google Gemini AI key
- `BACKEND_PORT` — Backend port (8000)

## Run
- Frontend: `npm run dev` (port 5000)
- Backend: `npm run server` (port 8000)
