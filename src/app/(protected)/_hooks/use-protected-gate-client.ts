import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { subscribeToSession } from "@/lib/auth/session";
import { recordUsage } from "@/lib/usage/guard";

export function useProtectedGateClient() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const pathname = usePathname();
  const revision = useRef(0);
  const [readyPath, setReadyPath] = useState<string | null>(null);
  const [error, setError] = useState<
    "configurationError" | "usageLogError" | null
  >(null);

  useEffect(() => {
    let active = true;
    setError(null);
    let unsubscribe: () => void;
    try {
      unsubscribe = subscribeToSession((user) => {
        const currentRevision = ++revision.current;
        setError(null);
        setReadyPath(null);
        if (!user) {
          const destination = window.location.pathname + window.location.search;
          router.replace(`/sign-in?next=${encodeURIComponent(destination)}`);
        } else {
          void recordUsage({ type: "screen_view", name: pathname }).then(
            () => {
              if (active && revision.current === currentRevision)
                setReadyPath(pathname);
            },
            () => {
              if (active && revision.current === currentRevision)
                setError("usageLogError");
            },
          );
        }
      });
    } catch (cause) {
      console.error(cause);
      setError("configurationError");
      return;
    }
    return () => {
      active = false;
      unsubscribe();
    };
  }, [router, pathname]);

  if (error) return { t, status: "error" as const, errorKey: error };
  if (readyPath !== pathname) return { t, status: "loading" as const };
  return { t, status: "ready" as const };
}
