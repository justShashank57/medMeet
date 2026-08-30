import * as Sentry from "@sentry/node";
import { config } from "../config.js";

const isConfigured = Boolean(config.SENTRY_DSN);

export const initErrorTracking = () => {
    if (!isConfigured) return;
    Sentry.init({ dsn: config.SENTRY_DSN, environment: config.NODE_ENV });
};

// Best-effort: never throws, so a missing/broken Sentry setup never blocks error handling.
export const captureException = (err) => {
    if (!isConfigured) return;
    try {
        Sentry.captureException(err);
    } catch {
        // swallow - error tracking must never itself crash the process
    }
};
