"use clinet";
import Image from "next/image";
import React from "react";
import Volk from "@/public/volkswagen.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatMain() {
  return (
    <div className="h-full border rounded-md border-[#4A70A9]">
      <div className="border-b border-[#4A70A9] h-22 flex items-center gap-2">
        <div className="relative h-15 w-15 ml-3">
          <Image
            src={Volk}
            alt="Company logo"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-[19px]">John Doe</p>
        </div>
      </div>
      <div className="h-152 border-b mb-2 "></div>
      <div className="flex items-end m-2 gap-2">
        <Input />
        <Button variant={"brand"}>send</Button>
      </div>
    </div>
  );
}
