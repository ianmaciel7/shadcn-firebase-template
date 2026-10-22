import type { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { HomePresentation } from "./home-presentation";
import { HomeSignOutButton } from "./home-sign-out-button";

type AuthenticatedHomeProps = ComponentProps<"div"> & {
  user: Pick<User, "displayName" | "email">;
};

function AuthenticatedHome({ user, ...props }: AuthenticatedHomeProps) {
  const t = useTranslations("Home");
  return (
    <HomePresentation
      {...props}
      title={t("welcome", { name: user.displayName?.trim() || t("friend") })}
      description={t("signedInDescription")}
      primaryHref="/profile"
      primaryLabel={t("manageAccount")}
      secondaryAction={<HomeSignOutButton />}
    />
  );
}

export { AuthenticatedHome };
