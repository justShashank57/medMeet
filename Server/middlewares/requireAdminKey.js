import { config } from "../config.js";

// Minimal protection for destructive admin endpoints (create/delete doctor).
// There is no admin account system in this app yet, so we gate on a shared
// secret instead of building out a full admin auth flow.
export const requireAdminKey = (req, res, next) => {
    if (!config.ADMIN_API_KEY) {
        return res.status(503).json({ message: "Admin endpoints are disabled: ADMIN_API_KEY is not configured." });
    }
    const providedKey = req.headers["x-admin-key"];
    if (providedKey !== config.ADMIN_API_KEY) {
        return res.status(401).json({ message: "Invalid or missing admin key." });
    }
    next();
};
