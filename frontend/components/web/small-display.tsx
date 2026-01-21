import React from "react";

interface PropsName {
  name: String;
  index?: number;
}
export function SmallDisplay({ name, index }: PropsName) {
  return (
    <>
      <div
        key={index}
        className="border-[#4A70A9] text-[#4A70A9]  justify-center p-2 rounded-sm m-2  text-center border font-semibold cursor-pointer flex text-[12px]"
      >
        {name}
      </div>
    </>
  );
}
