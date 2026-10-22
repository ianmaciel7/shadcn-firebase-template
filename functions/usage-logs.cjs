const { randomUUID } = require("node:crypto");

const events = {
  screen_view: new Set(["/profile"]),
  function_use: new Set(["profile.update"]),
};

// Callable authentication is verified by Firebase before this handler runs.
function createUsageLogHandler({ logger, HttpsError }) {
  return (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }
    const data = request.data;
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      Object.keys(data).length !== 2 ||
      !Object.hasOwn(data, "type") ||
      !Object.hasOwn(data, "name") ||
      typeof data.type !== "string" ||
      typeof data.name !== "string" ||
      !Object.hasOwn(events, data.type) ||
      !events[data.type].has(data.name)
    ) {
      throw new HttpsError("invalid-argument", "Unsupported usage event.");
    }

    const eventId = randomUUID();
    // Only approved fields cross into Logging; never log request bodies/tokens.
    logger.info("Application usage", {
      event: "app_usage",
      schemaVersion: 1,
      eventId,
      uid: request.auth.uid,
      type: data.type,
      name: data.name,
    });
    // Acknowledges handler execution, not durable ingestion by Cloud Logging.
    return { eventId };
  };
}

module.exports = { createUsageLogHandler };
