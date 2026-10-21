import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { getFirebaseUI } from "@/lib/firebase/client";
import type { ProfileFormValues } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { useProfileFormState } from "../_hooks/use-profile-form-state";

type ProfileSignOutButtonProps = Omit<
  ComponentProps<typeof Button>,
  "type" | "onClick"
>;

function ProfileSignOutButton({
  className,
  disabled,
  children,
  ...props
}: ProfileSignOutButtonProps) {
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

  return (
    <Button
      {...props}
      onClick={handleSignOut}
      type="button"
      aria-busy={isSigningOut}
      variant="link"
      size="sm"
      className={cn("w-full text-xs", className)}
      disabled={
        disabled || isSigningOut || formState.isSubmitting || formState.disabled
      }
    >
      {isSigningOut ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <LogOut data-icon="inline-start" aria-hidden="true" />
      )}
      {children ?? t("signOut")}
    </Button>
  );
}

export { ProfileSignOutButton };
