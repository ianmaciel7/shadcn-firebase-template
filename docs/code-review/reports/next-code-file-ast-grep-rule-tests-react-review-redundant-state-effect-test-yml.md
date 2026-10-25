# Individual fixture review — `next-code-file-ast-grep-rule-tests-react-review-redundant-state-effect-test-yml`

## Identification

- **Agent:** `next-code-file-ast-grep-rule-tests-react-review-redundant-state-effect-test-yml`
- **Primary item:** `.ast-grep/rule-tests/react/review-redundant-state-effect-test.yml`
- **Inventory type:** CODE_FILE
- **Baseline:** Next.js 16.4.2
- **Reviewed source revision:** `3f153caa103076b086888a3106a7de9bf8ab9d63`
- **Status:** Completed following successful review checks.

## Source-specific evidence

External listener setup and derived render values pass; an effect that sets preview state triggers review.

## Coverage and limits

This source fixture defines accepted and rejected cases for one scanner rule. The fixture documents the rule's tested syntax boundary, not all possible equivalent TypeScript or JSX forms.

## Verification

[Review CI run 40209883877](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40209883877) passed the structural rule fixtures and source scan, hook module scope tests, Biome, TypeScript, focused regressions, English, spelling, Markdown and review inventory consistency.

## Conclusion

This individual inventory item is reviewed. It does not certify the full application, live Firebase services or every official Next.js document.
