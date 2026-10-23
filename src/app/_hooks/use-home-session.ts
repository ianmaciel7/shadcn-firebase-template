"use client";

import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { subscribeToSession } from "@/lib/auth/session";

function useHomeSession() {
  const [session, setSession] = useState<{ ready: boolean; user: User | null }>(
    { ready: false, user: null },
  );
  useEffect(() => {
    try {
      return subscribeToSession(
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
