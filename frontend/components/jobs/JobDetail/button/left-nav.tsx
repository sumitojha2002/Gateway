"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function LeftNavButton() {
  const router = useRouter();
  return (
    <div>
      <ArrowLeft
        onClick={() => router.push("/explore-jobs")}
        className="cursor-pointer"
      />
    </div>
  );
}
