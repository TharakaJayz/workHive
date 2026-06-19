import { z } from "zod";
import { JobCategory, JobStatus, JobType } from "../shared/enum";

export const jobBaseSchema = z
    .object({
        title: z.string().trim().min(3, "Title must be at least 3 characters"),

        description: z
            .string()
            .trim()
            .min(20, "Description must be at least 20 characters"),

        company: z
            .string()
            .trim()
            .min(2, "Company name must be at least 2 characters"),

        location: z
            .string()
            .trim()
            .min(2, "Location must be at least 2 characters"),

        type: z.enum(JobType, {
            error: "Job type must be REMOTE, ONSITE, or HYBRID",
        }),

        category: z.enum(JobCategory, {
            error: "Category must be a valid job category",
        }),

        salary_min: z
            .number()
            .int()
            .positive("Minimum salary must be greater than 0"),

        salary_max: z
            .number()
            .int()
            .positive("Maximum salary must be greater than 0"),
    })

export const createJobSchema = jobBaseSchema.refine((data) => data.salary_max >= data.salary_min, {
    message:
        "Maximum salary must be greater than or equal to minimum salary",
    path: ["salary_max"],
});


export const updateJobSchema = jobBaseSchema
    .partial()
    .extend({
        status: z
            .enum(JobStatus, {
                error: "Invalid job status",
            })
            .optional(),
    })
    .refine((data) => {

        if (data.salary_min && data.salary_max) {
            return data.salary_max >= data.salary_min;
        }
        return true;
    }, {
        message: "Maximum salary must be greater than or equal to minimum salary",
        path: ["salary_max"],
    });

    export const getAllJobsSchema = z.object({
        location: z.string().trim().optional(),
    
        category: z
            .enum(JobCategory, {
                error: "Invalid job category",
            })
            .optional(),
    
        salary_min: z
            .string()
            .transform((val) => Number(val))
            .refine((val) => !Number.isNaN(val), {
                message: "salary_min must be a number",
            })
            .optional(),
    });
    
    export type GetAllJobsInput = z.infer<typeof getAllJobsSchema>;

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;

