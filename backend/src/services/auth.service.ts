import { AppError } from "../lib/AppError";
import { signToken } from "../lib/jwt";
import { userRepository } from "../repositories/user.repository";
import { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema";
import bcrypt from "bcryptjs";

export const authService = {

    register: async (data: RegisterUserInput) => {

        console.log("[auth.register] start", {
            email: data.email,
            role: data.role,
        });

        const existing = await userRepository.findByEmail(data.email);

        if (existing) {
            console.warn("[auth.register ⛔️] email already in use", {
                email: data.email,
            });

            throw new AppError(
                409,
                "EMAIL_IN_USE",
                "An account with this email already exists"
            );
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await userRepository.create({
            ...data,
            password: passwordHash,
        });

        const token = signToken({
            userId: user.id,
            role: user.role,
        });

        const { password: _pw, ...safeUser } = user;

        console.log("[auth.register ✅] user created", {
            userId: user.id,
            email: user.email,
        });

        return { user: safeUser, token };
    },

    login: async (data: LoginUserInput) => {

        console.log("[auth.login] start", {
            email: data.email,
        });

        const INVALID = new AppError(
            401,
            "INVALID_CREDENTIALS",
            "Email or password is incorrect"
        );

        const user = await userRepository.findByEmail(data.email);

        if (!user) {
            console.warn("[auth.login ⛔️] invalid credentials", {
                email: data.email,
            });

            throw INVALID;
        }

        const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!passwordMatch) {
            console.warn("[auth.login ⛔️] invalid credentials", {
                email: data.email,
            });

            throw INVALID;
        }

        const token = signToken({
            userId: user.id,
            role: user.role,
        });

        const { password: _pw, ...safeUser } = user;

        console.log("[auth.login ✅] success", {
            userId: user.id,
            email: user.email,
        });

        return { user: safeUser, token };
    },
};