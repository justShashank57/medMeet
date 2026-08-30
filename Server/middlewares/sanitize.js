// express-mongo-sanitize reassigns req.query wholesale, which Express 5 made
// a read-only getter, breaking every request. This mutates objects in place
// instead, stripping keys that could be interpreted as Mongo operators.
const stripOperators = (obj) => {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
            delete obj[key];
            continue;
        }
        if (obj[key] && typeof obj[key] === "object") {
            stripOperators(obj[key]);
        }
    }
};

export const sanitizeRequest = (req, res, next) => {
    stripOperators(req.body);
    stripOperators(req.params);
    stripOperators(req.query);
    next();
};
