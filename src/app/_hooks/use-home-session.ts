"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseUI } from "@/lib/firebase/client";

function useHomeSession() {
  const [session, setSession] = useState<{ ready: boolean; user: User | null }>(
    { ready: false, user: null },
  );
  useEffect(() => {
    try {
      return onAuthStateChanged(
        getFirebaseUI().get().auth,
        (user) => setSession({ ready: true, user }),
        () => setSession({ ready: true, user: null }),
      );
    } catch {
      setSession({ ready: true, user: null });
    }
  }, []);
  return session;
}

export { useHomeSession };
