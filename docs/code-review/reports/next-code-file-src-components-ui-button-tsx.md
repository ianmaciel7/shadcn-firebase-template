# Code review: `src/components/ui/button.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ui-button-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ui/button.tsx`
- Associated documentation: `.agents/rules/shadcn-ui-maintenance.md`; `.agents/rules/components-composition.md`; `.agents/rules/components-contracts.md`; `CODING_STANDARDS.md`; `docs/agents/shadcn.md`; installed Base UI button types at `node_modules/@base-ui/react/button/Button.d.ts` and `node_modules/@base-ui/react/internals/types.d.ts`.
- Next.js version: `16.4.2`
- Status: completed

## Scope

- Responsibility: individual review of the shared `Button` wrapper, its variants, and the props contract forwarded to the Base UI primitive.
- Files consulted: `src/components/ui/button.tsx`, `src/components/ui/button.browser.test.tsx`, `components.json`, `package.json`, the guides/rules listed above, and the installed declarations of `@base-ui/react/button`.
- Dependencies analyzed: `@base-ui/react` (`^1.9.0`), `class-variance-authority`, `cn`, and the Tailwind v4 classes defined by the project.

## Code Review

Correct implementations:

- `Button` is a named function followed by a named export, and the simple file exports only the root component and its variants helper, in compliance with the local convention for a simple primitive.
- The wrapper inherits `ButtonPrimitive.Props` and `VariantProps`, forwards the remaining props, and merges `className` with `cn` (lines 42–53). This preserves the Base UI contract instead of creating a parallel set of attributes.
- The installed primitive and typings support `render` for Base UI composition; the wrapper forwards that prop without assuming Radix's `asChild` API. The base type derives from `ComponentPropsWithRef`, keeping the `ref` contract in the installed React.
- Variants and sizes are declared through `cva`, including semantic variants, invalid/expanded states, and icon sizes. The classes use the tokens and states documented by the project; the icon selector preserves default sizing without preventing explicit dimensions through `size-*`.
- Accessibility is compatible with the primitive's native role, visible focus, disabled state, and the use of `aria-label` for an icon button. The `buttonVariants` helper also lets true navigation keep an `<a>`/`Link`, per the local guidance in `docs/agents/shadcn.md`.
- The colocated browser test covers click and keyboard focus, disabled without firing the event, responsive reflow, and a 24×24 px minimum touch target (`button.browser.test.tsx:7-111`). The icon test provides an accessible name via `aria-label`.

Issues found:

- No proven issue in this file.

Risks and verification limits:

- The icon primitive cannot statically require an accessible name, since its content can come from SVG, text, or composition; callers must provide an accessible name when the button has no visible text. The current test exemplifies this contract with `aria-label`.
- The wrapper does not set `type="button"`; therefore it preserves native HTML behavior (`submit` inside a form). This is a common API decision for button wrappers and was not treated as a defect without evidence of incompatibility with existing use.
- I did not run tests or a build in this task. The analysis was static, reading the existing test and the installed types.

## Findings

No findings.

## Conclusion

- Classification: **Compliant**.
- Explanation: the wrapper keeps the installed Base UI contract, forwards props and `className`, offers variants consistent with the design system, and has browser coverage for interaction, focus, disabled, layout, and minimum size. No proven divergence was found within the scope of this file.
