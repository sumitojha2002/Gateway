"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, MenuIcon, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { useAppSelector } from "@/hooks/hooks";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useAppSelector(
    (state) => state.notifications.items.filter((n) => !n.is_read).length,
  );

  const userRole = session?.user?.role;
  const isAuthenticated = status === "authenticated";

  const isActivePath = (path: string) => pathname === path;
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {/* Show a dot on the hamburger itself if there are unread notifications */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="relative"
          >
            <MenuIcon className="h-6 w-6 text-black" />
            {isAuthenticated &&
              userRole === "job_seeker" &&
              unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-75 sm:w-100 p-10">
          <SheetHeader>
            <SheetTitle className="font-bold text-[25px]">
              Navigation
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-2 pt-3">
            {/* Main Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start text-lg pointer-events-auto cursor-pointer",
                  isActivePath(link.href) && "text-[#4A70A9] font-bold",
                )}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            {/* Profile Link */}
            {isAuthenticated && userRole && (
              <Link
                href={`/${userRole}/profile`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start text-lg pointer-events-auto cursor-pointer",
                  isActivePath(`/${userRole}/profile`) &&
                    "text-[#4A70A9] font-bold",
                )}
                onClick={closeMenu}
              >
                Profile
              </Link>
            )}

            {/* Login Button */}
            {!isAuthenticated && (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "brand" }),
                  "w-full pointer-events-auto cursor-pointer",
                )}
                onClick={closeMenu}
              >
                LOGIN
              </Link>
            )}

            {/* Chat Link */}
            {isAuthenticated && userRole && (
              <Link
                href={`/${userRole}/chat`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start text-lg pointer-events-auto cursor-pointer",
                  isActivePath(`/${userRole}/chat`) &&
                    "text-[#4A70A9] font-bold",
                )}
                onClick={closeMenu}
              >
                <MessageCircle size={18} className="mr-2" />
                Chat
              </Link>
            )}

            {/* Notification Link */}
            {isAuthenticated && userRole === "job_seeker" && (
              <Link
                href={`/${userRole}/notification`}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start text-lg pointer-events-auto cursor-pointer",
                  isActivePath(`/${userRole}/notification`) &&
                    "text-[#4A70A9] font-bold",
                )}
                onClick={closeMenu}
              >
                <span className="relative mr-2">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>
                Notifications
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
