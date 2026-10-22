"use client";

import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { useHomeSignOutButton } from "../_hooks/use-home-sign-out-button";

type HomeSignOutButtonProps = ComponentProps<"div">;

function HomeSignOutButton(props: HomeSignOutButtonProps) {
  const { t, auth, isPending, isError, handleSignOut } = useHomeSignOutButton();

  return (
    <div {...props} className="flex w-full flex-col gap-2 sm:w-auto">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        aria-busy={isPending}
        className={buttonVariants({
          variant: "outline",
          className:
            "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
        })}
      >
        {isPending ? (
          <LoadingIndicator label={t("signingOut")} className="text-inherit" />
        ) : (
          auth("signOut")
        )}
      </button>
      {isError && (
        <p role="alert" className="max-w-xs text-sm text-destructive">
          {t("signOutError")}
        </p>
      )}
    </div>
  );
}

export { HomeSignOutButton };
