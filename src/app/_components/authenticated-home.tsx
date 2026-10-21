import type { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { HomeScreen } from "./home-screen";
import { HomeSignOutButton } from "./home-sign-out-button";

function AuthenticatedHome({
  user,
}: {
  user: Pick<User, "displayName" | "email">;
}) {
  const t = useTranslations("Home");
  return (
    <HomeScreen
      title={t("welcome", { name: user.displayName?.trim() || t("friend") })}
      description={t("signedInDescription")}
      primaryHref="/profile"
      primaryLabel={t("manageAccount")}
      secondaryAction={<HomeSignOutButton />}
    />
  );
}

export { AuthenticatedHome };
