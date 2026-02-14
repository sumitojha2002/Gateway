import { Separator } from "@/components/ui/separator";
import { SmallDisplay } from "@/components/web/small-display";
import React from "react";

interface Skills {
  id: number | string;
  name: string;
}

interface Props {
  skills?: Skills[]; // Make it optional
}

export function JobSills({ skills = [] }: Props) {
  return (
    <div>
      <div>
        <h1 className="text-2xl ml-5 font-semibold">Skills</h1>
        <Separator className="mt-5 mb-10 bg-[#4A70A9]" />
      </div>
      <div className="flex flex-wrap">
        {skills.length > 0 ?
          skills.map((item) => (
            <div
              key={item.id}
              className="border-[#4A70A9] relative justify-center pl-10 pr-10 pt-2 pb-2 rounded-sm m-2 border font-semibold flex"
            >
              <span>{item.name}</span>
            </div>
          ))
        : <p className="ml-5 text-gray-500">No skills specified</p>}
      </div>
    </div>
  );
}
