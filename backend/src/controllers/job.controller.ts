import { NextFunction, Request, Response } from "express";
import { jobService } from "../services/job.service";
import { AppError } from "../lib/AppError";
import { verifyToken } from "../lib/jwt";


export const jobController = {
    create: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await jobService.create(req.body, req.user.userId);
            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.id);

            if (!req.params.id || Number.isNaN(jobId)) {
                console.warn("[job.update ⛔️] invalid jobId", {
                    param: req.params.id,
                });

                throw new AppError(
                    400,
                    "INVALID_JOB_ID",
                    "Job ID is required and must be a number"
                );
            }

            const result = await jobService.update(
                jobId,
                req.body,
                req.user.userId
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const jobId = Number(req.params.id);

            if (!req.params.id || Number.isNaN(jobId)) {
                console.warn("[job.getById ⛔️] invalid jobId", {
                    param: req.params.id,
                });

                throw new AppError(
                    400,
                    "INVALID_JOB_ID",
                    "Job ID must be a valid number"
                );
            }
            
            // check  req is authenticated to allow ADMINS and OWNER can get flagged job details
            const authHeader = req.headers.authorization;
            let userRole:string | null= null ;
            let userId:number | null = null ;
            if(authHeader?.startsWith("Bearer ")){
                const token = authHeader.split(" ")[1];
                const data =  verifyToken(token);
                userRole = data.role;
                userId = data.userId;
            }

            const result = await jobService.getById(
                jobId,
                userId,
                userRole
            );

            res.status(200).json({
                success: true,
                data: result,
            });

        } catch (error) {
            next(error);
        }
    },

    getAllJobs: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            let userRole:string | null= null ;
            let userId:number | null = null ;
            if(authHeader?.startsWith("Bearer ")){
                const token = authHeader.split(" ")[1];
                const data =  verifyToken(token);
                userRole = data.role;
                userId = data.userId;
            }

            const result = await jobService.getAllJobs(
                req.query,
                userId,
                userRole
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