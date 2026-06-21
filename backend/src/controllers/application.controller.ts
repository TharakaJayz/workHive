import { NextFunction, Request, Response } from "express";
import { applicationService } from "../services/application.service";

import path from "path";
import { Worker } from "worker_threads";
import { CreateApplicationInput } from "../schemas/application.schema";
import { authService } from "../services/auth.service";
import { jobService } from "../services/job.service";

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
    },
    updateApplicationStatus: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const applicationId = Number(req.params.id);
        try {


            const result = await applicationService.updateApplicationStatus(
                applicationId,
                req.body.status,
                req.user.userId
            )

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    createApplication: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {

            const body: CreateApplicationInput = req.body

            const result =
                await applicationService.createApplication(
                    req.body,
                    req.user.userId
                );

            res.status(201).json({
                success: true,
                data: result,
            });

            const user = await authService.findById(req.user.userId);
            const job = await jobService.getById(body.job_id);
            if (user && job) {
                const workerPath = path.resolve(
                    __dirname,
                    "../workers/email.worker.ts"
                );
                new Worker(workerPath, {
                    execArgv: ["-r", "ts-node/register"],
                    workerData: {
                        email: user.email,
                        fullName: user.full_name,
                        jobTitle: job.title,
                    },
                  });
            }
        } catch (error) {
            next(error);
        }
    },


}