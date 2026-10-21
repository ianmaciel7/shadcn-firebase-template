import {
  ArrowRight,
  CircleUserRound,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

function HomeFeatures({ signedIn }: { signedIn: boolean }) {
  const t = useTranslations("Home");
  const features = [
    { icon: CircleUserRound, title: t("profileTitle"), text: t("profileText") },
    {
      icon: Settings2,
      title: t("preferencesTitle"),
      text: t("preferencesText"),
    },
    { icon: ShieldCheck, title: t("securityTitle"), text: t("securityText") },
  ];
  return (
    <section id="explore" className="scroll-mt-8 border-t py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t("sectionLabel")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            {signedIn ? t("shortcuts") : t("featuresTitle")}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">{t("featuresSubtitle")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }, index) => (
          <article key={title} className="rounded-2xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <Icon className="size-5" />
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {text}
            </p>
            {signedIn && (
              <Link
                href="/profile"
                className="mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-medium hover:underline"
              >
                {t("manage")}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export { HomeFeatures };
