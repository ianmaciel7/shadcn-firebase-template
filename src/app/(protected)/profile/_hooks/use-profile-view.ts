import { useTranslations } from "next-intl";
import type { useProfileSession } from "./use-profile-session";

export function useProfileView(session: ReturnType<typeof useProfileSession>) {
  const t = useTranslations("Auth");
  const { user, error, defaultValues, authReady, preferencesReady } = session;
  if (!authReady || (user && !preferencesReady))
    return { status: "loading" as const };
  if (!user && !error) return { status: "hidden" as const };
  if (!user || !defaultValues)
    return {
      status: "error" as const,
      message: error ?? t("profileSaveError"),
    };
  return { status: "ready" as const, userId: user.uid };
}
