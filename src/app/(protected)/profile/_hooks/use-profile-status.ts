import { useTranslations } from "next-intl";
import type { useProfileSession } from "./use-profile-session";

export type ProfileStatus =
  | {
      status: "loading";
    }
  | {
      status: "hidden";
    }
  | {
      status: "error";
      errorMessage: string;
    }
  | {
      status: "ready";
      userId: string;
    };

export function useProfileStatus(
  session: ReturnType<typeof useProfileSession>,
): ProfileStatus {
  const t = useTranslations("Auth");
  const { user, error, defaultValues, authReady, preferencesReady } = session;
  if (!authReady || (user && !preferencesReady))
    return {
      status: "loading",
    };
  if (!user && !error)
    return {
      status: "hidden",
    };
  if (!user || !defaultValues)
    return {
      status: "error",
      errorMessage: error ?? t("profileLoadError"),
    };
  return {
    status: "ready",
    userId: user.uid,
  };
}
