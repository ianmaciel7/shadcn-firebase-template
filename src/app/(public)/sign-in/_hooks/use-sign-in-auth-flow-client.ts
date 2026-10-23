import { useAuthNavigation } from "@/app/_hooks/use-auth-navigation";

export function useSignInAuthFlowClient() {
  return useAuthNavigation();
}
