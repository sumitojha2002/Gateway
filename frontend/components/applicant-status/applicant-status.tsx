import fetcher from "@/helper/fetcher";
import LeftArrowButton from "./button/left-arrow-button";
import { URLS } from "@/constants";
import { Separator } from "../ui/separator";
import { ApplicantCard } from "./applicant-card";

interface ParamProps {
  id: number | string;
}

export async function ApplicantStatus({ id }: ParamProps) {
  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div className="flex flex-col gap-4">
          <LeftArrowButton />
          <h1 className="text-3xl font-bold">Applicant Status</h1>
        </div>
      </div>
      <div>
        <ApplicantCard id={id} />
      </div>
    </div>
  );
}
