import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HomeScreen } from "./home-screen";

function GuestHome() {
  const t = useTranslations("Home");
  return (
    <HomeScreen
      title={t("title")}
      description={t("description")}
      primaryHref="/sign-in"
      primaryLabel={t("signIn")}
      secondaryAction={
        <Link
          href="/register"
          className={cn(
            buttonVariants({
              variant: "outline",
              className:
                "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
            }),
          )}
        >
          {t("getStarted")}
        </Link>
      }
    />
  );
}

export { GuestHome };
