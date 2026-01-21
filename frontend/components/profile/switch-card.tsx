"use client";

import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
export function SwitchCard() {
  const pathname = usePathname();
  const session = useSession();
  console.log("Session data:", session.data);
  const role = session.data?.user.role;
  return (
    <div
      className={
        "md:border md:border-[#4A70A9] rounded-md overflow-hidden md:h-40 grid-cols-3 mb-10 grid md:flex md:flex-col"
      }
    >
      <div className="md:h-20 h-10 ">
        <Link
          href={`/${session.data?.user?.role}/profile`}
          className={cn(
            "md:w-50 w-35  flex items-center justify-center",
            buttonVariants({
              variant:
                pathname === `/${session.data?.user?.role}/profile`
                  ? "brand"
                  : "outline",
            })
          )}
          style={{ height: "100%" }}
        >
          Edit Profile
        </Link>
      </div>
      <div className="md:h-20 h-10 ">
        <Link
          href={`/${session.data?.user?.role}/security`}
          className={cn(
            "md:w-50 w-35  flex items-center justify-center",
            buttonVariants({
              variant:
                pathname === `/${session.data?.user?.role}/security`
                  ? "brand"
                  : "outline",
            })
          )}
          style={{ height: "100%" }}
        >
          Security
        </Link>
      </div>
      <div className="md:h-20 h-10 ">
        <Button
          variant={"outline"}
          className="h-full w-full text-red-600 hover:text-red-500"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          LogOut
        </Button>
      </div>
    </div>
  );
}
