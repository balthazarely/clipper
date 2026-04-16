# Chrome DevTools MCP Setup and Basic Usage

This guide documents how to install and use Chrome DevTools MCP with the plugin setup used in this workspace.

## 1) Prerequisites

- VS Code
- Node.js 20.19.0 LTS or newer LTS
- Google Chrome installed

Check your Node version:

```bash
node -v
```

If you use `nvm`, set Node 20 as default so VS Code extension host also uses it:

```bash
nvm install 20
nvm alias default 20
nvm use 20
```

## 2) Plugin Configuration

Install as a Plugin (recommended):

The easiest way to get up and running is to install `chrome-devtools-mcp` as an agent plugin. This bundles the MCP server and all skills together so your agent gets both the tools and guidance needed to use them effectively.

1. Open the Command Palette:

- macOS: `Cmd+Shift+P`
- Windows/Linux: `Ctrl+Shift+P`

2. Run `Chat: Install Plugin From Source`.
3. Paste this repository URL:

```text
https://github.com/ChromeDevTools/chrome-devtools-mcp
```

After installation, the plugin provides the `chrome-devtools` MCP server and associated skills.

Manual plugin config (advanced/reference):

If you need to verify or customize the plugin config, it should look like this:

```json
{
  "name": "chrome-devtools-mcp",
  "version": "0.21.0",
  "description": "Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer",
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

## 3) Important Node Version Gotcha

If you see this error:

```text
ERROR: `chrome-devtools-mcp` does not support Node v16.x.
Please upgrade to Node 20.19.0 LTS or a newer LTS.
```

It usually means VS Code was started before you switched Node in your terminal.

Fix:

1. Set default Node with `nvm alias default 20`.
2. Fully quit VS Code.
3. Reopen VS Code.
4. Restart the MCP server.

## 4) Quick Smoke Test

After the server is running:

1. Run `list_pages`.
2. Run `new_page` with `https://example.com`.
3. Run `take_snapshot`.

If all three succeed, MCP is working end-to-end.

## 5) Basic Workflow

Typical sequence:

1. `list_pages` and `select_page` (or `new_page` / `navigate_page`)
2. `take_snapshot` to collect element `uid`s
3. Use `click`, `fill`, `press_key`, `wait_for` as needed
4. Take a new `take_snapshot` after UI changes

## 6) Control When MCP Is Used

You can decide per request whether automation should use MCP:

- "Use MCP for this"
- "Do not use MCP for this"
- "Use terminal/files only"

Recommended default for chats:

- "Default to no MCP unless I explicitly ask for it"

This keeps normal coding tasks from automatically going through browser automation.

## 7) Common Ways to Use This MCP Server

> **Sensitive data warning:** MCP has full access to whatever is visible in the browser — including cookies, auth tokens, form values, local storage, and any client data rendered on screen. Never run MCP sessions against a page that contains real user data, production credentials, or anything you would not want logged or passed to an AI model. Use test accounts, local dev servers, or mock data only.

These are practical use cases that are specific to `chrome-devtools-mcp` (browser automation + DevTools inspection), and map well to this clipper app.

1. End-to-end UI flows in the extension UI

- Open the app page, fill forms, click buttons, and verify state changes.
- Useful tools: `navigate_page`, `take_snapshot`, `fill`, `click`, `wait_for`.
- Example: create a new group, assign it to a folder, and confirm it appears in the folder list.

2. Reproduce and isolate frontend bugs quickly

- Step through exact user actions and capture the DOM/accessibility tree at each step.
- Useful tools: `take_snapshot`, `list_console_messages`, `evaluate_script`.
- Example: confirm whether a disabled Save button is due to validation, missing tabs, or a rendering bug.

3. Console and runtime error triage

- Pull browser console output directly during a failing flow.
- Useful tools: `list_console_messages`, `get_console_message`.
- Example: catch React runtime errors or extension script errors while testing save/group behavior.

4. Network/API verification

- Inspect whether requests fire, payloads are correct, and responses match expectations.
- Useful tools: `list_network_requests`, `get_network_request`.
- Example: verify save-related requests (if present) include expected group/folder data.

5. Accessibility and interaction checks

- Verify controls are present in the accessibility tree and keyboard navigation works.
- Useful tools: `take_snapshot`, `press_key`, `hover`.
- Example: confirm modal controls are reachable and labeled correctly.

6. Performance investigations for page-load/UI lag

- Record traces to find expensive scripting/layout work.
- Useful tools: `performance_start_trace`, `performance_stop_trace`, `lighthouse_audit`.
- Example: analyze slow initial render of folders/groups.

7. Visual proof for QA and regressions

- Capture screenshots after key steps to document behavior.
- Useful tools: `take_screenshot`.
- Example: keep before/after snapshots for group creation and folder assignment changes.

8. Generate TypeScript types from an untyped API response

- When an external API or browser API has no published types, use MCP to fetch a real response, inspect its shape, and generate accurate types from actual data rather than guessing.
- Useful tools: `navigate_page`, `evaluate_script`, `list_network_requests`, `get_network_request`.
- Example: call `evaluate_script` to run `chrome.tabs.query({}, r => console.log(JSON.stringify(r)))` and capture the output, then derive a `Tab` type from the real payload. Or inspect a network response body via `get_network_request` to generate a matching TypeScript interface.

9. Live CSS editing in the browser, then sync back to the codebase

- Use DevTools to experiment with styles interactively (spacing, colors, typography), then once satisfied, copy the final computed values back into the source files. This avoids the trial-and-error cycle of editing → rebuild → refresh.
- Useful tools: `evaluate_script`, `take_screenshot`, `take_snapshot`.
- Workflow:
  1. Use `evaluate_script` to apply style changes on the live page (e.g. `document.querySelector('.card').style.padding = '12px'`).
  2. Use `take_screenshot` to visually confirm the result.
  3. Once happy, translate the final values back into the corresponding `.css`, `.tsx`, or Tailwind classes in the codebase.
- Example: prototype a new card hover state by injecting a `<style>` tag via `evaluate_script`, screenshot it, then commit the equivalent Tailwind classes.

## 7.1) Chrome MCP Interaction Menu (What Each Option Means)

When people say "the Chrome MCP menu," they usually mean the set of available interaction tools. Below is a practical reference by interaction type.

### Page and tab control

- `list_pages`: show all open pages/tabs known to MCP.
- `select_page`: choose which page future commands target.
- `new_page`: open a new tab at a URL.
- `navigate_page`: go to URL, back, forward, or reload.
- `close_page`: close a selected page.

Use these first whenever you need to set browser context.

### Read/inspect the UI

- `take_snapshot`: captures an accessibility-tree snapshot with stable `uid`s for elements.
- `take_screenshot`: takes a viewport or full-page screenshot.
- `wait_for`: waits until target text appears.
- `evaluate_script`: run JavaScript in the current page to inspect state.

`take_snapshot` is the most important inspection step before clicking or filling.

### Click/type/form interactions

- `click`: click an element by `uid`.
- `double click`: use `click` with `dblClick: true`.
- `hover`: hover an element.
- `fill`: set one field value.
- `fill_form`: set multiple fields in one call.
- `type_text`: keyboard typing into focused input.
- `press_key`: keyboard shortcuts and special keys (Enter, Escape, Ctrl+...).
- `drag`: drag-and-drop between two elements.
- `upload_file`: upload a local file through file input.
- `handle_dialog`: accept/dismiss browser dialogs.

Use `fill_form` when multiple inputs belong to one submit action, and use `press_key` for keyboard-driven UX checks.

### Console and runtime debugging

- `list_console_messages`: list console output since navigation.
- `get_console_message`: inspect a specific console entry in detail.

Use these after reproducing a bug to confirm JS/runtime errors.

### Network inspection

- `list_network_requests`: list requests made by the page.
- `get_network_request`: inspect one request/response body and headers.

Use for API verification, payload validation, and response debugging.

### Performance and quality audits

- `performance_start_trace`: begin trace recording (optionally with reload).
- `performance_stop_trace`: stop and save trace.
- `performance_analyze_insight`: inspect a specific performance insight from a trace.
- `lighthouse_audit`: run Accessibility/SEO/Best-Practices audit.

Use these when the app is slow, LCP is high, or interaction latency is unclear.

### Emulation and environment simulation

- `emulate`: simulate network speed, CPU throttling, viewport/device, geolocation, user agent, and color scheme.
- `resize_page`: set page dimensions quickly.

Use emulation to reproduce "works on my machine" bugs and mobile-specific issues.

### Memory and advanced diagnostics

- `take_memory_snapshot`: capture a JS heap snapshot for memory leak analysis.

Use only when memory growth, OOM, or leak behavior is suspected.

### Quick recommended interaction pattern

1. `list_pages` or `new_page`
2. `select_page` (if needed)
3. `navigate_page`
4. `take_snapshot`
5. `click` / `fill` / `press_key`
6. `take_snapshot` again
7. `list_console_messages` and `list_network_requests` if behavior is wrong

## 8) Troubleshooting Checklist

- Confirm `node -v` is `20.19.0` or newer.
- Confirm VS Code was restarted after changing Node.
- Confirm MCP server status is Running.
- Try smoke test commands again.
- If needed, reinstall/update with:

```bash
npx chrome-devtools-mcp@latest --help
```

This verifies the package can execute in your current Node environment.
