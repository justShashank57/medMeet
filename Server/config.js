export const config = {
  PORT: process.env.PORT || 5500,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/med-meet",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key_here_change_this_in_production"
};
