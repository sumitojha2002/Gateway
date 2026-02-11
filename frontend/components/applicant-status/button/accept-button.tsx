"use client";
import { Button } from "@/components/ui/button";
import { useAcceptJobSeekerMutation } from "@/lib/api";
import { useEffect } from "react";

interface Props {
  userid: number;
}

export function AcceptButton({ userid }: Props) {
  const [acceptJob, { isLoading, isSuccess, data, error }] =
    useAcceptJobSeekerMutation();

  useEffect(() => {
    if (isSuccess && data) {
      alert(data.message || "Job application status updated");
      window.location.reload();
    }
  }, [isSuccess, data]);

  return (
    <Button
      variant="outline"
      className="border-[#4A70A9] text-[#4A70A9] rounded-none"
      disabled={isLoading}
      onClick={() => acceptJob({ id: userid, body: "selected" })}
    >
      {isLoading ? "Accepting..." : "Accept"}
    </Button>
  );
}
