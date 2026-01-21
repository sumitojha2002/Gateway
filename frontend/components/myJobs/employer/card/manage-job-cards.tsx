import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmallDisplay } from "@/components/web/small-display";
import { JobDeleteButton } from "../button/job-delete-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Job {
  id: string | number;
  title: string;
  job_type: string;
  work_mode: string;
  experience_level: string;
  salary_range: string;
  location: string;
  status: string;
}

interface ManageJobsResponse {
  jobList: Job[];
}

const getLabel = (list: { label: string; value: string }[], value: string) =>
  list.find((item) => item.value === value)?.label ?? value;

const formatSalary = (salaryRange?: string) => {
  if (!salaryRange) return "";

  try {
    const parsed = JSON.parse(salaryRange);
    const lower = parsed.lower
      ? `Rs. ${Number(parsed.lower).toLocaleString("en-IN")}`
      : "";
    const upper = parsed.upper
      ? `Rs. ${Number(parsed.upper).toLocaleString("en-IN")}`
      : "";

    if (lower && upper) return `${lower} - ${upper}`;
    if (lower) return lower;
    if (upper) return upper;

    return "";
  } catch {
    return salaryRange;
  }
};

export function ManageJobsCards({ jobList }: ManageJobsResponse) {
  const name = "posted job";

  const jobTypes = [
    { label: "Intern", value: "intern" },
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
    { label: "Contract", value: "contract" },
  ];

  const workMode = [
    { label: "Onsite", value: "onsite" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
  ];

  return (
    <div>
      {jobList.length === 0 ? (
        <p>No draft jobs available.</p>
      ) : (
        jobList.map((job) => (
          <Card key={job.id} className="rounded-md mb-4">
            <CardHeader>
              <CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col gap-2 text-center md:text-left">
                    <h1 className="text-[20px]">{job.title}</h1>
                    <span className="text-[13px] text-gray-500">
                      {job.location}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <SmallDisplay name={getLabel(jobTypes, job.job_type)} />
                    <SmallDisplay name={getLabel(workMode, job.work_mode)} />
                    <SmallDisplay name={job.experience_level} />
                  </div>
                  <div className="flex justify-center md:justify-end items-center">
                    <span className="text-[#4A70A9] text-[18px]">
                      {formatSalary(job.salary_range)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Link
                    href={`/employer/my-jobs/manage/${job.id}/edit`}
                    className={cn(
                      "flex-1",
                      buttonVariants({ variant: "outline" })
                    )}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/employer/my-jobs/manage/${job.id}/applicant-status`}
                    className={cn(
                      "flex-1",
                      buttonVariants({ variant: "brand" })
                    )}
                  >
                    Applicant Status
                  </Link>
                  <JobDeleteButton id={job.id} name={name} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))
      )}
    </div>
  );
}
