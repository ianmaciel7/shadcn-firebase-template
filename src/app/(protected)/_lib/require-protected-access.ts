import "server-only";

import { getFirebaseServerSession } from "@/lib/firebase/server";
import { redirectToSignIn } from "@/lib/navigation";

/**
 * Redirects only when the worker bridge vouched for the request but the token
 * did not verify; otherwise the client guard remains the first-load fallback.
 */
export async function requireProtectedAccess() {
  const session = await getFirebaseServerSession();
  if (session.isBridgeActive && !session.userId) redirectToSignIn();
}
