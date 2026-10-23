import { useTranslations } from "next-intl";
import type { useProfileSession } from "./use-profile-session";

export type ProfileStatus =
  | {
      errorMessage: null;
      isError: false;
      isHidden: false;
      isLoading: true;
      userId: null;
    }
  | {
      errorMessage: null;
      isError: false;
      isHidden: true;
      isLoading: false;
      userId: null;
    }
  | {
      errorMessage: string;
      isError: true;
      isHidden: false;
      isLoading: false;
      userId: null;
    }
  | {
      errorMessage: null;
      isError: false;
      isHidden: false;
      isLoading: false;
      userId: string;
    };

export function useProfileStatus(
  session: ReturnType<typeof useProfileSession>,
): ProfileStatus {
  const t = useTranslations("Auth");
  const { user, error, defaultValues, authReady, preferencesReady } = session;
  if (!authReady || (user && !preferencesReady))
    return {
      isError: false,
      isHidden: false,
      isLoading: true,
      errorMessage: null,
      userId: null,
    };
  if (!user && !error)
    return {
      isError: false,
      isHidden: true,
      isLoading: false,
      errorMessage: null,
      userId: null,
    };
  if (!user || !defaultValues)
    return {
      isError: true,
      isHidden: false,
      isLoading: false,
      errorMessage: error ?? t("profileLoadError"),
      userId: null,
    };
  return {
    isError: false,
    isHidden: false,
    isLoading: false,
    errorMessage: null,
    userId: user.uid,
  };
}
