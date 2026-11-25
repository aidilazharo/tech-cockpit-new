# Tech Cockpit New

Clean-room local prototype inspired by [Tech Cockpit](https://github.com/aidilazharo/tech-cockpit/tree/795a3ff903e4877aa9ed89bd30f5b0be8bce1b41), using the existing [ATGV SDLC Library v0.0.10](https://github.com/aidilazharo/tech-stacks-skills/tree/3382ee79751885801d36ef665401197f2079836b) React and NestJS scaffolds. No production data or credentials copied. This is a first migration increment, **not a feature-complete clone**.

## Stack
- React 19, Vite, TypeScript 5.9 and the library's MIT-licensed Qi-inspired CSS.
- NestJS 11, Drizzle and local libSQL SQLite.
- Node 24.15+ within the library's supported 24.x range, npm 11.
- Separate manifests and upstream lockfiles. Neither lockfile contains Zustand or React Flow. No Tailwind, Tiptap, TanStack or enterprise dependencies introduced. The React lockfile retains upstream starter dependencies for reproducibility; its Express server is not launched.
- No external services, real authentication or production access. Localhost only.

## Run (two terminals)
```sh
cd NestJS_Backend
npm ci --ignore-scripts --include=optional --include=dev --no-audit --no-fund
npm run db:migrate
npm run dev
```
```sh
cd ReactTS_Frontend
npm ci --ignore-scripts --include=optional --include=dev --no-audit --no-fund
npm run dev
```
UI http://127.0.0.1:5173/ · API http://127.0.0.1:3000/api/v1/health · Swagger http://127.0.0.1:3000/api/docs.

Run `npm test` and `npm run build` in both directories. Optional Playwright: frontend `npm run test:e2e:setup`, `npx playwright install chromium`, `npm run test:e2e` with both servers stopped. The tests are supplied but not executed in the source-authoring environment.

## Implemented
Responsive navigation based on original module names, home summary and local generic register CRUD with search, persisted SQLite records, validation, scoped IDs, API health and tests. The original enterprise semantics (Okta, RBAC, ServiceNow, Azure, approval engine, audit enforcement, architecture diagrams, document rendering, notifications, imports, advanced TRM/PMO) are not migrated. Administrative-looking pages are local record prototypes only, not security or workflow implementations.

## Dependency policy
The original log showed HTTP 403 for zustand@5.0.16. Do not add it or React Flow. Use React state and native DOM/CSS/SVG. Keep locked installation; do not bypass enterprise policy. A fresh authorized install must verify all remaining packages. 
