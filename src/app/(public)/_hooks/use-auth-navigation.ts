import { useRouter } from "next/navigation";
import { getAuthNavigationUrl } from "@/lib/return-url";

export function useAuthNavigation() {
  const router = useRouter();
  function navigate(path: "/sign-in" | "/register" | "/forgot-password") {
    router.push(getAuthNavigationUrl(path, window.location.search));
  }
  return {
    goToSignIn: () => navigate("/sign-in"),
    goToRegister: () => navigate("/register"),
    goToForgotPassword: () => navigate("/forgot-password"),
  };
}
