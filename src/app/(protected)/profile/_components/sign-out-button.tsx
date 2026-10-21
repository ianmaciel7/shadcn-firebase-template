import { LogOut } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type SignOutButtonProps = ComponentProps<typeof Button> & {
  isSigningOut?: boolean;
};

function SignOutButton({
  className,
  disabled,
  isSigningOut = false,
  children,
  ...props
}: SignOutButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "w-full text-muted-foreground hover:text-destructive",
        className,
      )}
      disabled={disabled || isSigningOut}
      {...props}
    >
      {isSigningOut ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <LogOut data-icon="inline-start" aria-hidden="true" />
      )}
      {children}
    </Button>
  );
}

export { SignOutButton };
