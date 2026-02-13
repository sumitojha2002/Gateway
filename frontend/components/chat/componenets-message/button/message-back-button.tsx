"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function MessageBackButton() {
  const router = useRouter();
  return (
    <div className="flex gap-2 cursor-pointer" onClick={() => router.back()}>
      <ArrowLeft />
      <p className="font-semi-bold">Back</p>
    </div>
  );
}
