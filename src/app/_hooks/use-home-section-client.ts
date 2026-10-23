"use client";

import { useTranslations } from "next-intl";
import { useHomeSession } from "./use-home-session";

export function useHomeSectionClient() {
  const t = useTranslations("Home");
  const { ready, user } = useHomeSession();

  return {
    t,
    ready,
    user,
  };
}
