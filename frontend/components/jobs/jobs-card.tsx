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
import Volkwagon from "../../public/volkswagen.jpg";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Job } from "@/app/(shared-layout)/explore-jobs/page";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProfileImage from "@/public/user_profile.jpg";
interface JobProps {
  job: Job[];
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

export function JobsCard({ job }: JobProps) {
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
    <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 ">
      {job.map((job) => (
        <Card key={job.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <Image
                  src={job.company_logo ? job.company_logo : ProfileImage}
                  width={90}
                  height={90}
                  alt="Volk"
                  className="rounded-md object-contain"
                />
                <div className="flex-col">
                  <CardTitle className={styles.jobCardTitle}></CardTitle>
                  <h1 className={styles.jobCardRole}>{job.title}</h1>
                  <CardDescription>
                    {job.location == "string" ? "" : job.location}
                  </CardDescription>
                </div>
              </div>

              <Heart className={styles.jobFavIcon} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between ">
              <Label className={styles.jobType}>
                {getLabel(workMode, job.work_mode ?? "")}
              </Label>
              <Label className={styles.jobType}>
                {getLabel(jobTypes, job.job_type ?? "")}
              </Label>
              <Label className={styles.jobType}>{job.experience_level}</Label>
            </div>
            <div>
              <p className="text-[#4A70A9] font-semibold  text-[20px]">
                {" "}
                {formatSalary(job.salary_range)}
              </p>
            </div>
          </CardContent>
          <CardFooter className="w-full">
            <Link
              href={`/explore-jobs/${job.id}/view-job`}
              className={cn(
                "w-full hover:bg-[#4A70A9]! hover:text-white!",
                buttonVariants({ variant: "outline" }),
              )}
            >
              View
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
