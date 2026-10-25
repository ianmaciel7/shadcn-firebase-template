# Individual structural rule review — `next-code-file-ast-grep-rules-react-review-redundant-state-effect-yml`

## Identification

- **Reviewer identity:** `next-code-file-ast-grep-rules-react-review-redundant-state-effect-yml`
- **Primary file:** `.ast-grep/rules/react/review-redundant-state-effect.yml`
- **Item type:** CODE_FILE
- **Source revision:** `bb625db4a658b433aadb0eb7c82624d4da18bdf3`
- **Next.js baseline:** 16.4.2
- **Review status:** Completed following successful review CI run 40198684005.

## Source behavior and enforcement

The warning looks for effect callbacks that call state setters and invites inspection for values that could be derived during rendering instead.

## Specific limitations

Effects that synchronize an external system can legitimately update state; the source match does not establish redundancy.

No independently verified additional source defect is claimed here. These rules are local project checks and are not all official Next.js or React requirements.

## Verification boundary

This report records the inspected rule's matching intent and coverage limits. Rule matching is tested by repository fixtures and static checks, but no new test execution is claimed until the branch review workflow passes. The related fixture files still have independent review identities.

## Disposition

The branch report checks passed in [run 40198684005](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40198684005).
