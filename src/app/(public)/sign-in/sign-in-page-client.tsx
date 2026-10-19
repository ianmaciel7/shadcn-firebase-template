"use client";

import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignInAuthScreen } from "@/components/firebase/sign-in-auth-screen";

export default function SignInPageClient() {
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
