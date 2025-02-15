import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(errorHandler(401, "Unauthorized"));
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Forbidden"));
        req.user = user;
        next();
    });
};
