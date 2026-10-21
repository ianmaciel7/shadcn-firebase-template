import type { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProfileClientState } from "../_hooks/use-profile-client";

type ProfileAvatarFieldProps = ComponentProps<"div"> & {
  profile: ProfileClientState;
  user: NonNullable<ProfileClientState["user"]>;
};

function ProfileAvatarField({
  className,
  profile,
  user,
  ...props
}: ProfileAvatarFieldProps) {
  const {
    avatarPreview,
    avatarVersion,
    fileInputRef,
    handleAvatarChange,
    isBusy,
    photoURL,
    t,
  } = profile;
  const avatarSrc = getAvatarSource(avatarPreview, photoURL, avatarVersion);
  const fallbackInitial = getFallbackInitial(user);

  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <Avatar className="size-16">
        {avatarSrc ? (
          <AvatarImage
            src={avatarSrc}
            alt={user.displayName ?? t("profileTitle")}
          />
        ) : null}
        <AvatarFallback className="text-xl">{fallbackInitial}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col items-start">
        <span className="max-w-full truncate text-sm font-medium">
          {user.displayName || t("profileTitle")}
        </span>
        <span className="max-w-full truncate text-xs text-muted-foreground">
          {user.email}
        </span>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto px-0"
          disabled={isBusy}
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
          disabled={isBusy}
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  );
}

function getAvatarSource(
  preview: ProfileClientState["avatarPreview"],
  photoURL: ProfileClientState["photoURL"],
  version: ProfileClientState["avatarVersion"],
) {
  if (preview) return preview;
  if (!photoURL || !version) return photoURL ?? undefined;

  return `${photoURL}${photoURL.includes("?") ? "&" : "?"}v=${version}`;
}

function getFallbackInitial(user: NonNullable<ProfileClientState["user"]>) {
  return (
    user.displayName?.charAt(0) ||
    user.email?.charAt(0) ||
    "U"
  ).toUpperCase();
}

export { ProfileAvatarField };
