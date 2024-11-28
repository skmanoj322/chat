import { access_token_key } from "../auth/index.js";
import jwt from "jsonwebtoken";
export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    jwt.verify(token, access_token_key, async (error, user) => {
        if (error)
            return res.status(401).json({ message: "Invalid Token" });
        if (user && typeof user === "object") {
            req.user = user;
        }
        next();
    });
}
