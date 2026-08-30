import { logger } from "../utility/logger.js";
import { config } from "../config.js";
import { captureException } from "../utility/errorTracking.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
};

// Must be registered last, after all routes.
// eslint-disable-next-line no-unused-vars -- 4th arg required for Express to treat this as error middleware
export const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.originalUrl, method: req.method });
  captureException(err);

  const status = err.status || err.statusCode || 500;
  const message = status === 500 && config.NODE_ENV === "production"
    ? "Internal server error."
    : err.message || "Internal server error.";

  res.status(status).json({
    message,
    ...(config.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
