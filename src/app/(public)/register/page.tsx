"use client";

import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignUpAuthScreen } from "@/components/firebase/sign-up-auth-screen";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <SignUpAuthScreen onSignInClick={() => router.push("/sign-in")}>
      {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
        <GoogleSignInButton />
      ) : null}
    </SignUpAuthScreen>
  );
}
