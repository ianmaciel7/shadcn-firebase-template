# Individual Next.js source review — `01-app/02-guides/open-telemetry.md`

## Identification

- Assigned identity: `next-doc-file-01-app-02-guides-open-telemetry-md`
- Installed primary path: `node_modules/next/dist/docs/01-app/02-guides/open-telemetry.md`
- Upstream version: Next.js 16.4.2 (`2864b1772c37242a9b40ab4d366eb7d368c2a070`)
- Source: [immutable official MDX](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/open-telemetry.mdx)
- GitHub source checkpoint: `fdf106572ae5de790e1a7aac80c15301ebf90c1e`
- State: Completed content inspection; runtime verification separate

## Scope and source evidence

The official page is titled **How to set up instrumentation with OpenTelemetry**.
Its frontmatter describes: Learn how to instrument your Next.js app with OpenTelemetry..
The source contains 15,161 characters and 19 fenced-code pairs.

Source section headings (up to twelve):

<!-- cspell:disable -->
- Getting Started
- Using `@vercel/otel`
- Manual OpenTelemetry configuration
- Testing your instrumentation
- Deployment
- Using OpenTelemetry Collector
- Custom Exporters
- Custom Spans
- Default Spans in Next.js
- `[http.method] [next.route]`
- `render route (app) [next.route]`
- `fetch [http.method] [http.url]`
<!-- cspell:enable -->

## Applicability and independent judgment

- Focus: OpenTelemetry tracing instrumentation.
- Project check: The app has a native server onRequestError hook, but an OpenTelemetry exporter or trace backend is not established by that hook.
- Version-matched terms present in the body: `OpenTelemetry`, `deployment`.
- No framework example was treated as an application requirement solely because it appears in the versioned documentation.

## Cautions and verification boundary

The guide includes these quoted advisory excerpts (truncated to identify their location):

<!-- cspell:disable -->
- > **Good to know**:
- > **Good to know**:
<!-- cspell:enable -->

This is a direct, per-file documentation/source inspection, not a
separately launched subagent. Build, browser, authorization, caching
and deployment behavior were not executed for this source item.
The report does not substitute for review of other inventory files.

## Disposition

Individual installed-version source reviewed with its section
structure, feature references, and application-specific scope recorded.
