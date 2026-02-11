import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ApplicantProps {
  userId: string | number;
  jobId: string | number;
}

export async function ViewProfile({ userId, jobId }: ApplicantProps) {
  return (
    <div>
      <Link
        href={`/employer/my-jobs/manage/${jobId}/applicant-status/${userId}/view-profile`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "border-[#4A70A9] rounded-none w-full!",
        )}
      >
        View Profile
      </Link>
    </div>
  );
}
