import { useTranslations } from "next-intl";
import type { useProfileSession } from "./use-profile-session";

export function useProfileStatus(
  session: ReturnType<typeof useProfileSession>,
) {
  const t = useTranslations("Auth");
  const { user, error, defaultValues, authReady, preferencesReady } = session;
  if (!authReady || (user && !preferencesReady))
    return {
      isError: false as const,
      isLoading: true as const,
      isHidden: false as const,
      status: "loading" as const,
    };
  if (!user && !error)
    return {
      isError: false as const,
      isLoading: false as const,
      isHidden: true as const,
      status: "hidden" as const,
    };
  if (!user || !defaultValues)
    return {
      isError: true as const,
      isLoading: false as const,
      isHidden: false as const,
      status: "error" as const,
      message: error ?? t("profileLoadError"),
    };
  return {
    isError: false as const,
    isLoading: false as const,
    isHidden: false as const,
    status: "ready" as const,
    userId: user.uid,
  };
}
