import Image from "next/image";
import HomeImage from "../../public/NA_October_10.jpg";
import JobSearchFilter from "@/components/feature-name/job-search-filter";
import RecommendedJobs from "@/components/jobs/top-jobs";
import { RecentJobs } from "@/components/jobs/recent-jobs";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-end">
        <Image
          src={HomeImage}
          alt="home-image"
          className="relative mt-4"
          priority // removes lazy-loading + adds fetchpriority="high" + preloads
          placeholder="blur" // uses the blurDataURL from the static import while loading
          sizes="100vw" // tells the browser this image spans the full viewport width
        />
        <JobSearchFilter />
      </div>
      <div className="mt-5 sm:mt-10">
        <RecommendedJobs />
      </div>
      <div className="mt-5 sm:mt-10">
        <RecentJobs />
      </div>
    </div>
  );
}
