import { SwitchMyJobsEmployer } from "@/components/myJobs/employer/switch-my-jobs-employer";
import { SwitchMyJobsJobSeeker } from "@/components/myJobs/jobseeker/switch-my-jobs-jobseeker";
import { SwitchCard } from "@/components/profile/switch-card";
import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex mt-8 mb-7 flex-col md:flex-row">
      <div className="flex justify-center">
        <SwitchMyJobsEmployer />
      </div>
      <div className=" w-full px-4 md:px-6 lg:px-8 ">{children}</div>
    </div>
  );
}
