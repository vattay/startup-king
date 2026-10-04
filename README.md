# Startup King — five-hour hackathon starter

A small full-stack starting point for one experienced developer and two teammates
learning as they build. React + Vite handles the browser, and Node's built-in HTTP
server handles the API. There is no database, authentication, or deployment setup
to slow down the first demo.

**Success check:** open the app, see **“Node API is ready”**, and click the counter.
That proves React is running and can talk to Node.

## 1. Install the tools (once per computer)

You need [Git](https://git-scm.com/downloads), a terminal, and an editor
([VS Code](https://code.visualstudio.com/) is a good option).
Use **fnm** (Fast Node Manager) to install the project's Node runtime without
replacing your system's Node. npm comes with Node; don't install it separately.

### macOS

With [Homebrew](https://brew.sh/) installed:

```sh
brew install fnm
```

For the default Zsh shell, run this in your terminal **and add the same line to
`~/.zshrc`** so future terminals initialize fnm:

```sh
eval "$(fnm env --use-on-cd --shell zsh)"
```

If you use Bash instead, use the Bash initialization below.

### Linux

Install `curl` and `unzip` with your distribution's package manager, then run
fnm's official installer:

```sh
curl -fsSL https://fnm.vercel.app/install | bash
```

Open a new terminal after installation. For Bash, run this now and ensure the same
line is in `~/.bashrc` (the installer may already have added it):

```sh
eval "$(fnm env --use-on-cd --shell bash)"
```

For Zsh use the macOS initialization line in `~/.zshrc`.
If the installer URL is blocked, use the binaries and shell setup instructions in
the [official fnm guide](https://github.com/Schniz/fnm#installation).

### Windows (PowerShell)

Use PowerShell rather than Command Prompt for these instructions:

```powershell
winget install --id Schniz.fnm -e
```

Close and reopen PowerShell so the updated PATH is loaded, then run:

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

To initialize fnm automatically in future terminals, create/open your profile:

```powershell
if (-not (Test-Path $PROFILE)) { New-Item -Path $PROFILE -ItemType File -Force }
notepad $PROFILE
```

Paste the `fnm env ...` line above into that file and save. If your organization's
execution policy blocks profiles, run the initialization line in each terminal
instead of changing machine-wide policy. Without Winget, fnm also supports Scoop,
Chocolatey, and manual installation; see the official guide linked above.

## 2. Get the project running

The following commands work in macOS/Linux shells and Windows PowerShell.
If you already have the repository, skip cloning. Run all npm commands from the
repository root (the directory containing this README).

```sh
git clone https://github.com/vattay/startup-king.git
cd startup-king
fnm install
fnm use
node --version
npm --version
npm ci
npm run dev
```

`fnm install` reads `.node-version` and installs **Node 24.21.0 (24 LTS)**.
`fnm use` selects it for this terminal; `node --version` should print `v24.21.0`.
The shipped runtime includes npm 11. `--use-on-cd` also switches versions when
you enter the project directory.

Open **http://127.0.0.1:5173**. Keep the terminal running. `npm run dev` starts
both apps: Vite refreshes React when you save, and Node restarts the API when you
save a server file. Press **Ctrl+C** to stop both.

### Why this setup is isolated

- fnm manages Node versions separately from a system Node installation.
- npm **workspaces** link `client` and `server` under one root installation.
- `npm ci` installs the exact dependency versions from the committed
  `package-lock.json`; it recreates `node_modules` if needed.
- Tools are project-local and run through npm scripts. No global Vite, linter,
  npm, or other project tool installation is needed.
- Commit `package-lock.json`, not `node_modules` or `client/dist`.
  Don't mix npm with Yarn/pnpm or create additional workspace lockfiles.

## 3. Everyday commands

| Command (from the root) | What it does |
| --- | --- |
| `npm ci` | Reinstall both workspaces using the lockfile, including development tools. |
| `npm run dev` | Run the React development server and auto-restarting Node API together. |
| `npm run lint` | Lint the client with Oxlint and syntax-check the server and its tests. |
| `npm test` | Run API integration tests with Node's built-in test runner. |
| `npm run build` | Build optimized React files into `client/dist`. Node runs directly; it needs no compilation. |
| `npm start` | Start Node and preview the **built** React app at http://127.0.0.1:4173. Build first. |

To work on just one side, use `npm run dev --workspace client` or
`npm run dev --workspace server` in separate terminals. Both must be running for
the API status to succeed.

### Test and demo checklist

Before handing over your changes:

```sh
npm run lint
npm test
npm run build
```

The tests start real HTTP servers on temporary ports and check health responses,
query parameters, missing routes, and unsupported methods. They do not need a
running development server. There is no automated browser test framework yet.

Manually check the browser: the API status becomes ready, the counter increases,
and the layout is usable on a narrow screen. To check the error state, run only
the client and reload; it should show an actionable “API unavailable” message.

For the final demo, stop development with Ctrl+C, run `npm start`, and open
**http://127.0.0.1:4173**. You should see the same ready status and working counter.
This uses Vite preview to check the production build **locally**, not as a
production hosting service. Actual deployment needs a static host for
`client/dist`, a Node process for the API, and a same-origin `/api` reverse proxy.
The starter binds to loopback only; it is not exposed to your network.

## 4. Where to edit (and how the parts connect)

```text
client/
  src/App.jsx          React UI, state, and example API request
  src/App.css          Component styling
  src/index.css        Shared page styling
  src/main.jsx         React entry point
  vite.config.js       Development/preview ports and /api proxy
server/
  app.js               API routes; exported factory allows isolated tests
  app.test.js          API integration tests
  index.js             Starts the API on port 3001
.node-version          Shared Node version for fnm
package.json           Root commands and workspace definitions
package-lock.json      Reproducible dependency versions
```

The browser calls `fetch('/api/health')`. Vite forwards `/api` requests to
**http://127.0.0.1:3001**, so you don't need CORS or hard-coded API URLs in React.
`GET /api/health` returns:

```json
{ "status": "ok", "message": "Node API is ready" }
```

For a first feature, agree on the endpoint name and example JSON together,
add a route in `server/app.js` **before the 404 response**, write a matching test,
and call that endpoint from `client/src/App.jsx`. Validate incoming data before
using it. Don't assume the health endpoint provides authentication or security
for sensitive data.

Add a dependency only when you need it, from the root:
`npm install <package> --workspace client` (or `--workspace server`).
For a development-only tool add `--save-dev`. Commit the changed package manifest
and root lockfile together. Never put secrets in React code or `VITE_*` variables:
browser code is public. `.env` files are ignored, but environment loading is not
configured by this starter.

## 5. Cross-platform line endings

`.gitattributes` is the team's source of truth: Git normalizes text to **LF** on
commit and checkout, including Windows. Binary files are not converted.
Windows `.bat`/`.cmd` scripts are the exception and use **CRLF**.
`.editorconfig` asks supporting editors to use the same endings and two-space
indentation. In VS Code, the bottom-right line-ending indicator should say `LF`
for JavaScript, JSON, CSS, and Markdown. Some editors need an EditorConfig plugin.

You do **not** need to change your global Git `core.autocrlf` setting;
repository attributes take precedence. Use `git diff --check` before committing
to catch whitespace problems.

If an older checkout predates these attributes, the senior developer can
normalize tracked files once, starting with a clean working tree:

```sh
git add --renormalize .
git diff --cached
```

Review that only expected line-ending changes were staged, then commit.
Don't have everyone normalize files independently during the sprint.

## 6. Five-hour team plan

| Time | Senior developer | Teammate A | Teammate B |
| --- | --- | --- | --- |
| 0:00–0:30 | Help everyone reach the ready status; agree on one demo and API JSON. | Run setup; sketch the main screen. | Run setup; list demo steps and acceptance checks. |
| 0:30–2:30 | Build the API and help with integration decisions. | Build the main React flow and components. | Build styling/secondary UI; pair on tests. |
| 2:30–3:30 | Connect the feature end-to-end and review changes. | Hook UI to the agreed API. | Test happy/error states and narrow screens. |
| 3:30–4:30 | Fix integration blockers; keep scope small. | Polish the primary flow. | Run checks and rehearse the demo. |
| 4:30–5:00 | Freeze new features; verify the built demo. | Fix only demo blockers. | Prepare the story and fallback screenshots. |

Keep one small feature per branch/PR and communicate which files you own
(especially shared `App.jsx`, `app.js`, and the lockfile). Before work, pull the
latest changes on your team's integration branch and create a feature branch.
Before committing, review `git diff` and run the checks above. Have the senior
developer review API contracts and dependency changes. After pulling changes
that modify the lockfile, rerun `npm ci`.

For AI-assisted work: ask for small changes, read the diff, and verify the
behavior yourself. Paste exact errors to your teammate, not credentials.
Aim for one reliable vertical slice, not a large unfinished feature list.

## Troubleshooting

| Symptom | Try this |
| --- | --- |
| `fnm` not found | Reopen the terminal after installation; confirm fnm is on PATH. |
| fnm says the shell isn't initialized | Run your shell's `fnm env` initialization from section 1, then `fnm use`. |
| Wrong Node version / engine warning | From the root run `fnm install`, `fnm use`, and `node --version`. Repeat shell initialization in a new terminal. |
| PowerShell blocks `npm.ps1` | Use `npm.cmd` instead of `npm` for the commands above; don't loosen machine-wide execution policy. |
| `npm ci` complains about manifest/lock mismatch | For an intentional dependency change run `npm install` at the root and commit the lockfile; otherwise restore the matching files and rerun `npm ci`. Don't delete the lockfile. |
| API unavailable / proxy error | Start both apps with `npm run dev`, then reload; check the `[api]` terminal output. |
| Port already in use | Stop any previous dev/demo terminal with Ctrl+C. Ports are fixed (5173 dev, 4173 preview, 3001 API) to avoid silently opening the wrong app. |
| Need different ports | Agree as a team; update `server/index.js` and both proxies/ports in `client/vite.config.js` together. |
| Preview missing or showing old changes | Stop dev, run `npm run build`, then `npm start`. Preview has no live reload. |
| Works on one OS only | Check Node version, LF endings, and exact filename casing in imports. Avoid shell-specific commands in npm scripts. |