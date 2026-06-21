
import { AppError } from "../lib/AppError";
import { applicationRepository } from "../repositories/application.repository";
import { jobRepository } from "../repositories/job.repository";
import { CreateApplicationInput } from "../schemas/application.schema";
import { ApplicationStatus, JobStatus } from "../shared/enum";

export const applicationService = {
    findAllApplicationByUserId:async(userId:number) =>{
        console.log("[application.findAllApplicationByUserId] start", { userId });

        const applications = await applicationRepository.findAllApplicationByUserId(userId);

        console.log("[application.findAllApplicationByUserId ✅] success application count",  applications.length );

        return applications;

    },
    updateApplicationStatus: async (
        applicationId: number,
        status: ApplicationStatus,
        userId: number
      ) => {
        console.log("[application.updateApplicationStatus] start", {
          applicationId,
          status,
          userId,
        });
    
       
        const application =
          await applicationRepository.findApplicationById(applicationId);

          console.log("APPLICATION",application)

    
        // const target = applications.find((a) => a.id === applicationId);

    
        // if (!target) {
        //   throw new Error("APPLICATION_NOT_FOUND or NOT_AUTHORIZED");
        // }
    
       
        const updatedApplication = await applicationRepository.updateStatus(
          applicationId,
          status
        );
    
        console.log("[application.updateApplicationStatus ✅] success", {
          applicationId,
          status,
        });
    
        return updatedApplication;
      },

      createApplication: async (
        applicationData: CreateApplicationInput,
        userId: number
    ) => {

        console.log("[application.createApplication] start", {
            userId,
            jobId: applicationData.job_id,
        });

        // Verify job exists
        const job = await jobRepository.findById(
            applicationData.job_id
        );

        if (!job) {
            throw new AppError(
                404,
                "JOB_NOT_FOUND",
                "Job not found"
            );
        }

        // Verify job can accept applications
        if (job.status !== JobStatus.ACTIVE) {
            throw new AppError(
                400,
                "JOB_NOT_AVAILABLE",
                "This job is not accepting applications"
            );
        }

        // Prevent duplicate applications
        const existingApplication =
            await applicationRepository.findByUserAndJobId(
                userId,
                applicationData.job_id
            );

        if (existingApplication) {
            throw new AppError(
                409,
                "APPLICATION_ALREADY_EXISTS",
                "You have already applied for this job"
            );
        }

        const application =
            await applicationRepository.create({
                resume_url: applicationData.resume_url,
                cover_letter: applicationData.cover_letter,

                user: {
                    connect: {
                        id: userId,
                    },
                },

                job: {
                    connect: {
                        id: applicationData.job_id,
                    },
                },
            });

        console.log(
            "[application.createApplication ✅] success",
            {
                applicationId: application.id,
            }
        );

        return application;
    },
}