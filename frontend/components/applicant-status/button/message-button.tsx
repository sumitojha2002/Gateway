"use client";

import { Button } from "@/components/ui/button";
import { useChatInitiateMutation } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  status: string;
  id: number;
}

export function MessageButton({ status, id }: Props) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [initiateChat, { isLoading }] = useChatInitiateMutation();

  const handleClick = async () => {
    setErrorMessage(null);

    try {
      const res = await initiateChat({ id }).unwrap();

      // Redirect to specific chat page
      router.push(`/employer/chat`);
    } catch (err: any) {
      const backendError =
        err?.data?.data?.job_application?.[0] ||
        err?.data?.message ||
        "Something went wrong.";

      setErrorMessage(backendError);

      // Optional: alert for immediate notice
      // alert(backendError);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className="border-[#4A70A9] text-[#4A70A9] rounded-none"
        disabled={status !== "selected" || isLoading}
        onClick={handleClick}
      >
        {isLoading ? "Starting..." : "Message"}
      </Button>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
