import swaggerJsdoc from "swagger-jsdoc";
import { config } from "../config.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Med-Meet API",
      version: "1.0.0",
      description: "Doctor appointment booking API for patients, doctors, and admins.",
    },
    servers: [{ url: `http://localhost:${config.PORT}`, description: "Local" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        adminKey: { type: "apiKey", in: "header", name: "x-admin-key" },
      },
      schemas: {
        Error: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  },
  apis: ["./Routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
