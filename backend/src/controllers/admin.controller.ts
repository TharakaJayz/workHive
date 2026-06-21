import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/AppError";
import { jobService } from "../services/job.service";


export const adminController = {
    updateJobStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.id);

            if (!req.params.id || Number.isNaN(jobId)) {
                console.warn("[admin.updateJobStatus ⛔️] invalid jobId", {
                    param: req.params.id,
                });

                throw new AppError(
                    400,
                    "INVALID_JOB_ID",
                    "Job ID is required and must be a number"
                );
            }

            const result = await jobService.updateJobStatusByAdmin(
                jobId,
                req.body
            );

            res.status(200).json({
                success: true,
                data: result,
            });


        } catch (error) {
            next(error);
        }
    },
    deleteJobById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.id);

            if (!req.params.id || Number.isNaN(jobId)) {
                console.warn("[admin.deleteJobById ⛔️] invalid jobId", {
                    param: req.params.id,
                });

                throw new AppError(
                    400,
                    "INVALID_JOB_ID",
                    "Job ID is required and must be a number"
                );
            }

            const result = await jobService.deletedAJobById(
                jobId
            );

            res.status(200).json({
                success: true,
                data: result,
            });


        } catch (error) {
            next(error);
        }
    }
}