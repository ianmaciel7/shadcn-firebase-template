const {
  onCall,
  onRequest,
  HttpsError,
} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.helloWorld = onRequest((_request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase Functions!");
});

const { createUsageLogHandler } = require("./usage-logs.cjs");

exports.recordUsage = onCall(
  { timeoutSeconds: 15, maxInstances: 10 },
  createUsageLogHandler({ logger, HttpsError }),
);
