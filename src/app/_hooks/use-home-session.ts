"use client";

import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { subscribeToSession } from "@/lib/auth/session";

type HomeSession =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; user: User };

function useHomeSession() {
  const [session, setSession] = useState<HomeSession>({ status: "loading" });
  useEffect(() => {
    try {
      return subscribeToSession(
        (user) =>
          setSession(
            user ? { status: "signed-in", user } : { status: "signed-out" },
          ),
        () => setSession({ status: "signed-out" }),
      );
    } catch {
      setSession({ status: "signed-out" });
    }
  }, []);
  return session;
}

export { useHomeSession };
