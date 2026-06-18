import { AppError } from "../lib/AppError";
import { signToken } from "../lib/jwt";
import { userRepository } from "../repositories/user.repository"
import { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema"
import bcrypt from 'bcryptjs'

export const authService = {

    register: async (input: RegisterUserInput) => {
        console.log("[auth.register] start", { email: input.email, role: input.role });
        const existing = await userRepository.findByEmail(input.email);
        if (existing) {
            console.warn("[auth.register ⛔️] email already in use ", { email: input.email });
            throw new AppError(409, 'EMAIL_IN_USE', 'An account with this email already exists');
        }

        const passwordHash = await bcrypt.hash(input.password, 12);
        const user = await userRepository.create({
            ...input, password: passwordHash
        })
        const token = signToken({ userId: user.id, role: user.role });
        const { password: _pw, ...safeUser } = user
        console.log("[auth.register ✅] user created ", { userId: user.id, email: user.email });

        return { user: safeUser, token };
    },

    login: async (input: LoginUserInput) => {
        console.log("[auth.login] start", { email: input.email });
        const INVALID = new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect')

        const user = await userRepository.findByEmail(input.email)
        if (!user) {
            console.warn("[auth.login ⛔️] invalid credentials ", { email: input.email });
            throw INVALID
        }
        const passwordMatch = await bcrypt.compare(input.password, user.password)
        if (!passwordMatch) {
            console.warn("[auth.login ⛔️] invalid credentials ", { email: input.email });
            throw INVALID
        }
        const token = signToken({ userId: user.id, role: user.role });
        const { password: _pw, ...safeUser } = user;
        console.log("[auth.login ✅] success ", { userId: user.id, email: user.email });

        return { user: safeUser, token }
    },
}