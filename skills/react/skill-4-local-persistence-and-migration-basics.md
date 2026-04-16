# Skill 4 - Local Persistence and Data Migration Basics

## Goal

Harden local data loading by introducing versioned storage migration for groups and folders.

## Relevant Files

- `src/lib/types.ts`
- `src/lib/utils.ts`
- `src/components/Shell/Shell.tsx`

## Tasks

1. Introduce a storage version field in persisted payload.
2. Write a migration function from version 1 to version 2.
3. Make loading path tolerant to malformed or partial data.
4. Add safe defaults for missing optional fields.

## Constraints

- Keep backward compatibility with current saved data.
- If migration fails, recover gracefully instead of crashing.
- Add short comments only where migration logic is non-obvious.

## Acceptance Checklist

- Existing users keep their data after update.
- Invalid local payload does not break app rendering.
- New saves write latest version format.

## Practice Focus

- Defensive coding
- Backward compatibility
- Runtime data validation mindset
