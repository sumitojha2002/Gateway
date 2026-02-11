import { MyJobsJobseeker } from "@/components/myJobs/jobseeker/my-jobs-jobseeker";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";
import { ReactNode } from "react";

interface Res {
  data: [];
}

// Helper function to build URL with status
const getApplicationsUrl = (status: string) => {
  const params = new URLSearchParams({ application_status: status });
  return `${URLS.GET_APP_LIST}?${params.toString()}`;
};

export default async function Layout({ children }: { children: ReactNode }) {
  // Fetch all statuses in parallel
  const [appliedRes, acceptedRes, rejectedRes] = await Promise.all([
    fetcher<Res>(getApplicationsUrl("applied")),
    fetcher<Res>(getApplicationsUrl("selected")),
    fetcher<Res>(getApplicationsUrl("rejected")),
  ]);

  const counts = {
    applied: appliedRes.data.length,
    accepted: acceptedRes.data.length,
    rejected: rejectedRes.data.length,
  };

  return (
    <div>
      <MyJobsJobseeker {...counts} />

      <div className="w-full">{children}</div>
    </div>
  );
}
