"use client";

import { ArrowRight, BookOpen, Code2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { useHomeSession } from "../_hooks/use-home-session";

function HomeContent() {
  const t = useTranslations("Home");
  const { ready, user } = useHomeSession();

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-8 px-6 py-20">
        <Image
          src="/next.svg"
          alt="Next.js"
          width={120}
          height={25}
          priority
          className="h-auto dark:invert"
        />
        <div className="space-y-3">
          <p className="font-mono text-xs text-muted-foreground">
            {t("stack")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {user
              ? t("welcome", { name: user.displayName || t("friend") })
              : t("title")}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {user ? t("signedInDescription") : t("description")}
          </p>
        </div>
        {!ready ? (
          <p role="status" className="text-sm text-muted-foreground">
            {t("loading")}
          </p>
        ) : user ? (
          <div className="rounded-xl border p-5">
            <div className="mb-5 space-y-1">
              <p className="text-sm font-medium">{t("sessionActive")}</p>
              <p className="break-all text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
            <Link
              href="/profile"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("manageAccount")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Link href="/sign-in" className={buttonVariants()}>
              {t("signIn")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("getStarted")}
            </Link>
          </div>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-3 border-t pt-6 text-xs text-muted-foreground">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <BookOpen className="size-3.5" />
            {t("nextDocs")}
          </a>
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            {t("shadcnDocs")}
          </a>
          <a
            href="https://firebase.google.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            {t("firebaseDocs")}
          </a>
          <a
            href="https://github.com/ianmaciel7/shadcn-firebase-template"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Code2 className="size-3.5" />
            {t("source")}
          </a>
        </div>
      </main>
    </div>
  );
}

export { HomeContent };
