import { Separator } from "@/components/ui/separator";
import { SmallDisplay } from "@/components/web/small-display";
import React from "react";

interface Skills {
  id: number | string;
  name: string;
}

interface Props {
  skills: Skills[];
}

export function JobSills({ skills }: Props) {
  //console.log(skills);
  return (
    <div>
      <div>
        <h1 className="text-2xl ml-5 font-semibold">Skills</h1>
        <Separator className="mt-5 mb-10 bg-[#4A70A9] " />
      </div>
      <div className="flex">
        {skills.map((item, _) => (
          <div
            key={item.id}
            className="border-[#4A70A9] relative  justify-center pl-10 pr-10 pt-2 pb-2 rounded-sm m-2  border font-semibold  flex"
          >
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
