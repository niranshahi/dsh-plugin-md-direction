# AGENTS.md — instructions for AI agents working in this repository

This is the single source of truth for AI assistants (DeepSeek Harness agents,
Claude, Cursor, Devin, …) working in this repo. Humans should read
[README.md](./README.md) (English) or [README.fa.md](./README.fa.md) (Persian).

## What this repository is

A **DeepSeek Harness (DSH) bundle** — `@local/md-direction` — that adds a
three-mode text-direction control (Auto / RTL / LTR) for mixed Persian/English
markdown in the Harness Web UI conversation.

It is a **zero-dependency, no-build-step** package: a YAML patch, one browser
JS module, locale JSON files, and an SVG icon. React and all other client
modules are provided by the DSH module loader at runtime. Never add a
bundler, `dependencies`, or install scripts.

## Layout

| File | Role |
|---|---|
| `package.json` | `dsh.bundle.patch` + `dsh.client` manifest, author/license metadata |
| `cordis.patch.yml` | Inserts the plugin row into a profile's composition |
| `index.js` | Host half (intentionally a no-op; rendering lives in the Client half) |
| `client.js` | Browser module: control UI, direction stylesheet, mode store |
| `locale/*.json` | Bundle inventory metadata (title/description); `en` is reference, `fa` mirrors it |
| `icon.svg` | Original icon (required; never replace with placeholder artwork) |
| `README.md` / `README.fa.md` | Human docs (English / Persian) — keep both in sync |

## Install / update / uninstall cycle (memorize this)

The profile **links** the folder; it does not copy it:

- Install: `plugin_manager install_bundle <absolute-path-of-this-folder>` → expect `application: applied`.
- After changing **any JS module** (`client.js`, `index.js`): `remove_bundle @local/md-direction` then `install_bundle` again, then reload the web page (the browser caches the client module per page boot).
- After changing **only metadata** (`package.json` descriptive fields, locale JSON, icon): metadata is read at activation; a remove+install cycle is the safe refresh.
- Uninstall: `remove_bundle @local/md-direction`. Files stay on disk.
- `install_bundle` refuses a same-version reinstall (`already-installed`) — bump `version` in `package.json` first.

## Verification loop (light, no build)

1. JSON validity: `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"` (also for `locale/*.json`).
2. JS syntax: `node -e "new (require('vm').Script)(require('fs').readFileSync('client.js','utf8'))"` — note `index.js` is ESM (`export function apply() {}`); check it via `node --input-type=module -e "await import('./index.js')"` or just careful review.
3. The only real test is a live DSH session: install, reload the page, confirm
   the dock button under the composer and the Settings → General row appear,
   and that toggling right-aligns/left-aligns markdown in an open conversation.
   Report anything you could not verify instead of claiming visual success.

## Engineering rules

- Keep the client module resilient: every `ctx.*` call is wrapped so a failure
  degrades to the English fallback, never crashes the page. No
  `useSyncExternalStore`; use `useState` + manual `subscribe`.
- Styling uses only `--dsw-alias-*` theme tokens; keep the scope
  `[data-conversation-scroll]` and never style `pre` (code blocks must stay LTR).
- Keep every file listed in `package.json` → `files` (add new files there).
- Rename is a breaking operation: the module id in `client.js`, the `name` in
  `cordis.patch.yml`, `data-plugin`/`data-plugin-css` tag values, and the
  bundle id must all change together.
- Keep wording in both READMEs platform-neutral (no paths pointing at a
  specific machine); OS-specific path examples belong in the tables only.

## Commits and releases

- Conventional Commits (`feat`, `fix`, `docs`, `chore`, …), scope usually omitted.
- Never commit without explicit user confirmation.
- Release: bump `version`, commit, `git tag vX.Y.Z`, push branch + tag.
- Ask before running full verification you cannot do yourself; the light loop above is always allowed.
