"use client";

import { buttonVariants } from "../../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SwitchMyJobsEmployer() {
  const pathname = usePathname();
  return (
    <div
      className={
        "md:border md:border-[#4A70A9] rounded-md overflow-hidden md:h-60 grid-cols-4 mb-10 grid md:flex md:flex-col gap-1 md:gap-0"
      }
    >
      <div className="md:h-30 h-10 ">
        <Link
          href={`/employer/my-jobs/post-jobs`}
          className={cn(
            "md:w-50 w-25 flex items-center justify-center",
            buttonVariants({
              variant:
                pathname === `/employer/my-jobs/post-jobs`
                  ? "brand"
                  : "outline",
            })
          )}
          style={{ height: "100%" }}
        >
          Post Jobs
        </Link>
      </div>
      <div className="md:h-30 h-10 ">
        <Link
          href={`/employer/my-jobs/manage`}
          className={cn(
            "md:w-50 w-25  flex items-center justify-center",
            buttonVariants({
              variant:
                pathname === `/employer/my-jobs/manage` ||
                pathname.startsWith(`/employer/my-jobs/manage/`)
                  ? "brand"
                  : "outline",
            })
          )}
          style={{ height: "100%" }}
        >
          Manage Jobs
        </Link>
      </div>
      <div className="md:h-30 h-10 ">
        <Link
          href={`/employer/my-jobs/history`}
          className={cn(
            "md:w-50 w-25  flex items-center justify-center",
            buttonVariants({
              variant:
                pathname === `/employer/my-jobs/history` ? "brand" : "outline",
            })
          )}
          style={{ height: "100%" }}
        >
          History
        </Link>
      </div>
      <div className="md:h-30 h-10 ">
        <Link
          href={`/employer/my-jobs/draft`}
          className={cn(
            "md:w-50 w-25  flex items-center justify-center",
            buttonVariants({
              variant:
                pathname === `/employer/my-jobs/draft` ||
                pathname.startsWith(`/employer/my-jobs/draft/`)
                  ? "brand"
                  : "outline",
            })
          )}
          style={{ height: "100%" }}
        >
          Draft
        </Link>
      </div>
    </div>
  );
}
