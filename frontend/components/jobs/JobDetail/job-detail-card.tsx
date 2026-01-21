import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { ApplyBtn } from "./button/apply-btn";

interface JobPageProps {
  id: number | string;
  pfp: string | StaticImageData;
  bio: string;
  companyName: string;
  email: string;
}

export function JobDetailCard({
  pfp,
  id,
  bio,
  companyName,
  email,
}: JobPageProps) {
  return (
    <div className="mb-20">
      <Card className="border-[#4A70A9] rounded-sm">
        <div className="pl-6 pr-6">
          <div className="w-full flex justify-center">
            <Image
              src={pfp}
              alt="company_image_logo"
              width={220}
              height={180}
              className="rounded-md"
            />
          </div>
          <div className="mt-3 mb-3">
            <h1 className="text-2xl text-center font-bold">{companyName}</h1>
          </div>
          <div>
            <p className="text-[15px] block mb-3">{bio}</p>
            <div className="flex flex-col">
              <div>
                <h1 className="font-semibold mb-1">Email</h1>
                <p className="text-[15px]">{email}</p>
              </div>
              <div className="mt-4">
                <h1 className="font-semibold  mb-1">Contact</h1>
                <p className="text-[15px]">123456789</p>
              </div>
            </div>
            <div className="grid grid-cols-3 mt-5 gap-5">
              <Link
                href={"https://www.facebook.com/"}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-[13px] border-[#4A70A9] rounded-none"
                )}
              >
                Facebook
              </Link>
              <Link
                href={"https://www.facebook.com/"}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-[13px] border-[#4A70A9] rounded-none"
                )}
              >
                Instagram
              </Link>
              <Link
                href={"https://www.facebook.com/"}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-[13px] border-[#4A70A9] rounded-none"
                )}
              >
                Website
              </Link>
            </div>
          </div>
        </div>
      </Card>
      <ApplyBtn id={id} />
    </div>
  );
}
