// loading.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex justify-between mb-6 md:mb-10 mt-2">
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Main Content */}
      <div>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-4">
          {/* Profile Image and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 lg:gap-10">
            {/* Image Loading */}
            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] bg-gray-200 border border-gray-100 animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Action Buttons */}
          <div className="flex sm:grid sm:grid-cols-2 gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Details Card */}
        <Card className="border-gray-100 rounded-sm mt-6 md:mt-10">
          <CardContent className="p-4 md:p-6 space-y-8">
            {/* Bio Section */}
            <div>
              <div className="h-7 w-20 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Contact Info */}
            <div>
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="h-7 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <div className="h-7 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <div className="h-7 w-20 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Social Links Section */}
            <div>
              <div className="h-7 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 mt-6 md:mt-10">
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
