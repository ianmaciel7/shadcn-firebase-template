"use client";

import type { ComponentProps } from "react";
import { useAuthNavigation } from "@/app/_hooks/use-auth-navigation";
import { ForgotPasswordAuthScreen } from "@/components/firebase/forgot-password-auth-screen";

type ForgotPasswordAuthFlowProps = ComponentProps<"div">;

function ForgotPasswordAuthFlow(props: ForgotPasswordAuthFlowProps) {
  const { goToSignIn } = useAuthNavigation();
  return (
    <div {...props}>
      <ForgotPasswordAuthScreen onBackToSignInClick={goToSignIn} />
    </div>
  );
}

export { ForgotPasswordAuthFlow };
