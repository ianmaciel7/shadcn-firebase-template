"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LoadingIndicator } from "@/components/loading/loading-indicator";
import { useHomeSession } from "../_hooks/use-home-session";
import { AuthenticatedHome } from "./authenticated-home";
import { GuestHome } from "./guest-home";

function HomeContent() {
  const t = useTranslations("Home");
  const { ready, user } = useHomeSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        {!ready ? (
          <LoadingIndicator label={t("loading")} />
        ) : user ? (
          <AuthenticatedHome user={user} />
        ) : (
          <GuestHome />
        )}
      </main>
    </div>
  );
}

export { HomeContent };
