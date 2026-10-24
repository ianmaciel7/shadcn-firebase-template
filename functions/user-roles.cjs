const roles = new Set(["user", "admin"]);

function isRoleRequest(data) {
  return (
    data !== null &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.keys(data).length === 2 &&
    typeof data.uid === "string" &&
    data.uid.length > 0 &&
    typeof data.role === "string" &&
    roles.has(data.role)
  );
}

// Callable authentication is verified by Firebase before this handler runs;
// authorization is the caller's own `role` claim, never client-supplied data.
function createSetUserRoleHandler({ auth, HttpsError }) {
  return async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }
    if (request.auth.token.role !== "admin") {
      throw new HttpsError("permission-denied", "Administrator role required.");
    }
    const data = request.data;
    if (!isRoleRequest(data)) {
      throw new HttpsError("invalid-argument", "Unsupported role request.");
    }
    // Prevents the last administrator from locking everyone out.
    if (data.uid === request.auth.uid && data.role !== "admin") {
      throw new HttpsError(
        "failed-precondition",
        "Administrators cannot remove their own role.",
      );
    }

    const user = await auth.getUser(data.uid);
    await auth.setCustomUserClaims(data.uid, {
      ...user.customClaims,
      role: data.role,
    });
    // Forces clients and verifyIdToken(checkRevoked) to pick up the new claim.
    await auth.revokeRefreshTokens(data.uid);
    return { uid: data.uid, role: data.role };
  };
}

module.exports = { createSetUserRoleHandler };
