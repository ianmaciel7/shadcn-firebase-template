import type { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfileAvatarField } from "../_hooks/use-profile-avatar-field";

type ProfileAvatarFieldProps = ComponentProps<"div">;

function ProfileAvatarField({ className, ...props }: ProfileAvatarFieldProps) {
  const {
    t,
    displayName,
    email,
    disabled,
    avatarSrc,
    avatarAlt,
    fallbackInitial,
    fileInputRef,
    handleAvatarChange,
  } = useProfileAvatarField();

  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <Avatar className="size-16">
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={avatarAlt} /> : null}
        <AvatarFallback className="text-xl">{fallbackInitial}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col items-start">
        <span className="max-w-full truncate text-sm font-medium">
          {displayName || t("profileTitle")}
        </span>
        <span className="max-w-full truncate text-xs text-muted-foreground">
          {email}
        </span>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto px-0"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          {t("profilePhotoChange")}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={t("profilePhotoChange")}
          disabled={disabled}
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  );
}

export { ProfileAvatarField };
