"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MyJobsJobseeker() {
  const pathname = usePathname();
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 h-40  md:h-50 ">
        <Link
          href="/job_seeker/my-jobs/applied-jobs"
          className={cn(
            "h-20! md:h-40!",
            buttonVariants({
              variant:
                pathname === "/job_seeker/my-jobs/applied-jobs"
                  ? "brand"
                  : "outline",
            })
          )}
        >
          <div className="text-center ">
            <h1 className="md:text-4xl text-2xl">13</h1>
            <span className="text-[10px] md:text-[15px]">Applied Jobs</span>
          </div>
        </Link>
        <Link
          href={"/job_seeker/my-jobs/accepted-jobs"}
          className={cn(
            "md:h-40! h-20!",
            buttonVariants({
              variant:
                pathname === `/job_seeker/my-jobs/accepted-jobs`
                  ? "brand"
                  : "outline",
            })
          )}
        >
          <div className="text-center">
            <h1 className="md:text-4xl text-2xl">4</h1>
            <span className="text-[10px] md:text-[15px]">Accepted Jobs</span>
          </div>
        </Link>
        <Link
          href={"/job_seeker/my-jobs/rejected-jobs"}
          className={cn(
            "md:h-40! h-20!",
            buttonVariants({
              variant:
                pathname === `/job_seeker/my-jobs/rejected-jobs`
                  ? "brand"
                  : "outline",
            })
          )}
        >
          <div className="text-center">
            <h1 className="md:text-4xl text-2xl">4</h1>
            <span className="text-[10px] md:text-[15px]">Rejected Jobs</span>
          </div>
        </Link>
        <Link
          href={"/job_seeker/my-jobs/pending-jobs"}
          className={cn(
            "md:h-40! h-20!",
            buttonVariants({
              variant:
                pathname === `/job_seeker/my-jobs/pending-jobs`
                  ? "brand"
                  : "outline",
            })
          )}
        >
          <div className="text-center">
            <h1 className="md:text-4xl text-2xl">5</h1>
            <span className="text-[10px] md:text-[15px]">Pending Jobs</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
