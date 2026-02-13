import { URLS } from "@/constants";
import React from "react";
import { JobsCard } from "./jobs-card";
import { Job } from "@/app/(shared-layout)/explore-jobs/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Res {
  data: Job[];
}

export async function RecentJobs() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  const queryObj: Record<string, string> = {};

  const queryString =
    Object.keys(queryObj).length ?
      `?${new URLSearchParams(queryObj).toString()}`
    : "";

  try {
    const res = await fetch(`${URLS.GET_JOB_LIST}${queryString}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }

    // Parse the JSON response
    const responseData: Res = await res.json();
    const data = responseData.data || [];

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
                .map((item) => (
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
  } catch (error) {
    console.error("Error fetching recent jobs:", error);

    // Return error state UI
    return (
      <div className="flex flex-col justify-center">
        <div className="flex w-full justify-start mt-4 mb-10">
          <h1 className="text-[20px] md:text-[30px]">
            <div className="flex gap-2">
              <span>Recent Jobs</span>
            </div>
          </h1>
        </div>
        <div className="col-span-full flex items-center justify-center py-10">
          <p className="text-red-500 text-center">
            Failed to load jobs. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
