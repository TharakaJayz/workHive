import { AppError } from "../lib/AppError";
import { applicationRepository } from "../repositories/application.repository";
import { jobRepository } from "../repositories/job.repository";
import { userRepository } from "../repositories/user.repository";
import { CreateJobInput, GetAllJobsInput, UpdateJobInput } from "../schemas/job.schema";

export const jobService = {
    create: async (data: CreateJobInput, employerId: number) => {
        console.log("[job.create] start", {
            employerId,
            title: data.title,
        });

        //  Check employer exists
        const employer = await userRepository.findById(employerId);

        if (!employer) {
            console.warn("[job.create ⛔️] employer not found", { employerId });

            throw new AppError(404, "USER_NOT_FOUND", "Employer not found");
        }

        //  Check role
        if (employer.role !== "EMPLOYER") {
            console.warn("[job.create ⛔️] unauthorized role", {
                employerId,
                role: employer.role,
            });

            throw new AppError(
                403,
                "FORBIDDEN",
                "Only employers can create jobs"
            );
        }

        //  Salary validation (range)
        if (data.salary_min > data.salary_max) {
            console.warn("[job.create ⛔️] invalid salary range", {
                salary_min: data.salary_min,
                salary_max: data.salary_max,
            });

            throw new AppError(
                400,
                "INVALID_SALARY_RANGE",
                "Minimum salary cannot be greater than maximum salary"
            );
        }

        //  Salary validation (negative check)
        if (data.salary_min < 0 || data.salary_max < 0) {
            console.warn("[job.create ⛔️] negative salary detected", {
                salary_min: data.salary_min,
                salary_max: data.salary_max,
            });

            throw new AppError(
                400,
                "INVALID_SALARY",
                "Salary must be positive values"
            );
        }

        //  Duplicate job check
        const existing = await jobRepository.findDuplicate({
            title: data.title,
            company: data.company,
            employerId,
        });

        if (existing) {
            console.warn("[job.create ⛔️] duplicate job detected", {
                employerId,
                title: data.title,
                company: data.company,
            });

            throw new AppError(
                409,
                "JOB_ALREADY_EXISTS",
                "You already posted a similar job"
            );
        }

        //  Create job
        const job = await jobRepository.create({
            ...data,
            user: {
                connect: {
                    id: employerId,
                },
            },
        });

        console.log("[job.create ✅] job created", {
            jobId: job.id,
            employerId,
        });

        return job;
    },


    update: async (
        jobId: number,
        data: UpdateJobInput,
        userId: number
    ) => {

        console.log("[job.update] start", {
            jobId,
            userId,
        });

        //  Check job exists
        const job = await jobRepository.findById(jobId);

        if (!job) {
            console.warn("[job.update ⛔️] job not found", { jobId });

            throw new AppError(
                404,
                "JOB_NOT_FOUND",
                "Job not found"
            );
        }

        //  Check employer exists
        const user = await userRepository.findById(userId);

        if (!user) {
            console.warn("[job.update ⛔️] user not found", { userId });

            throw new AppError(
                404,
                "USER_NOT_FOUND",
                "User not found"
            );
        }

        //  Role check
        if (user.role !== "EMPLOYER") {
            console.warn("[job.update ⛔️] unauthorized role", {
                userId,
                role: user.role,
            });

            throw new AppError(
                403,
                "FORBIDDEN",
                "Only employers can update jobs"
            );
        }

        //  Ownership check
        if (job.employer_id !== userId) {
            console.warn("[job.update ⛔️] not owner", {
                userId,
                jobOwner: job.employer_id,
            });

            throw new AppError(
                403,
                "FORBIDDEN",
                "You can only update your own jobs"
            );
        }

        //  Prevent updating deleted jobs
        if (job.status === "DELETED" || job.status === "FLAGGED") {
            console.warn("[job.update ⛔️] deleted or flagged job update attempt", {
                jobId,
            });

            throw new AppError(
                400,
                "INVALID_OPERATION",
                "Cannot update deleted or flagged job"
            );
        }

        // Salary validation (if provided)
        if (data.salary_min && data.salary_max) {
            if (data.salary_min > data.salary_max) {
                console.warn("[job.update ⛔️] invalid salary range", {
                    salary_min: data.salary_min,
                    salary_max: data.salary_max,
                });

                throw new AppError(
                    400,
                    "INVALID_SALARY_RANGE",
                    "Invalid salary range"
                );
            }
        }


        const updatedJob = await jobRepository.update(jobId, {
            ...data,
        });

        console.log("[job.update ✅] success", {
            jobId,
        });

        return updatedJob;
    },

    // get job by id 
    // admin and related owner can see flagged jobs
    getById: async (jobId: number, userId?: number | null, role?: string | null) => {

        console.log("[job.getById] start", { jobId });


        const job = await jobRepository.findById(jobId);

        if (!job) {
            console.warn("[job.getById ⛔️] job not found", { jobId });

            throw new AppError(
                404,
                "JOB_NOT_FOUND",
                "Job not found"
            );
        }

        const isAdmin = role === "ADMIN";
        const isOwner = job.employer_id === userId;

        const isFlagged = job.status === "FLAGGED";


        // flagged job data only available for ADMIN or OWNER
        if (isFlagged && !(isAdmin || isOwner)) {
            console.warn("[job.getById ⛔️] flagged job access denied", {
                jobId,
                role,
                userId,
            });

            throw new AppError(
                403,
                "FORBIDDEN",
                "This job is restricted"
            );
        }

        console.log("[job.getById ✅] success", { jobId });
        return job;

    },

    getAllJobs: async (filters: GetAllJobsInput, userId?: number | null, role?: string | null) => {
        console.log("[job.getAllJobs] start", filters);
        const isAdmin = role === "ADMIN";
        const jobs = await jobRepository.findAllJobs(filters);
        // const filteredJobs = jobs.filter((job) => {

        //     const isOwner = job.employer_id === userId;

        //     const isFlagged = job.status === "FLAGGED";


        //     // FLAGGED jobs only visible to ADMIN or OWNER
        //     if (isFlagged && !(isAdmin || isOwner)) {
        //         return false;
        //     }

        //     return true;
        // });

        // console.log("[job.getAllJobs ✅] success", {
        //     count: filteredJobs.length,
        // });

        return jobs;
    },

    getAllJobsByEmployerId: async (employerId: number, tokenUserId: number) => {
        console.log("[job.getAllJobsByEmployerId] start employerId ", { employerId });
        // Authorization check: ensure the authenticated user can only access their own employer resources
        if (employerId !== tokenUserId) {
            throw new AppError(
                403,
                "FORBIDDEN",
                "You cannot access this resource"
            );
        }
        const jobs = await jobRepository.findByEmployerId(employerId);
        console.log("[job.getAllJobsByEmployerId ✅] success", {
            count: jobs.length,
        });
        return jobs;
    },

    getApplicantsByJobId: async (
        jobId: number,
        userId: number,
        role?: string | null
    ) => {
        console.log("[job.getApplicantsByJobId] start", {
            jobId,
            userId,
        });
    
       
        const job = await jobRepository.findById(jobId);
    
        if (!job) {
            throw new AppError(404, "JOB_NOT_FOUND", "Job not found");
        }
    
        
        const user = await userRepository.findById(userId);
    
        if (!user) {
            throw new AppError(404, "USER_NOT_FOUND", "User not found");
        }
    
        const isAdmin = role === "ADMIN";
        const isOwner = job.employer_id === userId;
    
        
        if (!isAdmin && !isOwner) {
            throw new AppError(
                403,
                "FORBIDDEN",
                "You can only view applicants of your own jobs"
            );
        }
    
      
        if (job.status === "DELETED") {
            throw new AppError(
                400,
                "INVALID_OPERATION",
                "Cannot access deleted job"
            );
        }
    
       
        const applications = await applicationRepository.findApplicantsByJobId(jobId);
    
        console.log("[job.getApplicantsByJobId ✅] success", {
            jobId,
            count: applications.length,
        });
    
        return applications;
    },


};
