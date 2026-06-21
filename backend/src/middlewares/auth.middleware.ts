import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { AppError } from "../lib/AppError";
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        console.warn("[auth.middleware ❌] missing token");
        return next(
            new AppError(401, "MISSING_TOKEN", "Authorization token required")
        );
    }

    const token = authHeader.split(" ")[1];

    req.user = verifyToken(token);
    next();
};
