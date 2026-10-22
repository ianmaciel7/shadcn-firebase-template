"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { useHomeSection } from "../_hooks/use-home-section";
import {
  HomeHero,
  HomeHeroActions,
  HomeHeroDescription,
  HomeHeroHeader,
  HomeHeroTitle,
} from "./home-hero";
import { HomeSignOutButton } from "./home-sign-out-button-client";

type HomeSectionProps = ComponentProps<"div">;

function HomeSection(props: HomeSectionProps) {
  const { t, ready, user } = useHomeSection();

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
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-12 p-6 sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <HomeHero>
          <HomeHeroHeader>
            <HomeHeroTitle>
              {user
                ? t("welcome", {
                    name: user.displayName?.trim() || t("friend"),
                  })
                : t("title")}
            </HomeHeroTitle>
            <HomeHeroDescription>
              {user ? t("signedInDescription") : t("description")}
            </HomeHeroDescription>
          </HomeHeroHeader>
          <HomeHeroActions>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={buttonVariants({
                    className:
                      "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
                  })}
                >
                  {t("manageAccount")}
                </Link>
                <HomeSignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    className:
                      "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
                  })}
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
                  })}
                >
                  {t("getStarted")}
                </Link>
              </>
            )}
          </HomeHeroActions>
        </HomeHero>
      </main>
    </div>
  );
}

export type { HomeSectionProps };
export { HomeSection };
