# Individual structural rule review — `next-code-file-ast-grep-rules-components-require-button-props-yml`

## Identification

- **Reviewer identity:** `next-code-file-ast-grep-rules-components-require-button-props-yml`
- **Primary file:** `.ast-grep/rules/components/require-button-props.yml`
- **Item type:** CODE_FILE
- **Source revision:** `bb625db4a658b433aadb0eb7c82624d4da18bdf3`
- **Next.js baseline:** 16.4.2
- **Review status:** Source reviewed; CI pending.

## Source behavior and enforcement

The error-level rule finds owned button prop aliases or interfaces ending with ButtonProps that do not inherit React or native button component properties.

## Specific limitations

The suffix is a naming convention; wrapper aliases and indirect type inheritance can require extra judgment.

No independently verified additional source defect is claimed here. These rules are local project checks and are not all official Next.js or React requirements.

## Verification boundary

This report records the inspected rule's matching intent and coverage limits. Rule matching is tested by repository fixtures and static checks, but no new test execution is claimed until the branch review workflow passes. The related fixture files still have independent review identities.

## Disposition

Complete this individual rule review only after the branch report checks pass.
