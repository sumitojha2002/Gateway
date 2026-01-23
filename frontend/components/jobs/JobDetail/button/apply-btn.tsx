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

interface ApiErrorData {
  message?: string;
  detail?: string;
  data?:
    | string
    | string[]
    | {
        non_field_errors?: string | string[];
        [key: string]: any;
      };
  non_field_errors?: string | string[];
}

interface ApiSuccessData {
  message?: string;
  data?: string | string[];
}

// Helper function to safely convert error data to string
const getErrorMessage = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(". ");
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return "An error occurred";
};

export function ApplyBtn({ id }: JobProps) {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<FormData | null>(null);

  const [
    applyApplication,
    { isLoading, isSuccess, isError, error, data: responseData },
  ] = useApplyApplicationMutation();

  let displayMessage = "";
  let messageType: "success" | "error" | null = null;

  // Handle success response
  if (isSuccess && responseData) {
    messageType = "success";
    const successData = responseData as ApiSuccessData;

    if (successData.message) {
      displayMessage = successData.message;
    } else if (successData.data) {
      displayMessage = Array.isArray(successData.data)
        ? successData.data.join(". ")
        : successData.data;
    } else {
      displayMessage = "Application submitted successfully!";
    }
  }

  // Handle error response
  if (isError && error) {
    messageType = "error";

    if ("status" in error && "data" in error) {
      const errorData = error.data as ApiErrorData;

      // Check for message in error.data
      if (errorData.message) {
        displayMessage = errorData.message;
      }
      // Check if data is an object with non_field_errors
      else if (
        errorData.data &&
        typeof errorData.data === "object" &&
        !Array.isArray(errorData.data)
      ) {
        if (errorData.data.non_field_errors) {
          displayMessage = getErrorMessage(errorData.data.non_field_errors);
        } else {
          displayMessage = getErrorMessage(errorData.data);
        }
      }
      // Check for data array/string in error.data
      else if (errorData.data) {
        displayMessage = getErrorMessage(errorData.data);
      }
      // Check for non_field_errors at root level
      else if (errorData.non_field_errors) {
        displayMessage = getErrorMessage(errorData.non_field_errors);
      }
      // Check for detail
      else if (errorData.detail) {
        displayMessage = errorData.detail;
      }
      // Fallback to status code
      else {
        displayMessage = `Error: ${"status" in error ? error.status : "Unknown"}`;
      }
    } else if ("message" in error) {
      displayMessage = error.message || "An unexpected error occurred.";
    } else {
      displayMessage = "Failed to apply. Please try again.";
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
            isEmployer && "opacity-50 cursor-not-allowed",
          )}
          variant={"brand"}
          disabled={isEmployer || isLoading}
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

        {displayMessage && (
          <p
            className={cn(
              "mt-2",
              messageType === "success" && "text-green-500",
              messageType === "error" && "text-red-500",
            )}
          >
            {displayMessage}
          </p>
        )}
      </div>
    );
  }
}
