"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Volk from "@/public/user_profile.jpg";

interface Props {
  displayname: string;
  jobtitle: string;
  createdat: string;
  chatId: number;
  isSelected?: boolean;
  picture: string;
  onSelect: () => void;
}

function getLocalTimeNoSeconds(utcTimestamp: string): string {
  const date = new Date(utcTimestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function MessageHeaderCard({
  displayname,
  picture,
  jobtitle,
  createdat,
  chatId,
  isSelected = false,
  onSelect,
}: Props) {
  //console.log(picture);
  return (
    <Card
      className={`p-1 m-0 cursor-pointer border-0 rounded-none transition-colors ${
        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src={picture || Volk}
              alt="Company logo"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <h1 className="text-[15px] font-semibold truncate">
                  {displayname}
                </h1>
                <h2 className="text-[14px] text-gray-600 truncate">
                  {jobtitle}
                </h2>
              </div>
              <div className="text-[13px] text-gray-500 ml-2 flex-shrink-0">
                <p>{getLocalTimeNoSeconds(createdat)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
