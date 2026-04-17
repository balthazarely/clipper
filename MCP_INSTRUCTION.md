# Chrome MCP — Project Instructions

## Activation

Do not use Chrome MCP unless the user explicitly says "use MCP" or asks for
browser automation. Default to file/terminal for all other tasks.

## Permitted Actions (no confirmation needed)

- list_pages, select_page, take_snapshot, take_screenshot
- list_console_messages, list_network_requests
- navigate_page to allowed URLs (see below)

## Actions Requiring Confirmation

- fill, fill_form, click, press_key (any write/interaction)
- emulate (device/network simulation)

## Never Do

- Navigate to any production URL
- Interact with pages containing real user data or auth tokens
- Close pages not opened in this session

## Allowed URLs

- http://localhost:3000 (dev server)
- http://localhost:6006 (Storybook)

## Standard Verification Workflow

1. list_pages → confirm dev server tab is open
2. take_snapshot → collect element uids
3. Interact only with elements confirmed in snapshot
4. take_screenshot after each meaningful state change
5. list_console_messages if behavior is unexpected

## On Failure

- Stop after 2 consecutive failed interactions
- Take a screenshot and report the DOM state
- Do not attempt workarounds without user confirmation

## Selector Conventions

- Prefer elements with data-testid attributes
- Fall back to aria-label, then role, then text content
- Never target elements by generated class names
