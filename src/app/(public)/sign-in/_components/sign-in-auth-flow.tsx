"use client";

import type { ComponentProps } from "react";
import { useAuthNavigation } from "@/app/_hooks/use-auth-navigation";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignInAuthScreen } from "@/components/firebase/sign-in-auth-screen";

type SignInAuthFlowProps = ComponentProps<"div">;

function SignInAuthFlow(props: SignInAuthFlowProps) {
  const { goToRegister, goToForgotPassword } = useAuthNavigation();
  return (
    <div {...props}>
      <SignInAuthScreen
        onSignUpClick={goToRegister}
        onForgotPasswordClick={goToForgotPassword}
      >
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignInAuthScreen>
    </div>
  );
}

export { SignInAuthFlow };
