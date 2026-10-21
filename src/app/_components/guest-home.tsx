import { useTranslations } from "next-intl";
import { HomeScreen } from "./home-screen";

function GuestHome() {
  const t = useTranslations("Home");
  return (
    <HomeScreen
      title={t("title")}
      description={t("description")}
      primaryHref="/sign-in"
      primaryLabel={t("signIn")}
      secondaryHref="/register"
      secondaryLabel={t("getStarted")}
    />
  );
}

export { GuestHome };
