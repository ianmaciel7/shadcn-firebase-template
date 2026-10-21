import { useTranslations } from "next-intl";
import { useProfileSession } from "./use-profile-session";
import { useProfileView } from "./use-profile-view";

export function useProfileSection() {
  const profile = useProfileSession();
  const view = useProfileView(profile);
  const t = useTranslations("Auth");
  return { profile, view, t };
}
