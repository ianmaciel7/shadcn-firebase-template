"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getFirebaseUI } from "@/lib/firebase/client";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
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

  if (error) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <p role="alert">{t("configurationError")}</p>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <div role="status" className="flex items-center justify-center">
          {t("loading")}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
