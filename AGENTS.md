# Annual Media Frontend Agent Guide

This file applies to the whole repository. Keep changes focused and preserve the existing product behaviour unless the task explicitly calls for a wider redesign or migration.

## Project and related links

- Frontend repository: https://github.com/miskhill/AnnualMediaFrontEnd
- Backend repository: https://github.com/miskhill/annualmedia
- Live frontend (Vercel): https://annual-media-front-end.vercel.app/
- Hosted API (Render): https://annualmediaserver.onrender.com
- Example API endpoint: https://annualmediaserver.onrender.com/api/movies

The frontend is deployed from this repository's `main` branch. The API is maintained and deployed separately from the backend repository. Render may sleep when idle, so the first API request can take several seconds.

## Technology and layout

- React 18 with functional components and hooks
- React Router 6 for routing and protected routes
- Vite for local development and production builds
- Vitest, jsdom, and React Testing Library for tests
- Axios and `fetch` for HTTP calls
- Material UI, Emotion, CSS files, and existing inline style objects for presentation
- `src/context/AuthContext.js` owns authentication state, token persistence, and Axios authorization headers.
- `src/config/env.js` is the single source of truth for API URLs and browser environment variables.
- `src/services/` contains third-party API adapters; `src/utils/` contains shared application utilities.
- `src/components/auth/`, `src/components/upload/`, and `src/components/utils/` group related UI behaviour.

## Setup and local development

Use Node.js 20 and npm. Install exactly from the lockfile:

```bash
npm ci
```

Create an ignored local environment file when needed:

```dotenv
VITE_API_BASE_URL=http://localhost:4000
VITE_TMDB_API_KEY=your_browser_safe_tmdb_key
```

Only variables prefixed with `VITE_` are available in the browser. Never put database credentials, JWT secrets, or other server-only values in a frontend environment file.

Run the frontend on its normal Vite port for frontend-only work:

```bash
npm run dev
```

For full-stack local work, the backend currently allows `http://localhost:3000` through CORS, so use:

```bash
npm run dev -- --port 3000
```

Run the backend separately from the sibling `annualmedia` repository's `server/` directory with `REACT_APP_PORT=4000`.

## Useful commands

```bash
npm test          # Run the Vitest suite once
npm run test:watch
npm run build     # Create and validate the production bundle in dist/
npm run preview   # Preview a completed production build
npm audit         # Inspect dependency advisories
```

Before completing a normal code change, run `npm test` and `npm run build`. For dependency changes, also run `npm audit` and review major-version changes separately rather than using `npm audit fix --force` automatically.

## JavaScript and React conventions

- Use ES modules and include the `.js` extension in local imports.
- Keep JSX in `.js` files; Vite is configured to treat `src/**/*.js` as JSX.
- Prefer functional components and hooks. Component names and exported component identifiers use PascalCase.
- Use `const` by default, early returns for invalid states, and `async`/`await` for new asynchronous flows.
- Use two-space indentation and semicolons. Prefer double quotes in new JavaScript while respecting the surrounding file when making a small edit.
- Include trailing commas in multiline arrays, objects, argument lists, and imports where the surrounding code does so.
- Do not perform unrelated file-renaming or repository-wide formatting. Several legacy component filenames are lowercase; preserve their paths unless a task specifically includes a casing migration.
- Keep network side effects inside event handlers, context actions, service modules, or effects with cleanup. Prevent stale async work from updating unmounted components.
- Give list items stable domain identifiers such as MongoDB `_id`, not array indexes.
- Keep user-visible loading, empty, and failure states. The hosted API can be slow to wake.

## API and authentication rules

- Import `apiUrl` or `apiBaseUrl` from `src/config/env.js`; do not hardcode backend URLs inside components.
- Use `fetchWithWakeRetry` for read requests that need to tolerate the Render cold start.
- Authentication tokens are managed by `AuthContext`. Do not add separate token stores or log tokens.
- Preserve the `/api` path prefix expected by the Express backend.
- Third-party API integration belongs in `src/services/` when it is reusable. Normalize third-party payloads before passing them into forms or components.
- Mock network calls in unit tests; tests must not depend on the live API, TMDB, TVMaze, or Open Library.

## Styling and accessibility

- Preserve the existing dark media-library aesthetic and the established red accent (`#e50914`) unless a design task says otherwise.
- Reuse existing MUI components, CSS classes, and nearby style objects before introducing another styling library or global abstraction.
- Keep layouts responsive across mobile and desktop; use the existing MUI grid breakpoints where appropriate.
- New form controls need accessible labels, clear validation text, keyboard operation, and visible focus behaviour.
- Images need meaningful `alt` text. Interactive non-button elements should be converted to semantic buttons or given complete keyboard semantics.
- Avoid broad global CSS selectors when a component class or local style can express the change.

## Testing conventions

- Co-locate tests as `*.test.js` near the code they cover.
- Test observable user behaviour with React Testing Library rather than implementation details.
- Use `MemoryRouter` for routed components and mock `useNavigate`, context hooks, Axios, or `fetch` at the boundary.
- Use `vi.clearAllMocks()` in test setup when mocks could leak between cases.
- Add coverage for success, validation/empty states, and failed network requests when changing an interactive flow.

## Repository hygiene

- Do not commit `.env*`, `node_modules/`, generated `dist/` output, credentials, or production data.
- Keep `package-lock.json` synchronized with `package.json`; use npm rather than editing the lockfile by hand.
- Prefer conventional commit subjects such as `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, or `chore(deps):`.
- Changes that alter API contracts, authentication, environment names, or CORS usually require a coordinated change in https://github.com/miskhill/annualmedia.
