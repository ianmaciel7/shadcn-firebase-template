# Individual architecture decision review — `next-code-file-docs-adr-0004-configure-internationalization-md`

## Identification

- **Agent:** `next-code-file-docs-adr-0004-configure-internationalization-md`
- **Primary source:** `docs/adr/0004-configure-internationalization.md`
- **Type:** CODE_FILE
- **Source checkpoint:** `65372ec436b27a8c409c79339b3a180746347791`
- **Framework reference:** Next.js 16.4.2
- **Review status:** Historical document inspected; quality checks pending.

## Historical design evidence

The decision deliberately resolves English, Brazilian Portuguese and Spanish through a locale cookie with no locale route segments or rewriting proxy.

## Reconciliation and limitations

It explicitly documents a static root html lang attribute despite dynamic translated content; this remains an accessibility limitation to resolve without silently violating the chosen routing architecture.

This accepted decision or its index remains unchanged. Current implementation details should be taken from version-matched source and active documentation, not inferred from earlier decision text.

## Verification

The document's scope, status, design choices and cross-references were reviewed. The branch audit workflow must pass spelling, Markdown and manifest integrity before this item can be marked Completed.

## Conclusion

The record has a distinct historical design review. No unverified framework or deployment claim was added.
