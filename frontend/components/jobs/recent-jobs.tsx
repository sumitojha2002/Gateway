import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";
import React from "react";
import { JobsCard } from "./jobs-card";
import { Job } from "@/app/(shared-layout)/explore-jobs/page";

interface Res {
  data: Job[];
}

export async function RecentJobs() {
  const res = await fetcher<Res>(URLS.GET_JOB_LIST);
  const { data } = res;
  return (
    <div className="flex flex-col justify-center">
      <div className="flex w-full justify-start mt-4 mb-10">
        <h1 className="text-[20px] md:text-[30px]">
          <div className="flex gap-2">
            <span>Recent Jobs</span>
          </div>
        </h1>
      </div>
      <div>
        {data.length > 0 ?
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {data
              .filter((job) => job.status !== "expired")
              .slice(0, 6)
              .map((item, _) => (
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
