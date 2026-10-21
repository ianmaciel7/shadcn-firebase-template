import { useTranslations } from "next-intl";
import { useProfileSession } from "./use-profile-session";
import { useProfileStatus } from "./use-profile-status";

export function useProfileSection() {
  const profile = useProfileSession();
  const state = useProfileStatus(profile);
  const t = useTranslations("Auth");
  return { profile, state, t };
}
