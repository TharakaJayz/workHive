import { NextFunction, Request, Response } from "express";
import { applicationService } from "../services/application.service";

export const applicationController = {
    findAllApplicationByUserId: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await applicationService.findAllApplicationByUserId(
                req.user.userId
            )
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}