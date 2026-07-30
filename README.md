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

## Build And Install Locally On Windows

If you want to run TaskFlow on your own machine as a desktop-style app:

1. Install Node.js `24` or newer.
2. Clone the repository.
3. Install dependencies:

```bash
npm install
```

4. Start the local development server:

```bash
npm run dev
```

5. Open the local URL shown by Vite, usually `http://127.0.0.1:5173/`.
6. In Edge or Chrome, install the app using the browser install button in the address bar or the browser menu.

If you want a production build instead of the development server:

```bash
npm run build
npm run preview
```

Then open the preview URL in Edge or Chrome and install TaskFlow from there.

## Run At Startup On Windows

The simplest approach is:

1. Install TaskFlow as a PWA in Microsoft Edge or Google Chrome.
2. Open the installed app once so Windows creates the app shortcut.
3. Press `Win + R`, type `shell:startup`, and press Enter.
4. In the Startup folder that opens, add a shortcut to the installed TaskFlow app.

Common ways to create that shortcut:

- Open the Windows Start menu, find `TaskFlow`, then drag it into the Startup folder.
- Or right-click the TaskFlow app shortcut, choose `Open file location`, and copy that shortcut into the Startup folder.

After that, TaskFlow will launch automatically when you sign in to Windows.

Important note:

- Because this is a local-first PWA, the app must still be served from a URL you can open locally or from a static host you control.
- If you want TaskFlow to launch at startup on a single machine without relying on a dev server, host the contents of `dist/` somewhere stable that your browser can always reach.

## Pin To The Taskbar On Windows

After installing TaskFlow as a PWA:

1. Open the installed TaskFlow app.
2. Right-click its icon on the Windows taskbar.
3. Choose `Pin to taskbar`.

You can also usually do this from the Start menu:

1. Open Start.
2. Search for `TaskFlow`.
3. Right-click it.
4. Choose `Pin to taskbar`.

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
