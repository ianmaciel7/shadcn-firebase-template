# Individual file review — `next-code-file-semgrep-rules-yml`

## Identification

- **Agent identity:** `next-code-file-semgrep-rules-yml`
- **Primary item:** `.semgrep/rules.yml`
- **Type:** CODE_FILE
- **Source revision:** `0be7ee0f4c06a32bae63de7c4d0b8562b9350fb2`
- **Next.js baseline:** 16.4.2
- **Review state:** Source inspected; quality checks pending.

## Evidence

Contains security checks for client/server separation, dynamic evaluation, HTML sinks, cookie options, exposed secrets and suppressed type errors.

## Verification boundaries

The file was inspected directly, but a static source review alone does not prove live security or tooling behavior. The branch review workflow provides TypeScript, native Biome and structural rule test evidence, plus spelling and Markdown verification. Production security checks and live Serena tooling remain separate responsibilities.

## Conclusion

This source item has an individual file or folder review and awaits successful branch quality validation.
