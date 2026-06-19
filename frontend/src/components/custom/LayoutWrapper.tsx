"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSession } from "next-auth/react";
import FullScreenLoader from "./FullScreenLoader";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { status } = useSession();
  const hideNavbar = ["/auth/login", "/auth/register"].includes(pathname);
  const segments = pathname.split("/").filter(Boolean);
  if (status === "loading") {
    return <FullScreenLoader />
  }
  return (
    <div className="w-full">
      {!hideNavbar && <Navbar />}
      {/* Breadcrumb */}
      {!hideNavbar && pathname !== "/" && (
        <div className="px-6 py-3 hidden">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>

              {segments.map((segment, index) => {
                const href =
                  "/" + segments.slice(0, index + 1).join("/");

                const isLast = index === segments.length - 1;

                return (
                  <div key={href} className="flex items-center">
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>
                          {segment}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href}>
                          {segment}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
      {children}
    </div>
  );
}
