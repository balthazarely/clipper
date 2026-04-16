# Skill 1 - Form Validation and Derived State

## Goal

Improve the New Group flow by adding clearer validation and lightweight UX feedback.

## Relevant Files

- `src/pages/NewGroupPage.tsx`

## Tasks

1. Add inline validation message when group name is empty and user tries to save.
2. Add a character counter for description with a max length of 240.
3. Disable save when no tabs are selected or name is empty.
4. Show a small helper text near save button:
   - "Ready to save" when valid
   - "Add a name and at least one tab" when invalid

## Constraints

- Keep current visual style and Tailwind class approach.
- Do not introduce a new dependency.
- Keep state minimal and derive values when possible.

## Acceptance Checklist

- Clicking save with empty name shows helpful feedback.
- Counter updates as user types description.
- Save button state reflects validity in real time.
- Existing save logic still routes to folders on success.

## Practice Focus

- Controlled inputs
- Derived state
- UX feedback loops
