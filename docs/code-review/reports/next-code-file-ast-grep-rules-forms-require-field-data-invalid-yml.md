# Individual structural rule review — `next-code-file-ast-grep-rules-forms-require-field-data-invalid-yml`

## Identification

- **Reviewer identity:** `next-code-file-ast-grep-rules-forms-require-field-data-invalid-yml`
- **Primary file:** `.ast-grep/rules/forms/require-field-data-invalid.yml`
- **Item type:** CODE_FILE
- **Source revision:** `bb625db4a658b433aadb0eb7c82624d4da18bdf3`
- **Next.js baseline:** 16.4.2
- **Review status:** Completed following successful review CI run 40198684005.

## Source behavior and enforcement

The rule requires data-invalid on a Field wrapper when a Controller rendering callback consumes fieldState, preserving form error styling.

## Specific limitations

The warning context is limited to the matched callback shape and does not establish complete ARIA error association.

No independently verified additional source defect is claimed here. These rules are local project checks and are not all official Next.js or React requirements.

## Verification boundary

This report records the inspected rule's matching intent and coverage limits. Rule matching is tested by repository fixtures and static checks, but no new test execution is claimed until the branch review workflow passes. The related fixture files still have independent review identities.

## Disposition

The branch report checks passed in [run 40198684005](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198684005).
