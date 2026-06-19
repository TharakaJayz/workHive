import { Prisma, Job } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { JobCategory } from "../shared/enum";

export const jobRepository = {
    create: (data: Prisma.JobCreateInput): Promise<Job> => {
        return prisma.job.create({ data });
    },

    findById: (id: number): Promise<Job | null> => {
        return prisma.job.findUnique({
            where: {
                id, status: {
                    not: "DELETED"
                }
            },
        });
    },

    findByEmployerId: (employerId: number): Promise<Job[]> => {
        return prisma.job.findMany({
            where: {
                employer_id: employerId, status: {
                    not: "DELETED"
                }
            },
        });
    },

    findAllJobs: (filters: {
        location?: string;
        category?: JobCategory;
        salary_min?: number;
    }): Promise<Job[]> => {

        return prisma.job.findMany({
            where: {

                NOT: {
                    status: "DELETED",
                },

                ...(filters.location && {
                    location: {
                        contains: filters.location,
                        mode: "insensitive",
                    },
                }),

                ...(filters.category && {
                    category: filters.category,
                }),

                ...(filters.salary_min && {
                    salary_min: {
                        gte: filters.salary_min,
                    },
                }),
            },
        });
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
                employer_id: params.employerId, status: {
                    not: "DELETED"
                }
            },
        });
    },
    update: (
        id: number,
        data: Prisma.JobUpdateInput
    ): Promise<Job> => {
        return prisma.job.update({
            where: { id },
            data,
        });
    },
};
