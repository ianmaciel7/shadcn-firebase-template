import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inspectRouteSource, isRouteEntrypoint } from "./check-route-files.mjs";

const check = (source, path = "src/app/(group)/page.tsx") =>
  inspectRouteSource(source, path).map((violation) => violation.message);

describe("route entrypoint guard", () => {
  it("scans nested pages, layouts, and templates, but not private components", () => {
    assert.equal(isRouteEntrypoint("src/app/page.tsx"), true);
    assert.equal(isRouteEntrypoint("src/app/(group)/layout.tsx"), true);
    assert.equal(isRouteEntrypoint("src/app/[slug]/template.tsx"), true);
    assert.equal(isRouteEntrypoint("src/app/(group)/_components/card.tsx"), false);
    assert.equal(isRouteEntrypoint("src/pages/page.tsx"), false);
    assert.equal(isRouteEntrypoint("src/app/page.test.tsx"), false);
  });

  it("allows a thin component with an async server data read", () => {
    assert.deepEqual(
      check('import { getUser } from "@/lib/users"; export default async function Page() { const user = await getUser(); return <Profile user={user} />; }'),
      [],
    );
  });

  it("allows metadata generators and font declarations in the root layout", () => {
    assert.deepEqual(
      check('const font = Geist({ subsets: ["latin"] }); export async function generateMetadata() { const t = await getTranslations("Metadata"); return { title: t("title") }; } export default function Layout({ children }) { return <html className={font.variable}><body>{children}</body></html>; }', "src/app/layout.tsx"),
      [],
    );
  });

  it("allows a simple template wrapper", () => {
    assert.deepEqual(
      check("export default function Template({ children }) { return <section>{children}</section>; }", "src/app/template.tsx"),
      [],
    );
  });

  it("rejects client directives in every entrypoint kind", () => {
    for (const kind of ["page", "layout", "template"]) {
      assert.match(
        check('"use client"; export default function Entry() { return <div />; }', "src/app/" + kind + ".tsx").join(" "),
        /Server Components/,
      );
    }
  });

  it("rejects hooks including Next.js and i18n hooks", () => {
    for (const hook of ["useState", "useEffect", "useTranslations", "useRouter"]) {
      assert.match(
        check("export default function Page() { const result = " + hook + "(); return <div />; }").join(" "),
        /hooks belong/,
      );
    }
  });

  it("rejects control flow and inline callbacks", () => {
    assert.match(
      check("export default function Page() { if (ok) return <A />; return <B />; }").join(" "),
      /conditional/,
    );
    assert.match(
      check("export default function Page() { return ok ? <A /> : <B />; }").join(" "),
      /conditional/,
    );
    assert.match(
      check("export default function Page() { return <List onClick={() => save()} />; }").join(" "),
      /Event handlers/,
    );
  });

  it("rejects direct Firebase SDK imports but permits a data-layer read", () => {
    assert.match(
      check('import { getDoc } from "firebase/firestore"; export default function Page() { return <div />; }').join(" "),
      /Firebase/,
    );
    assert.deepEqual(
      check('import { readProfile } from "@/lib/firebase/firestore/user-preferences"; export default async function Page() { const value = await readProfile(); return <Card value={value} />; }'),
      [],
    );
  });

  it("rejects browser APIs, mutable state, and helper declarations", () => {
    assert.match(
      check("export default function Page() { let count = 0; return <div />; }").join(" "),
      /Mutable/,
    );
    assert.match(
      check("export default function Page() { const path = window.location.pathname; return <div />; }").join(" "),
      /Browser APIs/,
    );
    assert.match(
      check("function calculate() { return 2; } export default function Page() { return <div />; }").join(" "),
      /Extract helper/,
    );
  });
});
