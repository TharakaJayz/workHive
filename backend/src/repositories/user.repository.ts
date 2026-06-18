import { Prisma, User } from "../../generated/prisma/client"
import { prisma } from "../lib/prisma"

export const userRepository = {


    findByEmail: (email: string): Promise<User | null> => {
        return prisma.user.findUnique({ where: { email } })
    },


    findById: (id: number): Promise<User | null> => {
        return prisma.user.findUnique({ where: { id } })
    },

    create: (data: Prisma.UserCreateInput): Promise<User> => {
        return prisma.user.create({ data });
    },

    verifyEmail: (id: number): Promise<User> => {

        return prisma.user.update({
            where: { id },
            data: { email_verified: true },
        });
    }

}