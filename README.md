# md-direction — a DeepSeek Harness plugin

[English](./README.md) · [فارسی](./README.fa.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH)
bundle that adds a **three-mode text-direction control** for mixed
Persian/English markdown in the Harness Web UI conversation.

**Owner / maintainer:** N. Iranshahi (<niranshahi@gmail.com>)
**AI collaborator:** implemented with an AI coding assistant (DeepSeek Harness
GLM coding agent) acting as design & implementation helper — see
[LICENSE](./LICENSE). Both contributions are licensed under MIT.

## What it does

While reading chat replies that mix Persian paragraphs with English ones, you
can flip the whole conversation's markdown reading direction with one click:

| Mode    | Effect                                                                                                                                  |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `auto`  | Every paragraph anchors to its own first strong character: Persian paragraphs go right, English paragraphs stay left. Best for mixed content. |
| `rtl`   | All markdown paragraphs align right (`direction: rtl; text-align: right`) without breaking embedded English code, links, or numerals.      |
| `ltr`   | All markdown paragraphs align left — the environment's default look.                                                                      |

Details that matter for readability:

- **Code blocks (`pre`) are never affected** — they stay LTR in every mode, so code and line numbers are intact.
- **Inline code / tokens (`code`, `kbd`, `samp`) are bidi-isolated** so a Latin snippet inside a Persian sentence keeps its own order.
- **List and table geometry follows the chosen direction** (`padding-inline-start`, column order for `table`).
- **Your choice persists** across reloads and sessions via `localStorage` (key `dsh.mdDirection`).
- The styling is scoped to the conversation flow only (`[data-conversation-scroll]`); the sidebar, composer, and settings pages are untouched.

## Where the controls appear

- A **three-state button under the composer** (slot `conversation.composer.dock`) — clicking cycles Auto → RTL → LTR.
- A **labelled row, "Markdown Text Direction", in `Settings → General`** (slot `settings.general.item`) — an explicit segmented control.

## Install

The bundle is a plain, self-contained package: no build step, no dependencies.
React and every other client module come from the DSH module loader at runtime.

1. **Get the folder** — `git clone` this repository, or download and unpack a release archive. Put it anywhere you like *outside* any git working copy you care about, for example:

   | OS      | Suggested location                                  |
   |---------|-----------------------------------------------------|
   | Windows | `C:\Users\%USERNAME%\dsh-plugins\md-direction`      |
   | Linux   | `~/dsh-plugins/md-direction`                        |
   | macOS   | `~/dsh-plugins/md-direction`                        |

2. **Install into a DSH profile** — in a DSH session, ask your agent to run the
   profile plugin-manager install with the **absolute path** of the folder from
   step 1 (see `README` code example below), e.g.:

   ```text
   install_bundle <absolute-path-of-md-direction-folder>
   ```

   The profile links the folder (no copy). `application: applied` in the tool's
   result means the row is live.

3. **Reload the Harness web page once** — the browser loads the client module
   at page boot; a plain app restart also works.

> **Platform note:** the plugin itself is platform-agnostic — it ships only a
> YAML patch, a browser JS module, locale JSON, and an SVG icon. Nothing here
> is Windows-specific. The only thing that changes per OS is where you choose
> to keep the folder (table above). DeepSeek Harness installs differ per
> platform, but the install mechanism (`plugin_manager` / bundle patch) is the
> same everywhere.

## Uninstall

Run the profile plugin-manager removal for `@local/md-direction`
(`remove_bundle`), then delete the folder if you no longer want it locally.
Your direction choice is stored in that machine's browser `localStorage`,
not inside the plugin.

## Repository layout

```
package.json          # dsh.bundle.patch + dsh.client manifest, author/license metadata
cordis.patch.yml      # inserts the plugin row into the profile composition
index.js              # Host half (no-op; the Client half owns all rendering)
client.js             # Browser module: control UI, direction stylesheet, mode store
locale/en.json        # bundle inventory metadata (title/description) — English
locale/fa.json        # bundle inventory metadata — Persian
icon.svg              # original icon
LICENSE               # MIT
README.md             # this file
README.fa.md          # Persian readme
```

## How it works (for maintainers)

- One data attribute on `<html>` (`data-dsh-md-dir="auto" | "rtl" | "ltr"`) — set in a cleanup-safe `ctx.effect`, removed on unload. The same idiom the harness itself uses (`html[data-platform=darwin]`, `body[data-ds-dark-theme]`).
- One injected stylesheet with rules scoped as
  `html[data-dsh-md-dir] [data-conversation-scroll] :is(p,h1..h6,ul,ol,li,blockquote,table,thead/tbody/tfoot,tr,td,th,summary,dt,dd,figcaption)`.
- A tiny in-module store (plain JS + React `useState`/`useEffect`) shared by the dock button and the settings row.
- Locale dictionaries are embedded in `client.js` (`en` reference, `fa` mirror) and the labels fall back to English if the locale service is unavailable.
- Theme is followed via `--dsw-alias-*` CSS custom properties only; no literal colors outside the icon.

## Editing and re-releasing

- Change `client.js` → reinstall the bundle (`remove_bundle` + `install_bundle`) → reload the page (the browser caches the client module per boot).
- Bump `version` in `package.json` when you publish an update; `install_bundle` refuses a same-version reinstall (`already-installed`).
- DSH compatibility tested on `0.2.1-rc.2`. The plugin uses only stable extension
  surfaces: Client Slots (`conversation.composer.dock`, `settings.general.item`),
  the locale service, and theme tokens.

## Credits & copyright

- © 2026 N. Iranshahi (<niranshahi@gmail.com>);
- Implemented with an AI coding assistant, per the [LICENSE](./LICENSE).
