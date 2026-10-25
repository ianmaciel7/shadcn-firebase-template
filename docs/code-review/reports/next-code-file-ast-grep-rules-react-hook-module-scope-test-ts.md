# Individual structural rule review — `next-code-file-ast-grep-rules-react-hook-module-scope-test-ts`

## Identification

- **Reviewer identity:** `next-code-file-ast-grep-rules-react-hook-module-scope-test-ts`
- **Primary file:** `.ast-grep/rules/react/hook-module-scope.test.ts`
- **Item type:** CODE_FILE
- **Source revision:** `bb625db4a658b433aadb0eb7c82624d4da18bdf3`
- **Next.js baseline:** 16.4.2
- **Review status:** Source reviewed; CI pending.

## Source behavior and enforcement

The fixture test launches the actual scanning binary against generated TypeScript and TSX files, verifies invalid private hook modules are detected and excluded files remain clean.

## Specific limitations

The test is scoped to the tested rule paths and only proves matching patterns, not full React hook correctness.

No independently verified additional source defect is claimed here. These rules are local project checks and are not all official Next.js or React requirements.

## Verification boundary

This report records the inspected rule's matching intent and coverage limits. Rule matching is tested by repository fixtures and static checks, but no new test execution is claimed until the branch review workflow passes. The related fixture files still have independent review identities.

## Disposition

Complete this individual rule review only after the branch report checks pass.
