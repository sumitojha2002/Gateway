import fetcher from "@/helper/fetcher";
import { JobsCard } from "./jobs-card";
import { URLS } from "@/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Job } from "@/app/(shared-layout)/explore-jobs/page";

export default async function RecommendedJobs() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "job_seeker") return null;

  const res = await fetcher(URLS.GET_RECOMMENDED_JOBS);
  //console.log("HEllo", res);
  const jobs: Job[] = Array.isArray(res) ? res : [];

  return (
    <div className="flex flex-col justify-center">
      <div className="flex w-full justify-start mt-4 mb-10">
        <h1 className="text-[20px] md:text-[30px]">
          <div className="flex gap-2">
            <span>Recommended Jobs</span>
          </div>
        </h1>
      </div>

      <div>
        {jobs.length > 0 ?
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {jobs.map((item: any, _: any) => (
              <div key={item.id}>
                <JobsCard
                  company_name={item.company_name}
                  status={item.status}
                  id={item.id}
                  company_logo_url={item.company_logo_url}
                  title={item.title}
                  location={item.location}
                  is_bookmarked={item.is_bookmarked}
                  bookmark_id={item.bookmarked_id}
                  work_mode={item.work_mode}
                  job_type={item.job_type}
                  experience_level={item.experience_level}
                  salary_range={item.salary_range}
                />
              </div>
            ))}
          </div>
        : <div className="col-span-full flex items-center justify-center py-10">
            <p className="text-gray-500 text-center">
              No recommendations available yet.
            </p>
          </div>
        }
      </div>
    </div>
  );
}
