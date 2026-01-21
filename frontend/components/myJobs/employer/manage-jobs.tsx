import { Job, ManageJobsCards } from "./card/manage-job-cards";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";

interface ManageJobsResponse {
  data: Job[];
}

export async function ManageJobs() {
  const response = await fetcher<ManageJobsResponse>(URLS.GET_JOB_FOR_EMP);
  const jobsData = response.data;

  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>
      </div>

      <ManageJobsCards jobList={jobsData} />
    </div>
  );
}
