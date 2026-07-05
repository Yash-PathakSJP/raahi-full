# RAAHI — Your Journey, Our Path 🧭

A full-stack MERN travel-companion platform: a public marketing landing page that funnels visitors into signup/login, plus a complete in-app experience — discover like-minded travelers, get AI-style compatibility scoring, plan trips together, and chat in real time.

This repo contains:
- **`/server`** — Node.js + Express + MongoDB (Mongoose) REST API, JWT auth, Socket.io real-time chat, plus public endpoints (newsletter, testimonials, trip showcase) for the landing page
- **`/client`** — A single React 18 + Vite SPA containing both:
  - the **public landing page** (`src/landing/`) at `/` — marketing site with its own plain-CSS design system, scoped so it can't clash with the dashboard
  - the **authenticated dashboard** (`src/pages/`, `src/components/`, etc.) behind `/login`, `/signup`, `/dashboard`, etc. — styled with Tailwind CSS, matching the RAAHI product design system

---

## 🔗 How the landing page connects to the dashboard

- Visiting `/` renders the marketing landing page. All "Get Started", "Find Travel Buddy", "Explore Travelers", "View All Trips", and "Get Started Free" CTAs route to **`/signup`** via React Router (no full page reload).
- The header's "Login" link and the **Get Started** button automatically swap to a **"Go to Dashboard"** button once a visitor is authenticated (checked via the same `AuthContext` used by the rest of the app).
- After signup → OTP verification, or after login, users land on `/dashboard` — the existing protected app shell.
- Both halves are part of the same Vite build and the same Express server in production, so there's one app to deploy, not two.

---

## ✨ Features

**Landing Page**
- Hero, features, how-it-works, traveler discovery preview, trip showcase, AI compatibility preview, testimonials, community section
- Newsletter signup backed by a real `/api/subscribe` endpoint (stores to MongoDB)
- Light/dark theme toggle (scoped to the landing page only)

**Dashboard / App**
- **Authentication**: signup, login, email OTP verification, forgot/reset password, logout, OAuth stub (Google/Facebook/Apple)
- **Profile**: editable bio, interests, travel style, languages, avatar initials
- **Discover**: search & filter travelers by interest
- **AI Compatibility**: explainable compatibility scoring between two users with "why you match" reasons
- **Matches**: send/accept match requests, view matched connections
- **Trips**: full CRUD, itinerary days, expenses, notes, member management
- **Messages**: real-time 1:1 chat via Socket.io with typing indicators & online presence
- **Settings**: account info, password change

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS (dashboard) + plain CSS design tokens (landing page), Axios, Socket.io-client, lucide-react, react-hot-toast |
| Backend | Node.js, Express, MongoDB + Mongoose, Socket.io, JWT, bcryptjs, Nodemailer |
| Security | helmet, express-rate-limit, express-mongo-sanitize, httpOnly cookies |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string
- (Optional) SMTP credentials for real email delivery — without them the app logs OTPs/reset links to the server console in development mode, so you can test the full flow without setting up email.

### 1. Install dependencies
```bash
# From the repo root — installs both server and client deps
npm run install:all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**Server** — copy and edit:
```bash
cd server
cp .env.example .env
```
At minimum, set `MONGO_URI` and `JWT_SECRET`. Leave the SMTP_* fields as-is for local dev — OTPs and reset links will print to your server terminal instead of being emailed.

**Client** — copy and edit (defaults work for local dev, no changes usually needed):
```bash
cd client
cp .env.example .env
```

### 3. Seed the database (recommended)
This creates sample users, trips, matches, and conversations so the dashboard isn't empty:
```bash
npm run seed
```
After seeding, log in with:
```
Email: test@gmail.com
Password: test12345
```

### 4. Run the app

From the repo root (runs both client and server together):
```bash
npm run dev
```

Or separately, in two terminals:
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

- Client: http://localhost:5173
- Server API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

---

## 📁 Project Structure

```
raahi/
├── server/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers (auth, users, trips, matches, chat, public)
│   ├── middleware/     # auth guard, error handler, rate limiter
│   ├── models/         # Mongoose schemas (User, Trip, Match, Conversation, Message, NewsletterSubscriber)
│   ├── routes/         # Express routers (incl. publicRoutes for the landing page)
│   ├── sockets/        # Socket.io real-time chat handler
│   ├── utils/          # email, JWT cookie helper, error class, seed script
│   └── server.js       # App entry point (also serves the built client in production)
│
└── client/
    └── src/
        ├── landing/         # Public marketing landing page (plain CSS, scoped under .raahi-landing)
        │   ├── components/  # Header, Hero, Features, Testimonials, Footer, etc.
        │   ├── context/     # ThemeContext (light/dark toggle, landing-only)
        │   ├── data/        # siteContent.js — copy & structured content for the page
        │   ├── styles/      # tokens.css (design tokens) + global.css (scoped resets)
        │   └── LandingPage.jsx
        ├── components/      # Sidebar, Topbar, auth panels, reusable dashboard UI
        ├── context/         # AuthContext, SocketContext (shared by landing header + dashboard)
        ├── layouts/         # DashboardLayout
        ├── pages/           # Login, Signup, OTP, Forgot/Reset Password
        │   └── dashboard/   # Dashboard, Discover, Trips, Matches, Messages, Settings, etc.
        ├── utils/           # axios api client
        └── App.jsx          # Routes: "/" → LandingPage, "/login" etc. → auth, "/dashboard" etc. → app
```

---

## 🔐 Authentication Flow

1. **Signup** → account created (unverified) → OTP emailed (or logged to console in dev)
2. **Verify OTP** → account marked verified → JWT issued → redirected to dashboard
3. **Login** → JWT issued via httpOnly cookie + returned in response body (also cached in `localStorage` as a fallback for cross-origin setups)
4. **Forgot Password** → reset link emailed (or logged to console) → **Reset Password** page consumes the token from the URL

> **Note on OAuth**: The Google/Facebook/Apple buttons are wired to a real `/api/auth/oauth` endpoint, but the client-side provider SDK integration (which exchanges a real provider token) is left as a clearly-marked stub — wiring up actual OAuth app credentials is environment-specific and should be done by whoever owns the Google/Meta/Apple developer accounts for this project.

---

## 🔌 Real-time Chat

Socket.io is authenticated using the same JWT as the REST API (passed via `socket.handshake.auth.token`). Events:

| Event | Direction | Purpose |
|---|---|---|
| `conversation:join` / `conversation:leave` | client → server | Join/leave a chat room |
| `message:send` | client → server | Send a message (ack callback returns saved message) |
| `message:new` | server → client | Broadcast new message to room |
| `typing:start` / `typing:stop` | both | Typing indicators |
| `presence:update` | server → client | Online/offline status |

---

## 🧪 API Overview

All routes are prefixed with `/api`.

| Method | Route | Description |
|---|---|---|
| POST | `/auth/signup` | Create account, sends OTP |
| POST | `/auth/verify-otp` | Verify email, returns JWT |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user (protected) |
| POST | `/auth/forgot-password` | Send reset link |
| PUT | `/auth/reset-password/:token` | Reset password |
| GET | `/users/discover` | Browse travelers (protected) |
| GET | `/users/me/dashboard` | Dashboard stats (protected) |
| PUT | `/users/me` | Update profile (protected) |
| GET/POST | `/trips` | List / create trips (protected) |
| GET/PUT/DELETE | `/trips/:id` | Trip detail, update, delete (protected) |
| GET | `/matches/compatibility/:userId` | AI compatibility score (protected) |
| POST | `/matches/:userId` | Send match request (protected) |
| GET | `/chat/conversations` | List conversations (protected) |
| GET | `/chat/conversations/:id/messages` | Message history (protected) |
| POST | `/subscribe` | Newsletter signup (landing page, public) |
| GET | `/public/trips` | Showcase trips for the landing page (public) |
| GET | `/public/testimonials` | Testimonials for the landing page (public) |

---

## 🛡️ Production Notes

- Set `NODE_ENV=production` and a strong, random `JWT_SECRET` before deploying.
- Configure real SMTP credentials so OTPs/reset links are actually emailed.
- Set `CLIENT_URL` to your deployed frontend origin (used for CORS + cookie settings + reset-link generation).
- Put the API behind HTTPS — cookies are set `secure: true` automatically in production.
- Consider adding a CDN/object storage (e.g. S3) for avatar/cover photo uploads instead of local disk in `server/uploads`.
- The compatibility scoring in `matchController.js` is a simple, explainable heuristic — swap in a real ML model behind the same endpoint if needed later.

---

## 📄 License

This project was generated for demonstration/development purposes.
