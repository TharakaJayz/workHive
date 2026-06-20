import { Application} from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { ApplicationStatus } from "../shared/enum";

export const applicationRepository = {

    findAllApplicationByUserId: (userId: number): Promise<Application[]> => {
        return prisma.application.findMany({
            where: {
                user_id: userId
            },
            include:{
                job:true
            }
        })
    },
    findApplicantsByJobId: (jobId: number) => {
        return prisma.application.findMany({
            where: {
                job_id: jobId,
            },
            include: {
                user: true, 
            },
            orderBy: {
                date_applied: "desc",
            },
        });
    },
    findApplicationById: (id: number) => {
        return prisma.application.findUnique({
            where: {
                id:id
            },
            include: {
                user: true, 
            }
        });
    },

    updateStatus: (
        applicationId: number,
        status:ApplicationStatus
      ): Promise<Application> => {
        return prisma.application.update({
          where: {
            id: applicationId,
          },
          data: {
            status,
          },
        });
      },
}