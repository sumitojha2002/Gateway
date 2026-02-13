import React from "react";
import LeftArrowButton from "../button/left-arrow-button";
import Image from "next/image";
import { MessageButton } from "../button/message-button";
import { Download } from "../button/download";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SmallDisplay } from "@/components/web/small-display";
import { AcceptButton } from "../button/accept-button";
import { RejectButton } from "../button/reject-button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";
import ProfileImage from "@/public/user_profile.jpg";

interface ViewPageProps {
  userId: number | string;
}

interface Skills {
  id: number;
  name: string;
}

interface Education {
  id: number;
  level: string;
  institution: string;
  end_date: number;
}

interface Experiences {
  id: number;
  work_place: string;
  role: string;
  end_date: string;
}

interface UserData {
  data: {
    id: number;
    application_status: string;
    user_name: string;
    profile_pic_url: string;
    email: string;
    bio: string;
    location: string;
    phone_no: string;
    skills: Skills[];
    education: Education[];
    experiences: Experiences[];
    cv_url: string;
  };
}

export async function ViewProfilePage({ userId }: ViewPageProps) {
  const response = await fetcher<UserData>(URLS.GET_JS_FROM_ID(Number(userId)));
  console.log("Hello", response);
  const { data } = response;

  return (
    <div className="px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex justify-between mb-6 md:mb-10 mt-2">
        <div className="flex flex-col gap-4">
          <LeftArrowButton />
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-4">
          {/* Profile Image and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 lg:gap-10">
            {/* Fixed Image Container */}
            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] flex-shrink-0 relative overflow-hidden border border-[#4A70A9]">
              <Image
                src={data?.profile_pic_url || ProfileImage}
                alt={data?.user_name || "Profile picture"}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
              {data?.user_name || "N/A"}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:grid sm:grid-cols-2 gap-2 justify-center sm:justify-start">
            <MessageButton status={data.application_status} id={data.id} />
            <Download cv={data.cv_url} />
          </div>
        </div>

        {/* Details Card */}
        <Card className="border-[#4A70A9] rounded-sm mt-6 md:mt-10">
          <CardContent className="p-4 md:p-6">
            {/* Bio Section */}
            <div className="mb-8 md:mb-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-5">
                Bio
              </h1>
              <p className="whitespace-pre-line text-sm md:text-base">
                {data?.bio || "No bio available"}
              </p>
            </div>

            {/* Contact Info */}
            <div className="mb-8 md:mb-10 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none">
                    <TableHead className="font-semibold text-lg md:text-2xl">
                      Email
                    </TableHead>
                    <TableHead className="text-center text-lg md:text-2xl font-semibold">
                      Phone
                    </TableHead>
                    <TableHead className="text-right text-lg md:text-2xl font-semibold">
                      Location
                    </TableHead>
                  </TableRow>
                  <TableRow className="border-none">
                    <TableCell className="font-semibold text-xs md:text-sm break-all">
                      {data?.email || "N/A"}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-xs md:text-sm">
                      {data?.phone_no ?
                        `+977 ${data.phone_no.slice(4)}`
                      : "N/A"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs md:text-sm">
                      {data?.location || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Education Section */}
            <div className="mb-8 md:mb-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-5">
                Education
              </h1>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#4A70A9]">
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="text-center min-w-[100px]">
                        Level
                      </TableHead>
                      <TableHead className="text-right min-w-[80px]">
                        End Year
                      </TableHead>
                    </TableRow>
                    {data?.education && data.education.length > 0 ?
                      data.education.map((edu) => (
                        <TableRow key={edu.id}>
                          <TableCell className="text-xs md:text-sm">
                            {edu?.institution || "N/A"}
                          </TableCell>
                          <TableCell className="text-center text-xs md:text-sm">
                            {edu?.level || "N/A"}
                          </TableCell>
                          <TableCell className="text-right text-xs md:text-sm">
                            {edu?.end_date || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    : <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground text-sm"
                        >
                          No education records available
                        </TableCell>
                      </TableRow>
                    }
                  </TableHeader>
                </Table>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-8 md:mb-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-5">
                Experience
              </h1>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#4A70A9]">
                      <TableHead className="min-w-[120px]">
                        Company Name
                      </TableHead>
                      <TableHead className="text-center min-w-[100px]">
                        Position
                      </TableHead>
                      <TableHead className="text-right min-w-[80px]">
                        End Year
                      </TableHead>
                    </TableRow>
                    {data?.experiences && data.experiences.length > 0 ?
                      data.experiences.map((exp) => (
                        <TableRow key={exp.id}>
                          <TableCell className="text-xs md:text-sm">
                            {exp?.work_place || "N/A"}
                          </TableCell>
                          <TableCell className="text-center text-xs md:text-sm">
                            {exp?.role || "N/A"}
                          </TableCell>
                          <TableCell className="text-right text-xs md:text-sm">
                            {exp?.end_date ? exp.end_date.slice(0, 4) : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    : <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground text-sm"
                        >
                          No experience records available
                        </TableCell>
                      </TableRow>
                    }
                  </TableHeader>
                </Table>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8 md:mb-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-5">
                Skills
              </h1>
              {data?.skills && data.skills.length > 0 ?
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {data.skills.map((skills) => (
                    <SmallDisplay key={skills.id} name={skills.name} />
                  ))}
                </div>
              : <p className="text-muted-foreground text-sm">
                  No skills listed
                </p>
              }
            </div>

            {/* Social Links Section */}
            <div className="mb-8 md:mb-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-5">
                Social Links
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                <Link
                  href={"https://www.facebook.com/"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-xs md:text-[13px] border-[#4A70A9] rounded-sm text-[#4A70A9] hover:text-[#4A70A9]",
                  )}
                >
                  Facebook
                </Link>
                <Link
                  href={"https://www.instagram.com/"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-xs md:text-[13px] border-[#4A70A9] rounded-sm text-[#4A70A9] hover:text-[#4A70A9]",
                  )}
                >
                  Instagram
                </Link>
                <Link
                  href={"https://www.website.com/"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-xs md:text-[13px] border-[#4A70A9] rounded-sm text-[#4A70A9] hover:text-[#4A70A9]",
                  )}
                >
                  Website
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {data.application_status == "applied" ?
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-4 mt-6 md:mt-10  rounded-sm">
            <AcceptButton userid={data.id} />
            <RejectButton userid={data.id} />
          </div>
        : <div className="grid grid-col-1">
            {data.application_status == "selected" ?
              <Button variant={"brand"} className="mt-3" disabled>
                Accepted
              </Button>
            : <Button variant={"destructive"} className="mt-3" disabled>
                Rejected
              </Button>
            }
          </div>
        }
      </div>
    </div>
  );
}

{
  /* <div className="grid grid-col-1"></div>; */
}
{
  /* <Button variant={"destructive"} className="mt-3" disabled>
  Rejected
</Button>; */
}
