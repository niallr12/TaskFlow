# TaskFlow

TaskFlow is a local-first Progressive Web App for keeping a lightweight work dashboard open all day. Version `0.1` is intentionally small and optimised around one interaction:

1. Keep the app open.
2. Type into the permanent quick capture box.
3. Press `Enter`.

Everything is stored locally in IndexedDB using Dexie. There is no backend, no sync, no authentication, and no external API dependency.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Dexie.js
- React Router
- Vite PWA plugin

## Version 0.1 Scope

- Today
- Inbox
- Waiting
- Recurring
- Completed This Week
- Permanent quick capture
- Lightweight edit modal
- Simple search across title and project
- Basic recurring tasks: daily, weekly, monthly
- Offline installable PWA

## Capture Syntax

TaskFlow uses simple deterministic parsing:

- `tomorrow`
- `today`
- `next monday`
- weekday names such as `friday`
- `every day`
- `every week`
- `every month`
- `every friday`
- `#project-name`
- `@waiting`
- `waiting for ...`

Examples:

- `Follow up with John tomorrow`
- `Waiting for cloud team`
- `Review PR #platform`
- `Export data every Friday`

## Run

This workspace uses the bundled Node runtime from the Codex desktop environment. If you are running locally with your own Node installation, use Node `24+`.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is written to `dist/`.

## PWA Install

1. Run `npm run dev` for local testing or deploy the contents of `dist/` to any static host.
2. Open the app in a Chromium-based browser.
3. Use the browser install prompt or `Install TaskFlow` from the browser menu.

## Architecture

The app stays deliberately small:

- `src/components`: shell, capture, list rows, modal
- `src/pages`: routed dashboard views
- `src/hooks`: focused React hooks
- `src/services`: Dexie database and task mutations
- `src/models`: shared types
- `src/utils`: parser, dates, recurrence, filtering

There is no backend layer and no speculative abstraction for future sync or integrations.

## Known Limitations

- Search is intentionally simple and currently only covers title and project.
- Recurrence can be created from capture text, but recurrence is not yet editable in the modal.
- There is no drag and drop, projects page, reporting, or sync.
- Global system-wide capture is out of scope for the PWA prototype.
