import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { logger } from "../utility/logger.js";

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication required." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication required." });
    }

    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        req.user = decodedToken;
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        logger.warn("JWT verification failed", { error: err.message });
        return res.status(401).json({ message: "Invalid authentication token." });
    }
};
