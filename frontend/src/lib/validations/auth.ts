import { UserRole } from "@/shared/enum";
import { z } from "zod";


export const registerUserSchema = z
    .object({
        email: z.email("Invalid email address"),

        full_name: z
            .string()
            .trim()
            .min(4, "Full name must be at least 4 characters"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),

        role: z.enum(UserRole, {
            error: "Role must be ADMIN, EMPLOYER, or JOB_SEEKER",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginUserSchema = z.object({
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
})


export type RegisterFormData = z.infer<typeof registerUserSchema>;
export type LoginFormData = z.infer<typeof loginUserSchema>
