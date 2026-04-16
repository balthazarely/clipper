# Skill 3 - Routing, URL State, and Navigation UX

## Goal

Make list filtering shareable and restorable by syncing search state to URL query params.

## Relevant Files

- `src/pages/FolderListPage.tsx`
- `src/pages/FolderDetailPage.tsx`

## Tasks

1. Re-enable search UI in folder list if currently disabled.
2. Sync folder search term to query param `q`.
3. Initialize search input from URL on page load.
4. Preserve query state when navigating back from folder detail.

## Constraints

- Use React Router APIs already in project.
- Do not add global state for this.
- Keep behavior resilient when query param is missing.

## Acceptance Checklist

- Searching updates URL without full page reload.
- Refreshing page keeps the same filtered view.
- Back navigation returns with same search query.
- Empty query cleans URL state.

## Practice Focus

- URL as state
- Navigation consistency
- Router-driven UX
