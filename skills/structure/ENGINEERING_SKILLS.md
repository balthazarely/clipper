# Engineering Skills

This document defines core engineering skills and guidelines for writing consistent, maintainable, and scalable code in this repository.

---

## 1. Shared Utilities & Refactoring

When shared logic appears across multiple files, evaluate whether it should be extracted into a reusable utility.

### Guidelines

- Extract shared logic when it improves clarity, maintainability, or reduces duplication.
- Avoid premature abstraction—do not extract logic that is still evolving or only appears duplicated superficially.
- Utilities should be cohesive and purpose-driven, not part of a generic "utils" dumping ground.
- Prefer domain-specific modules over overly generic reusable functions when appropriate.
- Keep utilities small, focused, and easy to reason about.

### Rule of Thumb

Optimize for **clarity and cohesion**, not just deduplication.

---

## 2. Component Structure & Organization

Components must follow a consistent and scalable structure to ensure maintainability.

### Guidelines

- Reusable or stateful components must live in their own folder.
- Each component folder should co-locate related files:
  - `Component.tsx`
  - `Component.test.tsx`
  - Optional: `types.ts`, `styles.ts`, hooks, or helpers
- Use an `index.ts` file for clean exports when it improves import ergonomics.
- Keep all component-specific logic contained within the component folder.

### Exceptions

- Do NOT create full folders for:
  - Trivial components
  - One-off presentational UI elements used in a single place

### Rule of Thumb

Structure should scale with complexity, not be applied uniformly to everything.

---

## 3. Code Commenting Standards

Comments should provide meaningful context beyond what the code already expresses.

### Guidelines

- Focus on explaining **why**, not **what**.
- Use comments for:
  - Business rules and domain constraints
  - Non-obvious decisions or tradeoffs
  - Edge cases and external system constraints
  - Historical or contextual reasoning
- Avoid comments that restate obvious code behavior.
- Prefer refactoring over heavily commenting complex logic.
- Keep comments accurate and update them alongside code changes.

### Examples

- ❌ `// increment counter`
- ✅ `// offset by 1 because API uses -1 sentinel index`

### Rule of Thumb

Code should explain **what**; comments should explain **why**.

---
