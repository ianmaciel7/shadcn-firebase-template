import { useAuthNavigation } from "@/app/_hooks/use-auth-navigation";

export function useSignInAuthFlow() {
  return useAuthNavigation();
}
