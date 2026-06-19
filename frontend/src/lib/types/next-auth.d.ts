// src/types/next-auth.d.ts
import { UserRole } from "@/shared/enum";
import DefaultSession, { DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: UserRole;
    token: string;
    full_name: string;
    email_verified: boolean;
  }

  interface Session {
    user:{
      id: number;
      full_name: string;
      email: string;
      email_verified: boolean;
      role: UserRole;
      accessToken: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    full_name: string;
    email: string;
    email_verified: boolean;
    role: UserRole;
    accessToken: string;
  }
}