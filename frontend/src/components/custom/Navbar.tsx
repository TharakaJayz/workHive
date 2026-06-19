"use client";

import { UserRole } from "@/shared/enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavLink = {
  label: string;
  href: string;
};
type NavLinks = {
  [key in UserRole]?: NavLink[];
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const authUserData = useAppSelector((state) => state.auth);
  console.log("auth data", authUserData);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstName = authUserData?.user?.full_name?.split(" ")[0] || "User";
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
    });
  };

  const NAV_LINKS: NavLinks = {
    ADMIN: [
      { href: "/", label: "Home" },
      { label: "Job List", href: "/admin" },
    ],
    EMPLOYER: [
      { href: "/", label: "Home" },
      { href: "/employer/post", label: "New Job" },
      { href: "/employer/jobs", label: "My Jobs" },
    ],
    JOB_SEEKER: [
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  };

  const links =
    (authUserData.user ? NAV_LINKS[authUserData.user.role] : []) || [];

  return (
    <div className="flex  justify-between items-center px-5 py-5 shadow">
      <div className="sm:flex-5 flex-1 flex  gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`cursor-pointer ${link.href == pathname ? "font-semibold text-primary" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div
        className="sm:flex-2 flex-1 flex justify-end gap-3"
        ref={dropdownRef}
      >
        {authUserData.user ? (
          <>
            <span
              onClick={() => setOpen(!open)}
              className="text-xl font-semibold capitalize cursor-pointer select-none"
            >
              {firstName}
            </span>

            <div
              className={`absolute   right-0 top-12 mt-2 w-32 bg-white rounded-md shadow-md z-50 ${open ? "" : "hidden"}`}
            >
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                Log out
              </button>
            </div>
          </>
        ) : (
          <button
            className="rounded-md font-medium transition text-background bg-primary hover:bg-primaryHover px-3 py-1"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
