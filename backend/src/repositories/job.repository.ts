

import { Prisma, Job } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const jobRepository = {

    create: (data: Prisma.JobCreateInput): Promise<Job> => {
        return prisma.job.create({ data });
    },

    findById: (id: number): Promise<Job | null> => {
        return prisma.job.findUnique({
            where: { id },
        });
    },

    findByEmployerId: (employerId: number): Promise<Job[]> => {
        return prisma.job.findMany({
            where: {
                employer_id: employerId,
            },
        });
    },

    findAllJobs: (): Promise<Job[]> => {
        return prisma.job.findMany();
    },

    findDuplicate: async (params: {
        title: string;
        company: string;
        employerId: number;
    }): Promise<Job | null> => {

        return prisma.job.findFirst({
            where: {
                title: params.title,
                company: params.company,
                employer_id: params.employerId,
            },
        });
    },

};