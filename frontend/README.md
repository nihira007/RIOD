# RIOD — Frontend

React + TypeScript + Vite frontend for the Research Intelligence & Opportunity
Discovery Platform. See the [root README](../README.md) for full project
documentation and installation instructions.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks with tsc -b, then builds to dist/
npm run lint
```

## Configuration

The backend URL is read from `VITE_API_BASE_URL` at build time, and can be
overridden at runtime from the in-app **Settings** page (stored in
`localStorage`, per browser). Default: `http://127.0.0.1:8000`.

```bash
cp .env.example .env   # optional — set VITE_API_BASE_URL for your environment
```

## Structure

```
src/
  components/    common/ charts/ layout/ landing/ analyze/ report/ dashboard/
  layouts/       PublicLayout, DashboardLayout
  lib/           types.ts, api.ts, store.tsx, reportSelectors.ts, utils.ts
  pages/         Landing, Dashboard, Analyze, Report, Literature,
                 PaperDetails, Reports, Settings, NotFound
```

There is no backend of its own for report history — `src/lib/store.tsx`
persists saved reports and the derived literature index to `localStorage`,
since `POST /research/analyze` is stateless.
