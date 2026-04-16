# Skill 2 - Component Composition and Reuse

## Goal

Reduce duplication in folder and group list UIs by extracting reusable row and empty-state primitives.

## Relevant Files

- `src/pages/FolderListPage.tsx`
- `src/components/FolderCard/FolderCard.tsx`
- `src/components/GroupCard/GroupCard.tsx`

## Tasks

1. Extract a reusable empty-state component for list pages.
2. Extract a lightweight button variant component used for create/cancel/add actions.
3. Replace at least two duplicated UI blocks with your new components.
4. Keep existing behavior and animations unchanged.

## Constraints

- No breaking prop API changes for `FolderCard` and `GroupCard`.
- Keep component names explicit and project-specific.
- Avoid over-abstraction.

## Acceptance Checklist

- New components are used in at least two places.
- No visual regression in folder list and group card interactions.
- Drag/reorder and context menus still work.

## Practice Focus

- Composition over inheritance
- Stable component contracts
- Practical refactoring
