import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getFirebaseUI } from "@/lib/firebase/client";

export function useProtectedGate() {
  const t = useTranslations("Auth");
  const router = useRouter();
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

    return onAuthStateChanged(store.get().auth, (user) => {
      if (!user) {
        setReady(false);
        const destination = window.location.pathname + window.location.search;
        router.replace(`/sign-in?next=${encodeURIComponent(destination)}`);
      } else {
        setReady(true);
      }
    });
  }, [router]);

  return { t, isLoading: !ready, hasError: error };
}
