import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ApiSuccess, UserLoginResponse } from "@/lib/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const responseBody: ApiSuccess<UserLoginResponse> = await res.json();

        if (res.ok && responseBody?.success && responseBody?.data) {
          return {
            id: responseBody.data.user.id.toString(),
            full_name: responseBody.data.user.full_name,
            email: responseBody.data.user.email,
            email_verified: responseBody.data.user.email_verified,
            role: responseBody.data.user.role,
            token: responseBody.data.token,
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = +user.id;
        token.full_name = user.full_name;
        token.email = user.email ?? "";
        token.email_verified = user.email_verified;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.full_name = token.full_name;
        session.user.email = token.email;
        session.user.email_verified = token.email_verified;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },
};