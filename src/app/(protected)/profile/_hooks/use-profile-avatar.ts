import { useTranslations } from "next-intl";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function useProfileAvatar() {
  const t = useTranslations("Auth");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }

    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.has(file.type) || file.size > MAX_AVATAR_SIZE) {
      toast.add({
        title: t("profilePhotoInvalid"),
        type: "error",
      });
      return;
    }

    setAvatarFile(file);
  };

  return {
    avatarFile,
    avatarPreview,
    avatarVersion,
    fileInputRef,
    handleAvatarChange,
    setAvatarFile,
    setAvatarVersion,
  };
}
