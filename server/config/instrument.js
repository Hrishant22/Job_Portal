// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://735388d53c79ae5c9a22b2ed8097483b@o4509580636454912.ingest.us.sentry.io/4509580653101056",
  integrations:[
    Sentry.mongooseIntegration(),
  ],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});