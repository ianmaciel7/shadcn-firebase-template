import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/loading/loading-indicator";
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
  const t = useTranslations("Auth");
  return (
    <Button
      {...props}
      type="button"
      aria-busy={isSigningOut}
      variant="ghost"
      className={cn(
        "w-full text-muted-foreground hover:text-destructive",
        className,
      )}
      disabled={disabled || isSigningOut}
    >
      {isSigningOut ? (
        <LoadingIndicator label={t("signingOut")} className="text-inherit" />
      ) : (
        <LogOut data-icon="inline-start" aria-hidden="true" />
      )}
      {!isSigningOut && children}
    </Button>
  );
}

export { SignOutButton };
