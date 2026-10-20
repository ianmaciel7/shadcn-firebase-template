import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ProfileClientState } from "../_hooks/use-profile-client";

type SignOutButtonProps = { profile: ProfileClientState };

export function SignOutButton({ profile }: SignOutButtonProps) {
  const { handleSignOut, isBusy, isSigningOut, t } = profile;

  return (
    <Button
      type="button"
      variant="ghost"
      className="mt-2 w-full text-muted-foreground hover:text-destructive"
      disabled={isBusy}
      onClick={handleSignOut}
    >
      {isSigningOut ? (
        <Spinner />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      {t("signOut")}
    </Button>
  );
}
