import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Job Title */}
          <Card className=" rounded-md mb-6">
            <CardHeader>
              <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card className="rounded-md mb-6">
            <CardHeader>
              <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
            </CardHeader>
          </Card>

          {/* Location and Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
            <Card className=" rounded-md mb-6 md:mb-0">
              <CardHeader>
                <div className="h-8 w-24 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </CardHeader>
            </Card>

            <Card className=" rounded-md mb-6 md:mb-0">
              <CardHeader>
                <div className="h-8 w-24 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </CardHeader>
            </Card>

            {/* Years of Experience and Work Mode */}
            <Card className=" rounded-md mb-6 md:mb-0">
              <CardHeader>
                <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </CardHeader>
            </Card>

            <Card className=" rounded-md mb-6 md:mb-0">
              <CardHeader>
                <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </CardHeader>
            </Card>
          </div>

          {/* Skills */}
          <Card className=" rounded-md mb-6 md:mt-5">
            <CardHeader>
              <div className="h-8 w-20 bg-gray-200 rounded mb-4 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>

          {/* Offered Salary */}
          <Card className="mt-5  rounded-md mb-6">
            <CardHeader>
              <div className="h-8 w-36 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
          </Card>

          {/* Expire Days */}
          <Card className="mt-5  rounded-md mb-6">
            <CardHeader>
              <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </CardHeader>
          </Card>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
