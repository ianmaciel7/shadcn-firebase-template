"use client";

import { GoogleSignInButton, SignInAuthScreen } from "@firebase-oss/ui-react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  return (
    <SignInAuthScreen
      onSignUpClick={() => router.push("/register")}
      onForgotPasswordClick={() => router.push("/forgot-password")}
    >
      {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
        <GoogleSignInButton />
      ) : null}
    </SignInAuthScreen>
  );
}
