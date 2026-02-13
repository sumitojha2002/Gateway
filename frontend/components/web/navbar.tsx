"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { lilitaOne } from "@/app/ui/fonts";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { Bell, MessageCircle } from "lucide-react";
import { useAppSelector } from "@/hooks/hooks";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const unreadCount = useAppSelector(
    (state) => state.notifications.items.filter((n) => !n.is_read).length,
  );

  const MY_JOBS_ROUTE_MAP = {
    job_seeker: "/job_seeker/my-jobs/applied-jobs",
    employer: "/employer/my-jobs/post-jobs",
  } as const;

  const myJobsHref =
    session?.user?.role ? MY_JOBS_ROUTE_MAP[session.user.role] : "/";

  if (status === "loading") {
    return (
      <div className="drop-shadow-xl w-full filter drop-shadow-black-500/70 bg-white sticky top-0 z-50">
        <nav className="bg-[#FFFFFF] max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full py-5 flex items-center justify-between">
          <h1 className={`${lilitaOne.className} text-3xl text-[#4A70A9]`}>
            Gateway
          </h1>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 w-20 h-8 rounded-md"></div>
            <div className="animate-pulse bg-gray-200 w-20 h-8 rounded-md"></div>
            <div className="animate-pulse bg-gray-200 w-30 h-10 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 w-30 h-10 rounded-lg"></div>
          </div>
        </nav>
      </div>
    );
  }

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/explore-jobs", label: "Explore Jobs" },
  ];

  const authenticatedLinks = [
    { href: "/", label: "Home" },
    { href: "/explore-jobs", label: "Explore Jobs" },
    { href: myJobsHref, label: "My Jobs" },
  ];

  const linksToRender =
    status === "authenticated" ? authenticatedLinks : publicLinks;

  const userRole = session?.user?.role;

  return (
    <div className="drop-shadow-xl w-full filter drop-shadow-black-500/70 bg-white sticky top-0 z-50">
      <nav className="bg-[#FFFFFF] max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className={`${lilitaOne.className} text-3xl text-[#4A70A9]`}>
              Gateway
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center font-bold gap-7 text-black">
          {linksToRender.map((link) => {
            let isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            if (link.label === "My Jobs") {
              isActive =
                pathname.startsWith("/job_seeker/my-jobs") ||
                pathname.startsWith("/employer/my-jobs");
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  isActive && "text-[#4A70A9]",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Profile Link */}
          {status === "authenticated" && userRole && (
            <Link
              href={`/${userRole}/profile`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                (pathname === `/${userRole}/profile` ||
                  pathname.startsWith(`/${userRole}/security`)) &&
                  "text-[#4A70A9]",
              )}
            >
              Profile
            </Link>
          )}

          {/* Login Button */}
          {status !== "authenticated" && (
            <Link
              href="/login"
              className={buttonVariants({ variant: "brand" })}
            >
              LOGIN
            </Link>
          )}

          {/* Chat Icon */}
          {status === "authenticated" && userRole && (
            <Link
              href={`/${userRole}/chat`}
              className={cn(
                "p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer",
                pathname.startsWith(`/${userRole}/chat`) && "text-[#4A70A9]",
              )}
              aria-label="Chat"
            >
              <MessageCircle size={20} />
            </Link>
          )}

          {/* Notification Icon */}
          {status === "authenticated" && userRole === "job_seeker" && (
            <Link
              href={`/${userRole}/notification`}
              className={cn(
                "relative p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer",
                pathname.startsWith(`/${userRole}/notification`) &&
                  "text-[#4A70A9]",
              )}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>

        <MobileNav navLinks={linksToRender} />
      </nav>
    </div>
  );
}
