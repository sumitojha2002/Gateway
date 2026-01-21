import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { JobDeleteButton } from "../button/job-delete-button";

interface JobCardProps {
  id: string | number;
  title: string;
  date: string;
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function JobDraftCard({ title, date, id }: JobCardProps) {
  const name = "drafted job";
  return (
    <Card className="rounded-md mb-4">
      <CardHeader>
        <CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-[20px] text-left">{title}</h1>
            </div>

            <div className="flex items-center justify-center md:justify-start">
              <span className="text-gray-500 text-[15px]">
                Edited on: {formatDateTime(date)}
              </span>
            </div>

            <div className="hidden md:flex gap-2">
              <Link
                href={`/employer/my-jobs/draft/${id}/edit`}
                className={cn("flex-1", buttonVariants({ variant: "outline" }))}
              >
                Edit
              </Link>
              <JobDeleteButton id={id} name={name} />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 md:hidden">
            <Link
              href={`/employer/my-jobs/draft/${id}/edit`}
              className={cn("flex-1", buttonVariants({ variant: "outline" }))}
            >
              Edit
            </Link>
            <JobDeleteButton id={id} name={name} />
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
