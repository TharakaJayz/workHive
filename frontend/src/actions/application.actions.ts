"use server";

import  prisma  from "@/lib/prisma";
import { createApplicationSchema } from "@/lib/validations/application";
import { ApplicationStatus } from "@/shared/enum";

export async function createJobApplication(payload: any, userId: number) {
  try {
    
    const {job_id , ...validatedData} = createApplicationSchema.parse(payload);
    const newApplication = await prisma.application.create({
      data: {
        job_id: job_id,
        resume_url: validatedData.resume_url,
        cover_letter: validatedData.cover_letter || null,
        user_id: userId, 
        status: ApplicationStatus.PENDING,
      },
    });

    return { success: true, data: newApplication };
  } catch (error: any) {
    console.error("DB Write Error:", error);
    return { success: false, error: error.message || "Failed to submit application." };
  }
}