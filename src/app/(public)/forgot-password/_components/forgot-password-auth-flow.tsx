"use client";

import type { ComponentProps } from "react";
import { ForgotPasswordAuthScreen } from "@/components/firebase/forgot-password-auth-screen";
import { useForgotPasswordAuthFlow } from "../_hooks/use-forgot-password-auth-flow";

type ForgotPasswordAuthFlowProps = ComponentProps<"div">;

function ForgotPasswordAuthFlow(props: ForgotPasswordAuthFlowProps) {
  const { goToSignIn } = useForgotPasswordAuthFlow();
  return (
    <div {...props}>
      <ForgotPasswordAuthScreen onBackToSignInClick={goToSignIn} />
    </div>
  );
}

export { ForgotPasswordAuthFlow };
