import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError";
import { UserRole } from "../shared/enum";

export const authorizeRoles =
    (...allowedRoles: UserRole[]) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(
                new AppError(401, "MISSING_TOKEN", "Not authenticated")
            );
        }

        if (!allowedRoles.includes(req.user.role as UserRole)) {
            console.warn(
                `[rbac.middleware ❌] This action requires one of these roles: ${allowedRoles.join(", ")}  `
            );
            return next(
                new AppError(
                    403,
                    "FORBIDDEN",
                    `This action requires one of these roles: ${allowedRoles.join(", ")}`
                )
            );
        }

        next();
    };
