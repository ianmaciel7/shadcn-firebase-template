"use client";

import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import { enUs, esEs, ptBr } from "@firebase-oss/ui-translations";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type PropsWithChildren, useEffect, useState } from "react";
import { getFirebaseUI } from "@/lib/firebase";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
  const locale = useLocale();
  const t = useTranslations("Auth");
  const router = useRouter();
  const [ui, setUI] = useState<ReturnType<typeof getFirebaseUI>>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let store: ReturnType<typeof getFirebaseUI>;
    try {
      store = getFirebaseUI();
    } catch (cause) {
      console.error(cause);
      setError(true);
      return;
    }
    setUI(store);
    return onAuthStateChanged(store.get().auth, (user) => {
      if (user) {
        setReady(false);
        router.replace("/profile");
      } else setReady(true);
    });
  }, [router]);

  useEffect(() => {
    if (ui)
      ui.get().setLocale(
        locale === "pt-BR" ? ptBr : locale === "es" ? esEs : enUs,
      );
  }, [ui, locale]);

  if (error) return <p role="alert">{t("configurationError")}</p>;
  if (!ui || !ready) return <p role="status">{t("loading")}</p>;
  return <FirebaseUIProvider ui={ui}>{children}</FirebaseUIProvider>;
}
