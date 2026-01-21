import React from "react";
import { JobDraftCard } from "./card/job-draft-card";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";

interface JobDraftItem {
  id: number | string;
  title: string;
  updated_at: string;
  // add other fields if needed
}

interface Jobs {
  data: JobDraftItem[];
}

export async function JobDraft() {
  const draftJobs = await fetcher<Jobs>(URLS.DRAFT_JOBS);

  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <h1 className="text-3xl font-bold">Draft</h1>
      </div>

      {draftJobs.data.length > 0 ? (
        draftJobs.data.map((item) => (
          <JobDraftCard
            key={item.id}
            title={item.title}
            date={item.updated_at}
            id={item.id}
          />
        ))
      ) : (
        <p>No draft jobs available.</p>
      )}
    </div>
  );
}
