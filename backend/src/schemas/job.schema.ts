import { z } from "zod";
import { JobCategory, JobType } from "../shared/enum";

export const createJobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters"),

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
.refine(
    (data) => data.salary_max >= data.salary_min,
    {
        message: "Maximum salary must be greater than or equal to minimum salary",
        path: ["salary_max"],
    }
);

export type CreateJobInput = z.infer<typeof createJobSchema>;