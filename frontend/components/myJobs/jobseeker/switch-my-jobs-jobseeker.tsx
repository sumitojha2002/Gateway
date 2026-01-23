"use client";

import { buttonVariants } from "../../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SwitchMyJobsJobSeeker() {
  const pathname = usePathname();

  const myJobsPaths = [
    "/job_seeker/my-jobs/applied-jobs",
    "/job_seeker/my-jobs/accepted-jobs",
    "/job_seeker/my-jobs/rejected-jobs",
    "/job_seeker/my-jobs/pending-jobs",
  ];
  const isMyJobsActive = myJobsPaths.some((path) => pathname.startsWith(path));
  const isBookmarksActive = pathname === "/job_seeker/my-jobs/bookmarks";

  return (
    <div
      className={
        "md:border md:border-[#4A70A9]  overflow-hidden md:h-40 grid-cols-2 mb-10 grid md:flex md:flex-col gap-1 md:gap-0"
      }
    >
      <div className="md:h-20 h-10 ">
        <Link
          href={`/job_seeker/my-jobs/applied-jobs`}
          className={cn(
            "md:w-50 w-35  flex items-center justify-center rounded-none!",
            buttonVariants({
              variant: isMyJobsActive ? "brand" : "outline",
            }),
          )}
          style={{ height: "100%" }}
        >
          My Jobs
        </Link>
      </div>
      <div className="md:h-20 h-10 ">
        <Link
          href={`/job_seeker/my-jobs/bookmarks`}
          className={cn(
            "md:w-50 w-35  flex items-center justify-center rounded-none!",
            buttonVariants({
              variant: isBookmarksActive ? "brand" : "outline",
            }),
          )}
          style={{ height: "100%" }}
        >
          Bookmarks
        </Link>
      </div>
    </div>
  );
}
