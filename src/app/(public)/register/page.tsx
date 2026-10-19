"use client";

import { SignUpAuthScreen } from "@firebase-oss/ui-react";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";

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
