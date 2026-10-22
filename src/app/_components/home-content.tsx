"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import { LoadingIndicator } from "@/components/loading/loading-indicator";
import { useHomeContent } from "../_hooks/use-home-content";
import { AuthenticatedHome } from "./authenticated-home";
import { GuestHome } from "./guest-home";

type HomeContentProps = ComponentProps<"div">;

function HomeContent(props: HomeContentProps) {
  const { t, ready, user } = useHomeContent();

  if (!ready) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center bg-background p-6 text-foreground">
        <LoadingIndicator label={t("loading")} />
      </main>
    );
  }

  return (
    <div
      {...props}
      className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground font-sans"
    >
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        {user ? <AuthenticatedHome user={user} /> : <GuestHome />}
      </main>
    </div>
  );
}

export { HomeContent };
