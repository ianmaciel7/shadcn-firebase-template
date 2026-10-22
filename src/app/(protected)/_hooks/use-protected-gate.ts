import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getFirebaseUI } from "@/lib/firebase/client";
import { recordUsage } from "@/lib/usage/guard";

export function useProtectedGate() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const pathname = usePathname();
  const [readyPath, setReadyPath] = useState<string | null>(null);
  const [error, setError] = useState<
    "configurationError" | "usageLogError" | null
  >(null);

  useEffect(() => {
    let active = true;
    let revision = 0;
    setError(null);
    let store: ReturnType<typeof getFirebaseUI>;
    try {
      store = getFirebaseUI();
    } catch (cause) {
      console.error(cause);
      setError("configurationError");
      return;
    }

    const unsubscribe = onAuthStateChanged(store.get().auth, (user) => {
      const currentRevision = ++revision;
      setReadyPath(null);
      if (!user) {
        setReadyPath(null);
        const destination = window.location.pathname + window.location.search;
        router.replace(`/sign-in?next=${encodeURIComponent(destination)}`);
      } else {
        void recordUsage({ type: "screen_view", name: pathname }).then(
          () => {
            if (active && revision === currentRevision) setReadyPath(pathname);
          },
          () => {
            if (active && revision === currentRevision)
              setError("usageLogError");
          },
        );
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [router, pathname]);

  return {
    t,
    isLoading: readyPath !== pathname,
    hasError: error !== null,
    errorKey: error ?? "configurationError",
  };
}
