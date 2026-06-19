// src/components/AuthSync.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setCredentials, clearCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

export default function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setCredentials({
            id: session.user.id,
            full_name: session.user.full_name,
            email: session.user.email,
            email_verified: session.user.email_verified,
            role: session.user.role,
            token: session.user.accessToken,
        }),
      );
    } else if (status === "unauthenticated") {
      dispatch(clearCredentials());
    }
  }, [session, status, dispatch]);

  return <>{children}</>;
}
