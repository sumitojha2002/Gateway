import { Separator } from "@/components/ui/separator";
import React from "react";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";
import { JobsCard } from "./job-cards/applied-jobs-card";

interface Res {
  data: Data[];
}

type Experience = {
  lower: number;
  upper: number | null;
  bounds?: string;
};

export interface Data {
  id: number;
  job: number;
  company_logo_url: string;
  company_name: string;
  job_title: string;
  location: string;
  work_mode: string;
  job_type: string;
  years_of_experience: Experience;
}
export async function AppliedJobs() {
  // Build query string
  const params = new URLSearchParams({
    application_status: "applied",
  });

  const url = `${URLS.GET_APP_LIST}?${params.toString()}`;

  const res = await fetcher<Res>(url, {
    method: "GET",
  });

  const { data } = res;
  console.log(data);
  return (
    <div>
      <Separator />
      <div className="mt-5">
        {data.length == 0 ?
          <div>No applied jobs.</div>
        : <div>
            {data.map((item, _) => (
              <div key={item.id} className="mt-3">
                <JobsCard
                  companyImage={item.company_logo_url}
                  companyName={item.company_name}
                  jobTitle={item.job_title}
                  location={item.location}
                  workMode={item.work_mode}
                  jobType={item.job_type}
                  yearsOfExperice={item.years_of_experience}
                  applicationStatus={"Applied"}
                  id={item.id}
                  job={item.job}
                />
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
