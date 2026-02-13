import React from "react";
import { JobHistoryCard } from "./card/job-history-card";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";

interface Data {
  id: number;
  title: string;
  location: string;
  salary_range: string;
  expires_at: string;
  created_at: string;
  job_type: string;
  work_mode: string;
  experience_level: string;
}

interface Res {
  data: Data[];
}

export async function JobHistory() {
  const res = await fetcher<Res>(URLS.GET_HISTORY_JOBS);
  const { data } = res;
  //console.log("History", data);
  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div>
          <h1 className="text-3xl font-bold">History</h1>
        </div>
      </div>
      {data.length > 0 ?
        <div>
          {data.map((item, _) => (
            <div key={item.id}>
              <JobHistoryCard
                id={item.id}
                title={item.title}
                location={item.location}
                salary_range={item.salary_range}
                expires_at={item.expires_at}
                created_at={item.created_at}
                job_type={item.job_type}
                work_mode={item.work_mode}
                experience_level={item.experience_level}
              />
            </div>
          ))}
        </div>
      : <div>No Jobs available.</div>}
    </div>
  );
}
