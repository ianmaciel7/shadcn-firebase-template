"use client";

import { ArrowDown, ArrowRight, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { useHomeSession } from "../_hooks/use-home-session";
import { HomeAccountPreview } from "./home-account-preview";
import { HomeFeatures } from "./home-features";

function getFirstName(
  displayName: string | null | undefined,
  fallback: string,
) {
  return displayName?.trim().split(/\s+/)[0] || fallback;
}

function HomeContent() {
  const t = useTranslations("Home");
  const { ready, user } = useHomeSession();
  const name = getFirstName(user?.displayName, t("friend"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-b px-6 py-6 lg:px-10">
        <Link
          href="/"
          aria-label={t("home")}
          className="flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Layers className="size-5" />
          </span>
          {t("brand")}
        </Link>
        <nav
          aria-label={t("navigation")}
          className="flex items-center gap-5 text-sm"
        >
          <a
            href="#explore"
            className="hidden text-muted-foreground hover:text-foreground sm:block"
          >
            {t("explore")}
          </a>
          {ready ? (
            <Link
              href={user ? "/profile" : "/sign-in"}
              className={buttonVariants({ variant: "outline" })}
            >
              {user ? t("myAccount") : t("signIn")}
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <span role="status" className="text-muted-foreground">
              {t("loading")}
            </span>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 lg:px-10">
        <section className="grid items-center gap-14 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-foreground" />
              {user ? t("welcomeLabel") : t("eyebrow")}
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {user ? t("welcome", { name }) : t("title")}
              <span className="block text-muted-foreground">
                {user ? t("welcomeEnd") : t("titleEnd")}
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              {user ? t("signedInDescription") : t("description")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {ready ? (
                <Link
                  href={user ? "/profile" : "/register"}
                  className={buttonVariants({
                    className: "h-12 rounded-xl px-6",
                  })}
                >
                  {user ? t("manageAccount") : t("getStarted")}
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <p role="status" className="text-sm text-muted-foreground">
                  {t("loading")}
                </p>
              )}
              <a
                href="#explore"
                className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-muted"
              >
                {t("discover")}
                <ArrowDown className="size-4" />
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" />
              {user ? t("sessionActive") : t("reassurance")}
            </p>
          </div>

          <HomeAccountPreview user={user} name={name} />
        </section>

        <HomeFeatures signedIn={!!user} />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t px-6 py-6 text-xs text-muted-foreground lg:px-10">
        <span>{`${t("brand")} / ${t("footer")}`}</span>
        <span>{t("footerNote")}</span>
      </footer>
    </div>
  );
}

export { HomeContent };
