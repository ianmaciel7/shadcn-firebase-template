# Architectural review of `src/components/`

## Identification

- Full subagent name: `next-code-folder-src-components`
- Type: `CODE_FOLDER`
- Primary path: `src/components/`
- Associated documentation: `ARCHITECTURE.md`, `.agents/rules/components-contracts.md`, `.agents/rules/shadcn-ui-maintenance.md`, `docs/adr/0008-install-firebase-ui-registry.md`, Next.js 16.4.2 Server/Client Components reference
- Next.js version: `16.4.2`
- Status: completed

## Scope

- Responsibility: high-level organization and boundaries between the immediate component modules; the child directories and files have their own individual reports.
- Files consulted: listing of `src/components/`; `ARCHITECTURE.md`; `.agents/rules/components-contracts.md`; `.agents/rules/shadcn-ui-maintenance.md`; `docs/adr/0008-install-firebase-ui-registry.md`; `components.json`.
- Dependencies analyzed: `src/components/ui/`, `src/components/firebase/`, and `src/components/ai-elements/` as separate areas; each tree has its own review scope in the manifest.

## Architectural review

`src/components/` contains no direct files: the root separates the three main domains into `ui/`, `firebase/`, and `ai-elements/`. The colocation keeps shared components outside the routes, while `ARCHITECTURE.md` directs owned interface extensions to `ui/extensions/`. The distinction between the adaptable source of the Firebase integration and the UI components avoids mixing the authentication responsibility with the visual wrappers and primitives.

Observed structural inventory:

- `ai-elements/`: 51 files, no subdirectories.
- `firebase/`: 30 files, no subdirectories.
- `ui/`: 72 files and the `extensions/` subdirectory.
- The absence of files directly in `src/components/` keeps the division visible and does not create an extra barrel layer or shared logic at the root.

## Findings

### COMPONENTS-OWNERSHIP-001

- Identifier: `COMPONENTS-OWNERSHIP-001`
- Severity: Low
- Category: Architecture documentation / code ownership
- Path and line: `.agents/rules/components-contracts.md:14-18`; compare `docs/adr/0008-install-firebase-ui-registry.md:454-480` and `ARCHITECTURE.md:132-137`.
- Concrete evidence: the contracts rule classifies `ui/`, `firebase/`, and `ai-elements/` together as "vendor-owned" and excludes them from the application naming checks. The current amendment to ADR 0008, however, defines the copied Firebase components as project source that can be adapted; `ARCHITECTURE.md` also describes them as locally owned shadcn source. So the rule applies a broader classification to Firebase than the current decision.
- Documentation reference: ADR 0008, section "Amendment: Adoption of locally owned source model"; `ARCHITECTURE.md`, runtime/component boundaries section.
- Impact: maintainers may interpret the naming exception as code immutability, even though the current decision allows local changes, or incorrectly apply the generated-source policy to the other areas.
- Recommended fix: state in the rule that the treatment varies by tree: shadcn primitives, adaptable Firebase as project source, and AI Elements according to their own contract/documentation. Preserve the ADR's history and update only the current operational guidance.
- Suggested test: a documentation test or consistency review ensuring that the contracts rule, the architecture, and the current ADR describe the same ownership and the limits of the checks.

## Conclusion

- Classification: Partially compliant.
- Explanation: the folder's division into three areas and the absence of modules at the root are consistent with the architecture. There is a documentation contradiction about the ownership and treatment of the Firebase tree, which should be resolved in the operational guide. This review does not replace the reports for each subdirectory or file, nor does it establish that every individual component is correct.

## Post-checkpoint reconciliation

`COMPONENTS-OWNERSHIP-001` was remediated by aligning `.agents/rules/components-contracts.md` with `ARCHITECTURE.md` and ADR 0008's locally maintained registry source model while preserving naming exclusions. Per [ADR 0005](../../adr/0005-document-project-standards.md), `src/components/ui/extensions/` also hosts cross-route application extensions (`auth-provider-client.tsx`, `firebase-auth-session-bridge-client.tsx`, and `route-loading.tsx`). See [remediation status](../resolutions.md).
