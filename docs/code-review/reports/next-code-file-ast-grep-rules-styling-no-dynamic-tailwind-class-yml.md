# Individual structural rule review — `next-code-file-ast-grep-rules-styling-no-dynamic-tailwind-class-yml`

## Identification

- **Reviewer identity:** `next-code-file-ast-grep-rules-styling-no-dynamic-tailwind-class-yml`
- **Primary file:** `.ast-grep/rules/styling/no-dynamic-tailwind-class.yml`
- **Item type:** CODE_FILE
- **Source revision:** `bb625db4a658b433aadb0eb7c82624d4da18bdf3`
- **Next.js baseline:** 16.4.2
- **Review status:** Completed following successful review CI run 40198684005.

## Source behavior and enforcement

The error-level rule detects template interpolation used to assemble Tailwind class fragments in JSX or common class utilities, where static class scanning cannot discover all combinations.

## Specific limitations

The syntax heuristic can miss classes assembled by other helpers; use complete, enumerable class strings for dynamic variations.

No independently verified additional source defect is claimed here. These rules are local project checks and are not all official Next.js or React requirements.

## Verification boundary

This report records the inspected rule's matching intent and coverage limits. Rule matching is tested by repository fixtures and static checks, but no new test execution is claimed until the branch review workflow passes. The related fixture files still have independent review identities.

## Disposition

The branch report checks passed in [run 40198684005](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198684005).
