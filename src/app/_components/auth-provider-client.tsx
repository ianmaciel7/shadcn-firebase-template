"use client";

import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import type { PropsWithChildren } from "react";
import { Loading } from "@/components/ui/extensions/loading";
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
      <Loading className="w-full text-sm text-muted-foreground">
        {t("loading")}
      </Loading>
    );
  return <FirebaseUIProvider ui={state.ui}>{children}</FirebaseUIProvider>;
}

export { AuthProviderClient };
