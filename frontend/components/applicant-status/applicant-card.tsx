import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { ViewProfile } from "./button/view-profile";
import { Download } from "./button/download";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";
import { Separator } from "../ui/separator";
import ProfileImage from "@/public/user_profile.jpg";

interface MyJobProps {
  id: string | number;
}

interface UserData {
  user_name: string;
  profile_pic: string;
  id: number | string;
  applied_at: string;
}

interface Response {
  data: UserData[];
}

export async function ApplicantCard({ id }: MyJobProps) {
  const res = await fetcher<Response>(URLS.GET_APPLICANTS_LIST(Number(id)));
  const applicants = res.data ?? [];

  const formatDate = (str: string) => {
    return new Date(str).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[#4A70A9] text-[17px] font-semibold">
        Total Applicants: {applicants.length}
      </h1>
      <Separator className="mt-5 mb-10 bg-[#4A70A9]" />

      {applicants.map((applicant) => (
        <Card key={applicant.id}>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-2 gap-3 items-center">
                <Image
                  src={applicant.profile_pic || ProfileImage}
                  alt={applicant.user_name}
                  width={100}
                  height={100}
                  className="border rounded"
                />
                <h1>{applicant.user_name}</h1>
              </div>

              <p className="text-[#00000080]">
                Applied on: {formatDate(applicant.applied_at)}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <ViewProfile userId={applicant.id} jobId={id} />
                <Download />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
