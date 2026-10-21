import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ProfileFormValues } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { useProfileAvatar } from "../_hooks/use-profile-avatar";
import { useProfileSessionContext } from "../_hooks/use-profile-session-context";

type ProfileAvatarFieldProps = ComponentProps<"div">;

function ProfileAvatarField({ className, ...props }: ProfileAvatarFieldProps) {
  const t = useTranslations("Auth");
  const { user, photoURL, avatarVersion } = useProfileSessionContext();
  const { control, setValue, formState } = useFormContext<ProfileFormValues>();
  const avatarFile = useWatch({ control, name: "avatarFile" });
  const { avatarPreview, fileInputRef, handleAvatarChange } = useProfileAvatar(
    avatarFile,
    (file) => setValue("avatarFile", file, { shouldDirty: true }),
  );
  const displayName = user?.displayName ?? null;
  const email = user?.email ?? null;
  const disabled = formState.disabled || formState.isSubmitting;
  const avatarSrc = getAvatarSource(avatarPreview, photoURL, avatarVersion);
  const fallbackInitial = (
    displayName?.charAt(0) ||
    email?.charAt(0) ||
    "U"
  ).toUpperCase();

  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <Avatar className="size-16">
        {avatarSrc ? (
          <AvatarImage src={avatarSrc} alt={displayName ?? t("profileTitle")} />
        ) : null}
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

function getAvatarSource(
  preview: string | null,
  photoURL: string | null,
  version: number,
) {
  if (preview) return preview;
  if (!photoURL || !version) return photoURL ?? undefined;

  return `${photoURL}${photoURL.includes("?") ? "&" : "?"}v=${version}`;
}

export { ProfileAvatarField };
