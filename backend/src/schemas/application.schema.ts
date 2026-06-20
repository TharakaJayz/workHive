import { z } from "zod";
import { ApplicationStatus } from "../shared/enum";

export const createApplicationSchema = z.object({
    job_id: z
        .number()
        .int()
        .positive("Job ID must be a valid number"),

    resume_url: z
        .string("Resume url must be a string")
    ,

    cover_letter: z
        .string()
        .trim()
        .min(10, "Cover letter must be at least 10 characters")
        .optional(),
});


export type CreateApplicationInput = z.infer<typeof createApplicationSchema>

export const updateApplicationSchema = z.object({
    status: z.enum(ApplicationStatus, {
      error: "Status must be PENDING, ACCEPTED, or REJECTED",
    }),
  });
  
  export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;