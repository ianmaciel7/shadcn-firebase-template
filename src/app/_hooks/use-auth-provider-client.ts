import { enUs, esEs, ptBr } from "@firebase-oss/ui-translations";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getSafeReturnUrl } from "@/lib/auth/return-url";
import { subscribeToSession } from "@/lib/auth/session";
import { getFirebaseUI } from "@/lib/firebase/client";

export function useAuthProviderClient() {
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
    return subscribeToSession((user) => {
      if (user) {
        setReady(false);
        const destination = getSafeReturnUrl(
          new URLSearchParams(window.location.search).get("next"),
        );
        router.replace(destination);
      } else setReady(true);
    });
  }, [router]);

  useEffect(() => {
    if (ui)
      ui.get().setLocale(
        locale === "pt-BR" ? ptBr : locale === "es" ? esEs : enUs,
      );
  }, [ui, locale]);

  if (error) return { status: "error" as const, t };
  if (!ui || !ready) return { status: "loading" as const, t };
  return { status: "ready" as const, ui, t };
}
