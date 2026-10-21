"use client";

import { BookOpen, Code2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useHomeSession } from "../_hooks/use-home-session";
import { AuthenticatedHome } from "./authenticated-home";
import { GuestHome } from "./guest-home";

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
        {!ready ? (
          <p role="status" className="text-sm text-muted-foreground">
            {t("loading")}
          </p>
        ) : user ? (
          <AuthenticatedHome user={user} />
        ) : (
          <GuestHome />
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
