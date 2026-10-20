# Component Naming Conventions

This rule establishes official, canonical component and file naming standards for UI and feature components throughout the repository, adhering to shadcn/ui architectural conventions.

## General File & Component Mapping

- **File naming**: Use `kebab-case.tsx` (e.g., `profile-avatar-field.tsx`, `account-danger-card.tsx`).
- **Export & Component naming**: Use `PascalCase` matching the file name (e.g., `ProfileAvatarField`, `AccountDangerCard`).
- **Component Props**: Name props as `<ComponentName>Props` extending standard element or base component props.
- **Export style**: Declare components using `function ComponentName(...) { ... }` and export explicitly with named export `export { ComponentName }`. Do not use inline `export function` or `export default function` in `_components/` or `src/components/`. Next.js route entry points (`page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`) remain the only files using `export default function`.
- **Route Client Seams**: Never create pseudo-pages like `*-page-client.tsx` at the route root. Extract interactive client logic into semantic UI components in `_components/` following shadcn and feature-driven conventions (e.g., `register-form.tsx`, `forgot-password-form.tsx`, `sign-in-form.tsx`).

## Suffix Taxonomy & Semantic Roles

Components must be categorized and suffixed according to their structural role in the user interface:

| Suffix / Pattern | Purpose & Semantic Role | Examples | Typical Underlying Primitives |
| :--- | :--- | :--- | :--- |
| `*-field.tsx` | Individual form field or input group (input/control + label + description/actions) | `profile-avatar-field.tsx`, `user-email-field.tsx` | `<Field>`, `<Input>`, `<Avatar>`, `<Label>` |
| `*-fields.tsx` | Grouped composite section of form inputs | `profile-text-fields.tsx`, `profile-preference-fields.tsx` | `<FieldGroup>`, multiple `*-field` components |
| `*-form.tsx` | Interactive `<form>` orchestrator handling submission, validation, and field groups | `profile-form.tsx`, `login-form.tsx` | `<form>`, `<Button type="submit">` |
| `*-card.tsx` | Self-contained visual card surface grouping related content or actions | `account-danger-card.tsx`, `billing-summary-card.tsx` | `<Card>`, `<CardHeader>`, `<CardContent>` |
| `*-dialog.tsx` | Modal overlay / alert dialog triggering confirmation or focused sub-flows | `delete-account-dialog.tsx`, `crop-avatar-dialog.tsx` | `<Dialog>`, `<AlertDialog>` |
| `*-header.tsx` | Top-level section or page banner/header displaying titles, status, or breadcrumbs | `profile-header.tsx`, `dashboard-header.tsx` | `<header>`, typography, breadcrumb primitives |
| `*-button.tsx` | Specialized, reusable actionable button with localized state/behavior | `sign-out-button.tsx`, `delete-account-button.tsx` | `<Button>` |
| `*-table.tsx` / `*-list.tsx` | Data display collections, grids, and item lists | `sessions-table.tsx`, `activity-list.tsx` | `<Table>`, `<Item>`, `<ItemGroup>` |

## Placement Conventions

- **Shared UI primitives**: Place in `src/components/ui/` (e.g., `button.tsx`, `field.tsx`, `item.tsx`).
- **Feature/Route-specific components**: Place in private `_components/` folders colocated with their route (e.g., `src/app/(protected)/profile/_components/`).
- **Shared feature components**: Place in `src/components/<feature>/` when genuinely shared across multiple routes.
