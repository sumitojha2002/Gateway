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
  //console.log(bookmarkId);
  const { data: session, status } = useSession();
  const [addBookMark, { isLoading: isAddingBookmark }] =
    useAddBookMarkMutation();
  const [removeBookMark, { isLoading: isRemovingBookmark }] =
    useRemoveBookMarkMutation();
  const router = useRouter();
  //console.log("BOOKMARKED", bookmarked);
  const role = session?.user?.role;

  if (status === "loading") return null;
  if (role !== "job_seeker") return null;
  const token = session?.user?.accessToken;
  //console.log("TOKEN:", token);

  // Convert bookmarked to boolean for consistent checking
  const isBookmarked = bookmarked === "true" || bookmarked === true;

  // Combined loading state
  const isLoading = isAddingBookmark || isRemovingBookmark;

  const handleAddBookmark = async () => {
    try {
      await addBookMark({ job_id, token }).unwrap();
      alert("Job bookmarked successfully!");
      router.refresh();
    } catch (error: any) {
      // Check nested data structure
      const errorMessage = error?.data?.data?.non_field_errors?.[0];

      if (errorMessage?.includes("already bookmarked")) {
        alert("You have already bookmarked this job.");
      } else {
        alert("Failed to bookmark job. Please try again.");
        console.error("Failed to bookmark job:", error);
      }
    }
  };

  const handleRemoveBookmark = async () => {
    try {
      await removeBookMark({ id: bookmarkId, token }).unwrap();
      alert("Bookmark removed successfully!");
      router.refresh();
    } catch (error: any) {
      alert("Failed to remove bookmark. Please try again.");
      console.error("Failed to remove bookmark:", error);
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
