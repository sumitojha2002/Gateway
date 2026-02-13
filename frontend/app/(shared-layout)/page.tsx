import Image from "next/image";
import HomeImage from "../../public/NA_October_10.jpg";
import JobSearchFilter from "@/components/feature-name/job-search-filter";
import TopJobs from "@/components/jobs/top-jobs";
import RecommendedJobs from "@/components/jobs/top-jobs";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-end">
        <Image src={HomeImage} alt="home-image" className="relative mt-4" />
        <JobSearchFilter />
      </div>
      <div className="mt-5  sm:mt-10 ">
        <RecommendedJobs />
      </div>
    </div>
  );
}
