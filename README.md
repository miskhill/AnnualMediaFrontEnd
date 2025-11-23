# Annual Media Front-End

Annual Media keeps track of every film, series, and book I get through in a year. It started as a weekend experiment, has grown into a full-stack hobby project, and now lives happily on Vercel behind a friendly little login screen.

- **Live site:** https://annual-media-front-end.vercel.app/
- **Heads-up:** The landing page is gated—only pre-created accounts (mine!) can sign in right now.

## What’s inside?
- **Curated dashboards** for Movies, Series, and Books with search, filter, sort, and year summaries.
- **Client-side pagination** so movie lists stay snappy on desktop and mobile.
- **Authenticated routes** – React Router protects the media views and keeps the nav in sync with auth state.
- **Admin-only uploads** – React Hook Form + Axios talk to the API for new entries (feature hidden behind auth for now).

## Technology Stack
- **Front end:** React 18, React Router, React Hook Form, Material UI 5, styled-components, Sonner toasts.
- **State & data:** Axios hitting my [Annual Media API](https://annualmediaserver.onrender.com/api/movies) (Node, Express, MongoDB) with JWT auth.
- **Tooling:** Vercel (hosting), Render (API hosting), ESLint (CRA defaults), npm scripts.
- **Testing:** Jest + React Testing Library. Current focus is the auth flow (login form + protected routes). Command: `WATCHMAN_SUSPEND=1 npm test -- --watch=false` on macOS when Watchman permissions complain.

## Architecture Snapshot
- `context/AuthContext.js` stores the token, syncs it with `localStorage`, and applies the JWT to every Axios request.
- `components/auth` holds the login screen and a `ProtectedRoute` wrapper so all main routes stay private.
- `components/utils` contains shared filter widgets and yearly totals logic.
- `components/upload` still houses the admin forms for later self-service content uploads.

## Deployment Notes
- Front end: auto-deployed from `main` to Vercel.
- API: Render free tier. It naps when idle, so the first login/request may take a few seconds while it wakes up.
- Environment variables: only the API holds secrets (`SECRET`, database URI). The client just needs the API base URL baked into `AuthContext`.

## Roadmap-ish
- Open up social/OAuth login once I’m ready to let friends in.
- Sprinkle in a few more targeted Jest suites (sorting, pagination) and wire GitHub Actions for CI.
- Polish the upload flow and expose it via an admin dashboard.

## Contact
Curious about the code, the stack, or the (very long) watch list? I’m at [linkedin.com/in/gary-smith-dev](https://www.linkedin.com/in/gary-smith-dev/).

Thanks for stopping by—popcorn not included 🍿
