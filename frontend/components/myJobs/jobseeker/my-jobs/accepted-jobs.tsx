import { URLS } from "@/constants";
import React from "react";
import { Data } from "./applied-jobs";
import fetcher from "@/helper/fetcher";
import { Separator } from "@/components/ui/separator";
import { JobsCard } from "./job-cards/applied-jobs-card";

interface Res {
  data: Data[];
}

export async function AcceptedJobs() {
  const params = new URLSearchParams({
    application_status: "selected",
  });

  const url = `${URLS.GET_APP_LIST}?${params.toString()}`;

  const res = await fetcher<Res>(url, {
    method: "GET",
  });
  //console.log(res);
  const { data } = res;
  //console.log(data);
  return (
    <div>
      <Separator />
      <div className="mt-5">
        {data.length == 0 ?
          <div>No accepted jobs.</div>
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
                  applicationStatus={"Accepted"}
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
