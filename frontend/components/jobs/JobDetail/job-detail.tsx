import { JobTitle } from "./job-title";
import { ExpObject, JobSummary } from "./job-summary";
import { JobDesc } from "./job-desc";
import { JobDetailCard } from "./job-detail-card";
import { LeftNavButton } from "./button/left-nav";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


interface JobPageProps {
  jobId: number | string;
}

interface Skills {
  id: number | string;
  name: string;
}

interface ResponseData {
  data: {
    is_bookmarked: string;
    id: number | string;
    title: string;
    email: string;
    company_name: string;
    company_logo: string;
    skills: Skills[];
    years_of_experience: ExpObject;
    description: string;
    salary_range: string;
    job_type: string;
    work_mode: string;
    location: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
    company_bio: string;
  };
}

export async function JobDetail({ jobId }: JobPageProps) {
  const session = await getServerSession(authOptions);
  const token = session?.user.accessToken;
  const res = await fetcher<ResponseData>(URLS.GET_JOB_BY_ID(jobId), {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const { data } = res;
  console.log(data);
  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="md:w-3/4 mt-10 mb-10 flex flex-col">
        <div className="mb-5">
          <LeftNavButton />
        </div>
        <div>
          <JobTitle
            title={data.title}
            expireDate={data.expires_at}
            job_id={data.id}
            bookmarked={data.is_bookmarked}
          />
        </div>
        <div className="mt-10">
          <JobSummary
            jobType={data.job_type}
            exp={data.years_of_experience}
            workMode={data.work_mode}
            salary={data.salary_range}
            location={data.location}
          />
        </div>
        <div className="mt-10 md:mb-5">
          <JobDesc desc={data.description} />
        </div>
      </div>
      <div className="md:w-1/4 md:mt-10">
        <JobDetailCard
          id={data.id}
          pfp={data.company_logo}
          bio={data.company_bio}
          companyName={data.company_name}
          email={data.email}
        />
      </div>
    </div>
  );
}
