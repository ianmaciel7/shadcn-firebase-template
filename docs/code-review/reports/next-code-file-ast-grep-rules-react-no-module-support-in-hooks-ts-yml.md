# Individual structural rule review — `next-code-file-ast-grep-rules-react-no-module-support-in-hooks-ts-yml`

## Identification

- **Reviewer identity:** `next-code-file-ast-grep-rules-react-no-module-support-in-hooks-ts-yml`
- **Primary file:** `.ast-grep/rules/react/no-module-support-in-hooks-ts.yml`
- **Item type:** CODE_FILE
- **Source revision:** `bb625db4a658b433aadb0eb7c82624d4da18bdf3`
- **Next.js baseline:** 16.4.2
- **Review status:** Source reviewed; CI pending.

## Source behavior and enforcement

The error-level rule requires module-level helper functions and values in private TypeScript hooks to live in supporting library modules; hook declarations and hook-local logic remain allowed.

## Specific limitations

The rule does not prove that a function named with a use prefix actually follows the Rules of React.

No independently verified additional source defect is claimed here. These rules are local project checks and are not all official Next.js or React requirements.

## Verification boundary

This report records the inspected rule's matching intent and coverage limits. Rule matching is tested by repository fixtures and static checks, but no new test execution is claimed until the branch review workflow passes. The related fixture files still have independent review identities.

## Disposition

Complete this individual rule review only after the branch report checks pass.
