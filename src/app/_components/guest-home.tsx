import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";

function GuestHome() {
  const t = useTranslations("Home");
  return (
    <>
      <div className="space-y-3">
        <p className="font-mono text-xs text-muted-foreground">{t("stack")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>
      </div>
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
    </>
  );
}

export { GuestHome };
