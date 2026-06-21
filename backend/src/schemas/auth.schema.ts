import { z } from "zod";
import { UserRole } from "../shared/enum";

export const registerUserSchema = z.object({
    email: z.email("Invalid email address"),

    full_name: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    role: z.enum(UserRole, {
        error: "Role must be ADMIN, EMPLOYER, or JOB_SEEKER",
    }),
});

export const loginUserSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export type LoginUserInput = z.infer<typeof loginUserSchema>;
