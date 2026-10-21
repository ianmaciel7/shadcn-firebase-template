import { LogOut } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { ProfileClientState } from "../_hooks/use-profile-client";

export type SignOutButtonProps = ComponentProps<typeof Button> & {
  profile: ProfileClientState;
};

function SignOutButton({
  profile,
  className,
  disabled,
  onClick,
  ...props
}: SignOutButtonProps) {
  const { handleSignOut, isBusy, isSigningOut, t } = profile;

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "mt-2 w-full text-muted-foreground hover:text-destructive",
        className,
      )}
      disabled={disabled ?? isBusy}
      onClick={onClick ?? handleSignOut}
      {...props}
    >
      {isSigningOut ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <LogOut data-icon="inline-start" aria-hidden="true" />
      )}
      {t("signOut")}
    </Button>
  );
}

export { SignOutButton };
