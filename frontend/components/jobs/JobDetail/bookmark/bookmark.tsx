import React from "react";
import { JobsCard } from "../../jobs-card";
import { Job } from "@/app/(shared-layout)/explore-jobs/page";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface SalaryRange {
  lower: number;
  upper: number;
  bounds: string;
}

interface YearsOfExperience {
  lower: number;
  upper: number;
  bounds: string;
}

interface BookmarkedJob {
  id: number; // This is the bookmark ID
  user: number;
  user_name: string;
  is_bookmarked: boolean;
  email: string;
  job: number; // This is the actual job ID
  company_name: string;
  company_bio: string;
  company_logo_url: string;
  job_title: string;
  description: string;
  location: string;
  job_type: string;
  work_mode: string;
  experience_level: string;
  salary: string;
  salary_range: SalaryRange;
  expire_date: string;
  created_at: string;
  years_of_experience: YearsOfExperience;
}

interface BookmarkedJobsResponse {
  status: number;
  message: string;
  data: BookmarkedJob[];
}

export async function Bookmark() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  if (!token) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Please log in to view bookmarks.</p>
      </div>
    );
  }

  try {
    const res = await fetcher<BookmarkedJobsResponse>(
      URLS.GET_JOB_BOOKMARK_LIST,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("BOOKMARKED", res);

    const jobs = res?.data || [];

    // Transform bookmarked jobs to match the Job interface expected by JobsCard
    const transformedJobs: Job[] = jobs.map((bookmark) => ({
      id: bookmark.job, // The actual job ID
      bookmark_id: bookmark.id, // The bookmark ID for deletion
      title: bookmark.job_title,
      company_name: bookmark.company_name,
      company_logo_url: bookmark.company_logo_url,
      company_bio: bookmark.company_bio,
      description: bookmark.description,
      location: bookmark.location,
      job_type: bookmark.job_type,
      work_mode: bookmark.work_mode,
      experience_level: bookmark.experience_level,
      salary_range: JSON.stringify(bookmark.salary_range), // Convert object to JSON string
      expires_at: bookmark.expire_date,
      created_at: bookmark.created_at,
      is_bookmarked: bookmark.is_bookmarked,
      email: bookmark.email,
      years_of_experience: bookmark.years_of_experience,
      skills: [], // Add empty array if not provided
    }));

    return (
      <div className="container mx-auto">
        {transformedJobs.length > 0 ?
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 ">
            {transformedJobs.map((item, _) => (
              <JobsCard
                id={item.id}
                company_logo_url={item.company_logo_url}
                company_name={item.company_name}
                title={item.title}
                location={item.location}
                is_bookmarked={item.is_bookmarked}
                bookmark_id={item.bookmark_id}
                work_mode={item.work_mode}
                job_type={item.job_type}
                experience_level={item.experience_level}
                salary_range={item.salary_range}
              />
            ))}
          </div>
        : <div className="text-center py-10">
            <p className="text-gray-500">No bookmarked jobs yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Start exploring jobs and bookmark the ones you're interested in!
            </p>
          </div>
        }
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load bookmarked jobs.</p>
      </div>
    );
  }
}
