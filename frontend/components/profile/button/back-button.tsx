"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <div>
      <ArrowLeft onClick={() => router.push("/")} />
    </div>
  );
}
