import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
    register: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await authService.register(req.body);

            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await authService.login(req.body);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
};
