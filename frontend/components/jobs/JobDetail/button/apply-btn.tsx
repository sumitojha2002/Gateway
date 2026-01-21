"use client";
import { Button } from "@/components/ui/button";
import { useApplyApplicationMutation } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface JobProps {
  id: number | string;
}

export function ApplyBtn({ id }: JobProps) {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<FormData | null>(null);

  const [applyApplication, { isLoading, isSuccess, isError, error }] =
    useApplyApplicationMutation();

  let errorMessage = "Failed to apply. Please try again.";

  if (isError && error) {
    if ("status" in error && "data" in error) {
      const { message, detail, data } = error.data;

      if (
        error.data?.non_field_errors?.includes(
          "You have already applied for this job."
        )
      ) {
        errorMessage = "You’ve already applied for this job.";
      } else {
        errorMessage = message || detail || `Error: ${error.status}`;
      }
    } else if ("message" in error) {
      errorMessage = error.message || "An unexpected error occurred.";
    }
  }

  if (status === "unauthenticated") {
    return (
      <Link href={"/login"}>
        <Button className="w-full mt-5 rounded-none" variant={"brand"}>
          Login to Apply
        </Button>
      </Link>
    );
  } else {
    const isEmployer = session?.user.role === "employer";

    const handleApply = async () => {
      if (!isEmployer) {
        await applyApplication({
          job_id: Number(id),
          body: formData || new FormData(),
        });
      }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileInput = event.target.files;
      if (fileInput && fileInput[0]) {
        const form = new FormData();
        form.append("cv", fileInput[0]);
        setFormData(form);
      }
    };

    return (
      <div>
        <Button
          className={cn(
            "w-full mt-5 rounded-none",
            isEmployer && "opacity-50 cursor-not-allowed"
          )}
          variant={"brand"}
          disabled={
            isEmployer || isLoading || errorMessage === "Request failed"
          }
          onClick={handleApply}
        >
          {isLoading ? "Applying..." : "Apply"}
        </Button>

        {!isEmployer && (
          <div className="mt-4">
            <label
              htmlFor="cv-upload"
              className="block text-sm font-medium text-gray-700"
            >
              Upload your CV (optional)
            </label>
            <input
              type="file"
              id="cv-upload"
              name="cv-upload"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-500 border border-gray-300 rounded-md"
            />
            {!formData && (
              <p className="text-gray-500 text-xs mt-1">
                No file selected. You can apply without a CV.
              </p>
            )}
          </div>
        )}

        {isSuccess && (
          <p className="text-green-500 mt-2">
            Application submitted successfully!
          </p>
        )}

        {isError && (
          <p className="text-red-500 mt-2">
            {errorMessage === "Request failed"
              ? "Already applied to this job."
              : errorMessage}
          </p>
        )}
      </div>
    );
  }
}
