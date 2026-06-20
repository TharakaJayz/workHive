import { Application } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

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
    }
}