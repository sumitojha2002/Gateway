import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "../ui/button";
import styles from "../jobs/jobs-card.module.css";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { Job } from "@/app/(shared-layout)/explore-jobs/page";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProfileImage from "@/public/user_profile.jpg";
import { BookMarkHeart } from "./JobDetail/bookmark/bookmark-heart";

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

export function JobsCard({
  id,
  company_logo_url,
  company_name,
  title,
  location,
  is_bookmarked,
  bookmark_id,
  work_mode,
  job_type,
  experience_level,
  salary_range,
}: Job) {
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
    <Card key={id} className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-4">
            <Image
              src={company_logo_url ? company_logo_url : ProfileImage}
              width={90}
              height={90}
              alt="Volk"
              className="rounded-md object-contain"
            />
            <div className="flex-col">
              <CardTitle className={styles.jobCardTitle}>
                {company_name}
              </CardTitle>
              <h1 className={styles.jobCardRole}>{title}</h1>
              <CardDescription>
                {location == "string" ? "" : location}
              </CardDescription>
            </div>
          </div>

          <BookMarkHeart
            job_id={id}
            bookmarked={is_bookmarked}
            bookmarkId={bookmark_id}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between ">
          <Label className={styles.jobType}>
            {getLabel(workMode, work_mode ?? "")}
          </Label>
          <Label className={styles.jobType}>
            {getLabel(jobTypes, job_type ?? "")}
          </Label>
          <Label className={styles.jobType}>{experience_level}</Label>
        </div>
        <div>
          <p className="text-[#4A70A9] font-semibold  text-[20px]">
            {" "}
            {formatSalary(salary_range)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <Link
          href={`/explore-jobs/${id}/view-job`}
          className={cn(
            "w-full hover:bg-[#4A70A9]! hover:text-white!",
            buttonVariants({ variant: "outline" }),
          )}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  );
}
