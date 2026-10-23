"use client";

import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import type { PropsWithChildren } from "react";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { useAuthProviderClient } from "../_hooks/use-auth-provider";

type AuthProviderClientProps = PropsWithChildren;

function AuthProviderClient({ children }: AuthProviderClientProps) {
  const state = useAuthProviderClient();
  const { t } = state;

  if (state.isError)
    return (
      <p
        role="alert"
        className="text-center text-sm font-medium text-destructive"
      >
        {t("configurationError")}
      </p>
    );
  if (state.isLoading)
    return (
      <LoadingIndicator className="w-full text-sm text-muted-foreground">
        {t("loading")}
      </LoadingIndicator>
    );
  return <FirebaseUIProvider ui={state.ui}>{children}</FirebaseUIProvider>;
}

export { AuthProviderClient };
