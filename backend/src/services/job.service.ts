import { AppError } from "../lib/AppError";
import { jobRepository } from "../repositories/job.repository";
import { userRepository } from "../repositories/user.repository";
import { CreateJobInput } from "../schemas/job.schema";

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

            throw new AppError(
                404,
                "USER_NOT_FOUND",
                "Employer not found"
            );
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

};