"use client";

import React from "react"; // Need to import React explicitly for useState
import Link from "next/link";
import { MenuIcon } from "lucide-react";
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
  // State to control if the mobile menu is open
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    // This wrapper is only visible on small screens (hidden md:hidden)
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {/* Hamburger Icon Button */}
          <Button variant="ghost" size="icon" aria-label="Toggle Menu">
            <MenuIcon className="h-6 w-6 text-black" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-75 sm:w-100 p-10">
          <SheetHeader>
            <SheetTitle className="font-bold text-[25px]">
              Navigation
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col space-y-2 pt-3">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-lg",
                    isActive && "text-[#4A70A9] font-bold"
                  )}
                  onClick={() => setIsOpen(false)} // Close menu on link click
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Authentication/Profile Button */}
            {status === "authenticated" ? (
              (() => {
                const profilePath = `/${session?.user?.role}/profile`;
                const isActive = pathname === profilePath;
                return (
                  <Link
                    href={profilePath}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start text-lg",
                      isActive && "text-[#4A70A9] font-bold"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                );
              })()
            ) : (
              <Link
                href="/login"
                className={buttonVariants({ variant: "brand" })}
              >
                LOGIN
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
