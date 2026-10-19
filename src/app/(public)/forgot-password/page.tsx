"use client";

import { useRouter } from "next/navigation";
import { ForgotPasswordAuthScreen } from "@/components/firebase/forgot-password-auth-screen";

export default function ForgotPasswordPage() {
  const router = useRouter();
  return (
    <ForgotPasswordAuthScreen
      onBackToSignInClick={() => router.push("/sign-in")}
    />
  );
}
