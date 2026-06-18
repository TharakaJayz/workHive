// src/types/next-auth.d.ts
import { UserRole } from "@/shared/enum";
import DefaultSession, { DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: UserRole;
    token: string;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    accessToken: string;
  }
}