import { Separator } from "@/components/ui/separator";

interface JobPageProps {
  desc: string;
}

export function JobDesc({ desc }: JobPageProps) {
  return (
    <div>
      <div>
        <h1 className="text-2xl ml-5 font-semibold">Job Description</h1>
        <Separator className="mt-5 mb-10 bg-[#4A70A9] " />
      </div>
      <div className="mt-5">
        <p className="whitespace-pre-line">{desc}</p>
      </div>
    </div>
  );
}
