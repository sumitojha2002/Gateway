"use client";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import styles from "../../jobs-card.module.css";
import { useAddBookMarkMutation, useRemoveBookMarkMutation } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface JobProps {
  job_id: number | string;
  bookmarked: string | boolean;
  bookmarkId: number;
}

export function BookMarkHeart({ job_id, bookmarked, bookmarkId }: JobProps) {
  const { data: session, status } = useSession();
  const [addBookMark, { isLoading: isAddingBookmark }] =
    useAddBookMarkMutation();
  const [removeBookMark, { isLoading: isRemovingBookmark }] =
    useRemoveBookMarkMutation();
  const router = useRouter();

  const role = session?.user?.role;

  if (status === "loading") return null;
  if (role !== "job_seeker") return null;

  const isBookmarked = bookmarked === "true" || bookmarked === true;
  const isLoading = isAddingBookmark || isRemovingBookmark;

  const handleAddBookmark = async () => {
    //console.log("➕ [ADD BOOKMARK] Sending request with:", { job_id });

    try {
      const response = await addBookMark({ job_id }).unwrap();
      //console.log("✅ [ADD BOOKMARK] Success response:", response);
      alert("Job bookmarked successfully!");
      router.refresh();
    } catch (error: any) {
      console.error("❌ [ADD BOOKMARK] Error response:", error);
      console.error("❌ [ADD BOOKMARK] Error data:", error?.data);
      console.error("❌ [ADD BOOKMARK] Error status:", error?.status);

      const errorMessage = error?.data?.data?.non_field_errors?.[0];
      if (errorMessage?.includes("already bookmarked")) {
        alert("You have already bookmarked this job.");
      } else {
        alert("Failed to bookmark job. Please try again.");
      }
    }
  };

  const handleRemoveBookmark = async () => {
    //console.log("🗑️ [REMOVE BOOKMARK] Sending request with:", { id: bookmarkId });

    try {
      const response = await removeBookMark({ id: bookmarkId }).unwrap();
      //console.log("✅ [REMOVE BOOKMARK] Success response:", response);
      alert("Bookmark removed successfully!");
      router.refresh();
    } catch (error: any) {
      console.error("❌ [REMOVE BOOKMARK] Error response:", error);
      console.error("❌ [REMOVE BOOKMARK] Error data:", error?.data);
      console.error("❌ [REMOVE BOOKMARK] Error status:", error?.status);
      alert("Failed to remove bookmark. Please try again.");
    }
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      handleRemoveBookmark();
    } else {
      handleAddBookmark();
    }
  };

  return (
    <div>
      <Heart
        fill={isBookmarked ? "#4A70A9" : "white"}
        stroke="grey"
        strokeWidth={2}
        className={cn(styles.jobFavIcon, "drop-shadow-md")}
        onClick={handleToggleBookmark}
        style={{
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.5 : 1,
        }}
        aria-label="Bookmark job"
      />
    </div>
  );
}
