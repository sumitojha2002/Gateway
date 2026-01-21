"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";
function LeftArrowButton() {
  const router = useRouter();
  return (
    <div>
      <ArrowLeft
        size={20}
        className="cursor-pointer"
        onClick={() => router.back()}
      />
    </div>
  );
}

export default LeftArrowButton;
