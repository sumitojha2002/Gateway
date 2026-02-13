import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmallDisplay } from "@/components/web/small-display";

import Link from "next/link";

interface Props {
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

const getLabel = (list: { label: string; value: string }[], value: string) =>
  list.find((item) => item.value === value)?.label ?? value;

const formatSalary = (salaryRange?: string) => {
  if (!salaryRange) return "";

  try {
    const parsed = JSON.parse(salaryRange);
    const lower =
      parsed.lower ? `Rs. ${Number(parsed.lower).toLocaleString("en-IN")}` : "";
    const upper =
      parsed.upper ? `Rs. ${Number(parsed.upper).toLocaleString("en-IN")}` : "";

    if (lower && upper) return `${lower} - ${upper}`;
    if (lower) return lower;
    if (upper) return upper;

    return "";
  } catch {
    return salaryRange;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB");
};

export function JobHistoryCard({
  id,
  title,
  location,
  salary_range,
  expires_at,
  created_at,
  job_type,
  work_mode,
  experience_level,
}: Props) {
  const jobTypes = [
    { label: "Intern", value: "intern" },
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
    { label: "Contract", value: "contract" },
  ];

  const workModes = [
    { label: "Onsite", value: "onsite" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
  ];
  return (
    <Card className="rounded-md mb-4">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-[20px]">{title}</h1>
            <span className="text-[13px] text-gray-500">{location}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <SmallDisplay name={getLabel(jobTypes, job_type ?? "")} />
            <SmallDisplay name={getLabel(workModes, work_mode ?? "")} />
            <SmallDisplay name={experience_level} />
          </div>

          <div className="flex justify-center md:justify-end items-center">
            <span className="text-[#4A70A9] text-[18px]">
              {formatSalary(salary_range)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 text-center md:grid-cols-3 gap-2 mb-1">
          <span className="text-[15px] text-gray-500 flex justify-start">
            Posted on : {formatDate(created_at)}
          </span>
          <span className="text-[15px]  text-gray-500 flex justify-end md:justify-center">
            Ended on : {formatDate(expires_at)}
          </span>
          <Link
            href={`/explore-jobs/${id}/view-job`}
            className="text-[#4A70A9] hidden md:flex justify-end"
          >
            View
          </Link>
        </div>
      </CardContent>

      <CardContent>
        <Link
          href={`/explore-jobs/${id}/view-job`}
          className="text-[#4A70A9] flex md:hidden justify-end"
        >
          View
        </Link>
      </CardContent>
    </Card>
  );
}
