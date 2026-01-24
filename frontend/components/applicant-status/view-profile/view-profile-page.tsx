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
import { ReviewButton } from "../button/review-button";
import { RejectButton } from "../button/reject-button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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
    user_name: string;
    profile_pic: string;
    email: string;
    bio: string;
    location: string;
    phone_no: string;
    skills: Skills[];
    education: Education[];
    experiences: Experiences[];
  };
}

export async function ViewProfilePage({ userId }: ViewPageProps) {
  const response = await fetcher<UserData>(URLS.GET_JS_FROM_ID(Number(userId)));
  console.log("Hello", response);
  const { data } = response;
  console.log("education: ", data.experiences);

  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div className="flex flex-col gap-4">
          <LeftArrowButton />
        </div>
      </div>
      <div>
        <div className="flex justify-between ">
          <div className="grid grid-cols-2 ">
            <Image
              src={data?.profile_pic || ProfileImage}
              alt="alt"
              width={180}
              height={180}
              className="border border-[#4A70A9] "
            />
            <h1 className="text-2xl font-semibold ">
              {data?.user_name || "N/A"}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <MessageButton />
            <Download />
          </div>
        </div>
        <Card className="border-[#4A70A9] rounded-sm mt-10">
          <CardContent>
            <div className="mb-10">
              <h1 className="text-2xl font-semibold mb-5">Bio</h1>
              <p className="whitespace-pre-line">
                {data?.bio || "No bio available"}
              </p>
            </div>
            <div className="mb-10">
              <Table>
                <TableHeader>
                  <TableRow className="border-none">
                    <TableHead className="font-semibold text-2xl w-1/3">
                      Email
                    </TableHead>
                    <TableHead className="text-center w-1/3 text-2xl font-semibold ">
                      Phone
                    </TableHead>
                    <TableHead className="text-right w-1/3 text-2xl font-semibold">
                      Location
                    </TableHead>
                  </TableRow>
                  <TableRow className="border-none">
                    <TableCell className="font-semibold">
                      {data?.email || "N/A"}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {data?.phone_no ? `+977 ${data.phone_no.slice(4)}` : ""}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {data?.location || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            <div className="mb-10">
              <h1 className="text-2xl font-semibold mb-5">Education</h1>
              <div className="">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#4A70A9]  mb-5">
                      <TableHead className="w-1/3">Name</TableHead>
                      <TableHead className="text-center w-1/3border">
                        Level
                      </TableHead>
                      <TableHead className="text-right w-1/3">
                        End Year
                      </TableHead>
                    </TableRow>
                    {data?.education && data.education.length > 0 ? (
                      data.education.map((edu) => (
                        <TableRow key={edu.id} className="mb-5">
                          <TableCell>{edu?.institution || "N/A"}</TableCell>
                          <TableCell className="text-center">
                            {edu?.level || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {edu?.end_date || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No education records available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableHeader>
                </Table>
              </div>
            </div>
            <div className="mb-10">
              <h1 className="text-2xl font-semibold mb-5">Experience</h1>
              <div className="">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#4A70A9]  mb-5">
                      <TableHead className="w-1/3">Company Name</TableHead>
                      <TableHead className="text-center w-1/3border">
                        Position
                      </TableHead>
                      <TableHead className="text-right w-1/3">
                        End Year
                      </TableHead>
                    </TableRow>
                    {data?.experiences && data.experiences.length > 0 ? (
                      data.experiences.map((exp) => (
                        <TableRow key={exp.id} className="mb-5">
                          <TableCell>{exp?.work_place || "N/A"}</TableCell>
                          <TableCell className="text-center">
                            {exp?.role || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {exp?.end_date ? exp.end_date.slice(0, 4) : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No experience records available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableHeader>
                </Table>
              </div>
            </div>
            <div className="mb-10">
              <h1 className="text-2xl font-semibold mb-5">Skills</h1>
              {data?.skills && data.skills.length > 0 ? (
                <div className="grid grid-cols-5">
                  {data.skills.map((skills) => (
                    <SmallDisplay key={skills.id} name={skills.name} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills listed</p>
              )}
            </div>
            <div className="mb-10">
              <h1 className="text-2xl font-semibold mb-5">Social Links</h1>
              <div className="grid grid-cols-5 gap-2">
                <Link
                  href={"https://www.facebook.com/"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-[13px] border-[#4A70A9] rounded-sm text-[#4A70A9] hover:text-[#4A70A9]",
                  )}
                >
                  Facebook
                </Link>
                <Link
                  href={"https://www.facebook.com/"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-[13px] border-[#4A70A9] rounded-sm text-[#4A70A9] hover:text-[#4A70A9]",
                  )}
                >
                  Instagram
                </Link>
                <Link
                  href={"https://www.facebook.com/"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-[13px] border-[#4A70A9] rounded-sm text-[#4A70A9] hover:text-[#4A70A9]",
                  )}
                >
                  Website
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid border gap-2 grid-cols-3 mt-10">
          <AcceptButton />
          <ReviewButton />
          <RejectButton />
        </div>
      </div>
    </div>
  );
}
