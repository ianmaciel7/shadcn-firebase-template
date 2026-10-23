"use client";

import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import type { PropsWithChildren } from "react";
import { LabeledSpinner } from "@/components/ui/extensions/labeled-spinner";
import { useAuthProviderClient } from "../_hooks/use-auth-provider-client";

type AuthProviderClientProps = PropsWithChildren;

function AuthProviderClient({ children }: AuthProviderClientProps) {
  const state = useAuthProviderClient();
  const { t } = state;

  if (state.status === "error")
    return (
      <p
        role="alert"
        className="text-center text-sm font-medium text-destructive"
      >
        {t("configurationError")}
      </p>
    );
  if (state.status === "loading")
    return (
      <LabeledSpinner className="w-full text-sm text-muted-foreground">
        {t("loading")}
      </LabeledSpinner>
    );
  return <FirebaseUIProvider ui={state.ui}>{children}</FirebaseUIProvider>;
}

export { AuthProviderClient };
