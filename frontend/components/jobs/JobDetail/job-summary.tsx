import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExperienceLevelDisplay } from "@/helper/yearsOfExperience";

export interface ExpObject {
  lower: number;
  upper: number | null;
}

interface JobPageProps {
  jobType: string;
  exp: ExpObject;
  workMode: string;
  salary: string;
  location: string;
}

export function JobSummary({
  jobType,
  exp,
  workMode,
  salary,
  location,
}: JobPageProps) {
  const job = [
    { label: "full_time", value: "Full Time" },
    { label: "intern", value: "Intern" },
    { label: "part_time", value: "Part Time" },
    { label: "contract", value: "Contract" },
  ];
  const work = [
    { label: "onsite", value: "Onsite" },
    {
      label: "remote",
      value: "Remote",
    },
    {
      label: "hybrid",
      value: "Hybrid",
    },
  ];

  const lower_exp = exp.lower;
  const upper_exp = exp.upper;

  const convertSalaryFormat = () => {
    const sal = JSON.parse(salary);
    const upperSal = sal.upper;
    const lowerSal = sal.lower;

    const formattedUpper = new Intl.NumberFormat("en-IN").format(upperSal);
    const formattedLower = new Intl.NumberFormat("en-IN").format(lowerSal);

    return `Rs ${formattedLower} - Rs ${formattedUpper}`;
  };
  return (
    <div>
      <div>
        <h1 className="text-2xl ml-5 font-semibold">Job Summary</h1>
        <Separator className="mt-5 mb-10 bg-[#4A70A9] " />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-[18px]">Job Type</h1>
            </CardTitle>
            <span className="text-[#4A70A9] text-[18px] font-semibold mt-2">
              {job.map((job) => (job.label == jobType ? job.value : ""))}
            </span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-[18px]">Experience Level</h1>
            </CardTitle>
            <span className="text-[#4A70A9] text-[18px] font-semibold mt-2">
              {ExperienceLevelDisplay.map((expr) =>
                expr.lower == lower_exp && expr.upper == upper_exp
                  ? expr.label
                  : ""
              )}
            </span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-[18px]">Work Mode</h1>
            </CardTitle>
            <span className="text-[#4A70A9] text-[18px] font-semibold mt-2">
              {work.map((work) => (work.label == workMode ? work.value : ""))}
            </span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-[18px]">location</h1>
            </CardTitle>
            <span className="text-[#4A70A9] text-[18px] font-semibold mt-2">
              {location}
            </span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-[18px]">Offered Salary</h1>
            </CardTitle>
            <span className="text-[#4A70A9] text-[18px] font-semibold mt-2">
              {convertSalaryFormat()}
            </span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
