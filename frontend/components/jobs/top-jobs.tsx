import fetcher from "@/helper/fetcher";
import { JobsCard } from "./jobs-card";
import { URLS } from "@/constants";

export default async function TopJobs() {
  return (
    <div className="flex flex-col justify-center ">
      <div className="flex w-full justify-start mt-4 mb-10">
        <h1 className="text-[20px] md:text-[30px]">Top Jobs</h1>
      </div>
      <div className="grid sm:grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <JobsCard job={[]} />
      </div>
    </div>
  );
}
