import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ProfileImage from "@/public/user_profile.jpg";
import { ExperienceLevelDisplay } from "@/helper/yearsOfExperience";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  companyImage: string;
  companyName: string;
  jobTitle: string;
  location: string;
  workMode: string;
  jobType: string;
  yearsOfExperice: Experience;
  applicationStatus: string;
  id: number;
  job: number;
}

type Experience = {
  lower: number;
  upper: number | null;
  bounds?: string;
};

const getLabel = (list: { label: string; value: string }[], value: string) =>
  list.find((item) => item.value === value)?.label ?? value;

const getExperienceLabel = (exp: { lower: number; upper: number | null }) => {
  return (
    ExperienceLevelDisplay.find((level) => {
      if (level.upper === null) {
        return exp.lower >= level.lower;
      }

      return exp.lower >= level.lower && exp.lower <= level.upper;
    })?.label || "N/A"
  );
};
export function JobsCard({
  id,
  job,
  companyImage,
  companyName,
  jobTitle,
  location,
  workMode,
  jobType,
  yearsOfExperice,
  applicationStatus,
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
  const status = applicationStatus;
  return (
    <div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-3 max-[1000px]:grid-cols-1 gap-2">
            <div className="flex gap-3 ">
              <div>
                <Image
                  src={companyImage || ProfileImage}
                  alt={""}
                  width={100}
                  height={100}
                  className="border w-25 h-25 object-cover rounded-sm"
                />
              </div>
              <div className="flex items-center">
                <div className="flex flex-col ">
                  <h1 className="text-[18px]">{companyName}</h1>
                  <h1 className=" font-bold text-[18px]">{jobTitle}</h1>
                  <p className="text-[12px]">{location}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex w-full gap-2">
                <p className="border w-1/3 text-center rounded-sm border-[#4A70A9] text-[#4A70A9]">
                  {getLabel(workModes, workMode ?? "")}
                </p>
                <p className="border  w-1/3 text-center rounded-sm  border-[#4A70A9] text-[#4A70A9]">
                  {getLabel(jobTypes, jobType || "")}
                </p>
                <p className="border w-1/3 text-center rounded-sm border-[#4A70A9] text-[#4A70A9]">
                  {getExperienceLabel(yearsOfExperice)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
              <Link
                href={`/explore-jobs/${job}/view-job`}
                className={cn(
                  "w-full hover:bg-[#4A70A9]! hover:text-white!",
                  buttonVariants({ variant: "outline" }),
                )}
              >
                View
              </Link>
              {status == "Applied" ?
                <Button variant={"brand"} disabled>
                  {status}
                </Button>
              : <div className="w-full">
                  {status == "Accepted" ?
                    <Button variant={"brand"} className="w-full" disabled>
                      {status}
                    </Button>
                  : <Button variant={"destructive"} className="w-full" disabled>
                      {status}
                    </Button>
                  }
                </div>
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
