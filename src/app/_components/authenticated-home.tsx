import type { User } from "firebase/auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";

function AuthenticatedHome({
  user,
}: {
  user: Pick<User, "displayName" | "email">;
}) {
  const t = useTranslations("Home");
  return (
    <>
      <div className="space-y-3">
        <p className="font-mono text-xs text-muted-foreground">{t("stack")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("welcome", { name: user.displayName?.trim() || t("friend") })}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("signedInDescription")}
        </p>
      </div>
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
    </>
  );
}

export { AuthenticatedHome };
