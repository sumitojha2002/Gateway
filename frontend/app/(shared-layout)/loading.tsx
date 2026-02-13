import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import HomeImage from "@/public/NA_October_10.jpg";

export function JobCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-4">
            {/* Company logo skeleton */}
            <Skeleton className="w-[90px] h-[90px] rounded-md" />

            <div className="flex flex-col gap-2 flex-1">
              {/* Company name skeleton */}
              <Skeleton className="h-5 w-32" />
              {/* Job title skeleton */}
              <Skeleton className="h-6 w-48" />
              {/* Location skeleton */}
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Bookmark icon skeleton */}
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Job type labels skeleton */}
        <div className="flex justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Salary skeleton */}
        <Skeleton className="h-7 w-40" />
      </CardContent>

      <CardFooter className="w-full">
        {/* View button skeleton */}
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col justify-center">
      {/* Home Image - appears once */}
      <div className="flex justify-center items-end">
        <Image src={HomeImage} alt="home-image" className="relative mt-4" />
      </div>

      {/* Header skeleton */}
      <div className="flex w-full justify-start mt-4 mb-10">
        <Skeleton className="h-8 w-64 md:h-10" />
      </div>

      {/* Job cards grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
