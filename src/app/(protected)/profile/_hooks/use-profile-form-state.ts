import { createContext, useContext } from "react";

export const ProfileFormStateContext = createContext<{
  isSigningOut: boolean;
  setIsSigningOut: (pending: boolean) => void;
} | null>(null);

export function useProfileFormState() {
  const state = useContext(ProfileFormStateContext);
  if (!state) throw new Error("Profile actions require ProfileForm");
  return state;
}
