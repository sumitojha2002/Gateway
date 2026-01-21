import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmallDisplay } from "@/components/web/small-display";
import Link from "next/link";

export function JobHistoryCard() {
  return (
    <Card className="rounded-md mb-4">
      <CardHeader>
        <CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h1 className="text-[20px]">Sr. Frontend Developer</h1>
              <span className="text-[13px] text-gray-500">
                Kalanki, Kathmandu
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <SmallDisplay name="Full-time" />
              <SmallDisplay name="Remote" />
              <SmallDisplay name="Senior" />
            </div>

            <div className="flex justify-center md:justify-end items-center">
              <span className="text-[#4A70A9] text-[18px]">
                10,000 – 12,000
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 text-center md:grid-cols-3 gap-2 mb-1">
            <span className="text-[15px] text-gray-500 flex justify-start">
              Posted on : 2023-04-27
            </span>
            <span className="text-[15px]  text-gray-500 flex justify-end md:justify-center">
              Ended on : 2023-04-27
            </span>
            <Link href="" className="text-[#4A70A9] hidden md:flex justify-end">
              View
            </Link>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Link href="" className="text-[#4A70A9] flex md:hidden justify-end">
          View
        </Link>
      </CardContent>
    </Card>
  );
}
