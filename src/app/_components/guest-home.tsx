import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { HomePresentation } from "./home-presentation";

type GuestHomeProps = ComponentProps<"div">;

function GuestHome(props: GuestHomeProps) {
  const t = useTranslations("Home");
  return (
    <HomePresentation
      {...props}
      title={t("title")}
      description={t("description")}
      primaryHref="/sign-in"
      primaryLabel={t("signIn")}
      secondaryAction={
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
      }
    />
  );
}

export { GuestHome };
