import { useTranslations } from "next-intl";
import { LoadingIndicator } from "@/components/loading/loading-indicator";

function RouteLoading() {
  const t = useTranslations("Home");
  return <LoadingIndicator label={t("loading")} className="flex w-full p-6" />;
}

export { RouteLoading };
