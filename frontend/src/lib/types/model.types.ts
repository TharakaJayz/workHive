import { UserRole } from "@/shared/enum";

export interface User {
    email: string;
    full_name: string;
    role: UserRole;
    id: number;
    email_verified: boolean;
};

