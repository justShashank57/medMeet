import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { logger } from "../utility/logger.js";
import { AUTH_COOKIE_NAME } from "../utility/passUtility.js";

// Browser clients authenticate via the httpOnly cookie set on login; the
// Authorization header is still accepted for non-browser clients.
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith("Bearer "))
        ? authHeader.split(" ")[1]
        : req.cookies?.[AUTH_COOKIE_NAME];

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

// Restricts a route to a specific token role (e.g. "doctor" or "patient").
// Must run after requireAuth so req.user is populated.
export const requireRole = (role) => (req, res, next) => {
    if (req.user?.role !== role) {
        return res.status(403).json({ message: "Forbidden." });
    }
    return next();
};
