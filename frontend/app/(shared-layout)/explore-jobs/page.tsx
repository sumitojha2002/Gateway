import ExploreJobSearch from "@/components/jobs/explore-jobs";
import { JobsCard } from "@/components/jobs/jobs-card";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";

interface ExplorePageProps {
  searchParams?: Record<string, string | undefined>;
}

export interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  job_type?: string;
  work_mode?: string;
  company_log: string;
  min_exp?: string;
  max_exp?: string;
  experience_level: string;
  salary_range: string;
  [key: string]: any;
}

interface JobsResponse {
  data: Job[];
  json: Function;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const queryObj: Record<string, string> = {};

  if (params.job_type) queryObj.job_type = params.job_type;
  if (params.work_mode) queryObj.work_mode = params.work_mode;
  if (params.title) queryObj.title = params.title;
  if (params.location) queryObj.location = params.location;
  if (params.min_exp) queryObj.min_exp = params.min_exp;
  if (params.max_exp) queryObj.max_exp = params.max_exp;

  const queryString = Object.keys(queryObj).length
    ? `?${new URLSearchParams(queryObj).toString()}`
    : "";

  try {
    const res = await fetch(`${URLS.GET_JOB_LIST}${queryString}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const result: JobsResponse = await res.json();
    return (
      <div className="container mx-auto px-4">
        <ExploreJobSearch jobs={result.data} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4">
        <ExploreJobSearch jobs={[]} />
      </div>
    );
  }
}
