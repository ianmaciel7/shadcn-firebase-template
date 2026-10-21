import { useTranslations } from "next-intl";
import type { ChangeEventHandler, ComponentProps, RefObject } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProfileAvatarFieldProps = ComponentProps<"div"> & {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  avatarPreview: string | null;
  avatarVersion: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
};

function ProfileAvatarField({
  className,
  displayName,
  email,
  photoURL,
  avatarPreview,
  avatarVersion,
  fileInputRef,
  onFileChange,
  disabled,
  ...props
}: ProfileAvatarFieldProps) {
  const t = useTranslations("Auth");
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
          onChange={onFileChange}
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
