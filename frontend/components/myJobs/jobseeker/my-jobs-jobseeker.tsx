"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Props {
  applied: number;
  accepted: number;
  rejected: number;
}

export function MyJobsJobseeker({ applied, accepted, rejected }: Props) {
  const pathname = usePathname();
  return (
    <div className="mb-5">
      <div className="grid grid-cols-3 gap-4 h-auto  md:h-auto ">
        <Link
          href="/job_seeker/my-jobs/applied-jobs"
          className={cn(
            "h-20! md:h-40!",
            buttonVariants({
              variant:
                pathname === "/job_seeker/my-jobs/applied-jobs" ? "brand" : (
                  "outline"
                ),
            }),
          )}
        >
          <div className="text-center ">
            <h1 className="md:text-4xl text-2xl">{applied}</h1>
            <span className="text-[10px] md:text-[15px]">Applied Jobs</span>
          </div>
        </Link>
        <Link
          href={"/job_seeker/my-jobs/accepted-jobs"}
          className={cn(
            "md:h-40! h-20!",
            buttonVariants({
              variant:
                pathname === `/job_seeker/my-jobs/accepted-jobs` ? "brand" : (
                  "outline"
                ),
            }),
          )}
        >
          <div className="text-center">
            <h1 className="md:text-4xl text-2xl">{accepted}</h1>
            <span className="text-[10px] md:text-[15px]">Accepted Jobs</span>
          </div>
        </Link>
        <Link
          href={"/job_seeker/my-jobs/rejected-jobs"}
          className={cn(
            "md:h-40! h-20!",
            buttonVariants({
              variant:
                pathname === `/job_seeker/my-jobs/rejected-jobs` ? "brand" : (
                  "outline"
                ),
            }),
          )}
        >
          <div className="text-center">
            <h1 className="md:text-4xl text-2xl">{rejected}</h1>
            <span className="text-[10px] md:text-[15px]">Rejected Jobs</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
