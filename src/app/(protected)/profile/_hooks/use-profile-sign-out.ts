import { signOut } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { getFirebaseUI } from "@/lib/firebase/client";
import type { ProfileFormValues } from "@/lib/profile";
import { useProfileFormState } from "./use-profile-form-state";

export function useProfileSignOut() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { formState } = useFormContext<ProfileFormValues>();
  const { isSigningOut, setIsSigningOut } = useProfileFormState();

  async function handleSignOut() {
    if (isSigningOut || formState.isSubmitting) return;
    setIsSigningOut(true);
    try {
      await signOut(getFirebaseUI().get().auth);
      router.replace("/sign-in");
    } catch (cause) {
      console.error(cause);
      toast.add({ title: t("profileSaveError"), type: "error" });
      setIsSigningOut(false);
    }
  }

  const isDisabled =
    isSigningOut || formState.isSubmitting || formState.disabled;
  return { t, handleSignOut, isSigningOut, isDisabled };
}
