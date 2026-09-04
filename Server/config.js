export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5500,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/med-meet",
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  MAIL_FROM: process.env.MAIL_FROM || "Med-Meet <no-reply@med-meet.local>",
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || "support@medmeet.com",
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

if (!config.JWT_SECRET) {
  if (config.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production. Refusing to start with an insecure default.");
  }
  config.JWT_SECRET = "dev_only_insecure_jwt_secret";
  console.warn("[config] JWT_SECRET not set - using an insecure development default. Set JWT_SECRET in your .env file.");
}
