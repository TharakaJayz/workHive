"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <div className="w-full">
      {!["/auth/login", "/auth/register"].includes(pathname) && <Navbar />}
      {/* Breadcrumb from shadeCN*/}
      {children}
    </div>
  );
}
