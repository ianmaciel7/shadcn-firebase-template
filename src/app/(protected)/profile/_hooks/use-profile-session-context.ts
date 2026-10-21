import { createContext, useContext } from "react";
import type { useProfileSession } from "./use-profile-session";

export const ProfileSessionContext = createContext<ReturnType<
  typeof useProfileSession
> | null>(null);

export function useProfileSessionContext() {
  const session = useContext(ProfileSessionContext);
  if (!session?.defaultValues)
    throw new Error("Profile components require ProfileSessionContext");
  return { ...session, defaultValues: session.defaultValues };
}
