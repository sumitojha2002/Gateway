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
  profile_pic_url: string;
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
    <div className="space-y-4 px-4 md:px-0">
      {/* Header */}
      <h1 className="text-[#4A70A9] text-base md:text-[17px] font-semibold">
        Total Applicants: {applicants.length}
      </h1>
      <Separator className="mt-3 md:mt-5 mb-6 md:mb-10 bg-[#4A70A9]" />

      {/* Applicants List */}
      {applicants.length > 0 ?
        applicants.map((applicant) => (
          <Card key={applicant.id} className="overflow-hidden">
            <CardContent className="-m-1">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4 ">
                {/* Left Section: Profile + Date */}
                <div className="flex justify-between sm:flex-row sm:justify-between sm:items-center gap-4 flex-1">
                  {/* Profile Section */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Fixed Image Container */}
                    <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] flex-shrink-0 relative overflow-hidden border rounded">
                      <Image
                        src={applicant.profile_pic_url || ProfileImage}
                        alt={applicant.user_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h1 className="text-sm sm:text-base md:text-lg font-medium break-words">
                      {applicant.user_name}
                    </h1>
                  </div>

                  {/* Applied Date */}
                  <p className="flex text-xs items-center sm:text-sm text-[#00000080] whitespace-nowrap lg:pr-20  ">
                    Applied on: {formatDate(applicant.applied_at)}
                  </p>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex flex-col! sm:grid sm:grid-cols-1 lg:grid lg:grid-cols-2 lg:items-center gap-2 w-full sm:w-auto lg:w-auto">
                  <ViewProfile userId={applicant.id} jobId={id} />
                  <Download />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      : <div>
          <p className="text-muted-foreground text-sm md:text-base">
            No applicants yet
          </p>
        </div>
      }
    </div>
  );
}
