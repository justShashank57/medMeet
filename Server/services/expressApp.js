import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import { sanitizeRequest } from "../middlewares/sanitize.js";
import { adminRoute } from "../Routes/adminRoutes.js";
import { doctorRoute } from "../Routes/doctorRoutes.js";
import { patientRoute } from "../Routes/patientRoutes.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "../middlewares/errorHandler.js";
import { httpLogStream } from "../utility/logger.js";
import { config } from "../config.js";

export default async (app)=>{
    app.use(helmet());
    app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
    app.use(morgan("combined", { stream: httpLogStream }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(sanitizeRequest);
    app.use(apiLimiter);

    app.get('/',(req,res)=>{
       res.send("Hello from server.")
    })

    // Swagger UI needs inline scripts/styles, which the default CSP blocks.
    app.use('/api-docs', (req,res,next)=>{ res.removeHeader('Content-Security-Policy'); next(); }, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/admin',adminRoute);
    app.use('/doctor',doctorRoute);
    app.use('/patient',patientRoute);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
