import React from "react";
import { JobHistoryCard } from "./card/job-history-card";

export function JobHistory() {
  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div>
          <h1 className="text-3xl font-bold">History</h1>
        </div>
      </div>
      <JobHistoryCard />
      <JobHistoryCard />
      <JobHistoryCard />
      <JobHistoryCard />
      <JobHistoryCard />
      <JobHistoryCard />
    </div>
  );
}
