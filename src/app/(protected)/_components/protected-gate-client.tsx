"use client";

import type { PropsWithChildren } from "react";
import { LabeledSpinner } from "@/components/ui/extensions/labeled-spinner";
import { useProtectedGateClient } from "../_hooks/use-protected-gate-client";

type ProtectedGateClientProps = PropsWithChildren;

function ProtectedGateClient({ children }: ProtectedGateClientProps) {
  const state = useProtectedGateClient();
  const { t } = state;

  if (state.status === "error") {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <p role="alert">{t(state.errorKey)}</p>
      </main>
    );
  }

  if (state.status === "loading") {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <LabeledSpinner className="text-sm text-muted-foreground">
          {t("loading")}
        </LabeledSpinner>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
      {children}
    </main>
  );
}

export { ProtectedGateClient };
