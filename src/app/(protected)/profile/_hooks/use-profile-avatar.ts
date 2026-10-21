import { useTranslations } from "next-intl";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "@/components/ui/toast";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

interface LocalAvatarState {
  file: File | null;
  preview: string | null;
}

export function useProfileAvatar() {
  const t = useTranslations("Auth");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<LocalAvatarState>({
    file: null,
    preview: null,
  });

  // Clean up object URL when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      setAvatar((prev) => {
        if (prev.preview) URL.revokeObjectURL(prev.preview);
        return prev;
      });
    };
  }, []);

  const clearAvatar = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setAvatar((prev) => {
      if (prev.preview) URL.revokeObjectURL(prev.preview);
      return { file: null, preview: null };
    });
  }, []);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.has(file.type) || file.size > MAX_AVATAR_SIZE) {
      toast.add({
        title: t("profilePhotoInvalid"),
        type: "error",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setAvatar((prev) => {
      if (prev.preview) URL.revokeObjectURL(prev.preview);
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });
  };

  const setAvatarFile = useCallback((file: File | null) => {
    if (!file && fileInputRef.current) fileInputRef.current.value = "";
    setAvatar((prev) => {
      if (prev.preview) URL.revokeObjectURL(prev.preview);
      return {
        file,
        preview: file ? URL.createObjectURL(file) : null,
      };
    });
  }, []);

  return {
    avatarFile: avatar.file,
    avatarPreview: avatar.preview,
    clearAvatar,
    fileInputRef,
    handleAvatarChange,
    setAvatarFile,
  };
}
