"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignInAuthScreen } from "@/components/firebase/sign-in-auth-screen";

export type SignInFormProps = ComponentProps<"div">;

function SignInForm(props: SignInFormProps) {
  const router = useRouter();
  return (
    <div {...props}>
      <SignInAuthScreen
        onSignUpClick={() => router.push("/register")}
        onForgotPasswordClick={() => router.push("/forgot-password")}
      >
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignInAuthScreen>
    </div>
  );
}

export { SignInForm };
