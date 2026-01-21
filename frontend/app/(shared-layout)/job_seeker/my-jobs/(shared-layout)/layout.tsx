import { MyJobsJobseeker } from "@/components/myJobs/jobseeker/my-jobs-jobseeker";
import { SwitchMyJobsJobSeeker } from "@/components/myJobs/jobseeker/switch-my-jobs-jobseeker";
import { SwitchCard } from "@/components/profile/switch-card";
import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <MyJobsJobseeker />

      <div className=" w-full px-4 md:px-6 lg:px-8 ">{children}</div>
    </div>
  );
}
