import React from "react";
import { Data } from "./applied-jobs";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";
import { Separator } from "@/components/ui/separator";
import { JobsCard } from "./job-cards/applied-jobs-card";

interface Res {
  data: Data[];
}

export async function RejectedJobs() {
  const params = new URLSearchParams({
    application_status: "rejected",
  });

  const url = `${URLS.GET_APP_LIST}?${params.toString()}`;

  const res = await fetcher<Res>(url, {
    method: "GET",
  });

  const { data } = res;
  return (
    <div>
      <Separator />
      <div className="mt-5">
        {data.length == 0 ?
          <div>No rejected jobs.</div>
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
                  applicationStatus={"Rejected"}
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
