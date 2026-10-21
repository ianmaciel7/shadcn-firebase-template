import { LogOut } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/extensions/loading";
import { cn } from "@/lib/utils";
import { useProfileSignOut } from "../_hooks/use-profile-sign-out";

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
  const { t, handleSignOut, isSigningOut, isDisabled } = useProfileSignOut();

  return (
    <Button
      {...props}
      onClick={handleSignOut}
      type="button"
      aria-busy={isSigningOut}
      variant="link"
      size="sm"
      className={cn("w-full text-xs", className)}
      disabled={disabled || isDisabled}
    >
      {isSigningOut ? (
        <Loading>{children ?? t("signOut")}</Loading>
      ) : (
        <>
          <LogOut data-icon="inline-start" aria-hidden="true" />
          {children ?? t("signOut")}
        </>
      )}
    </Button>
  );
}

export { ProfileSignOutButton };
