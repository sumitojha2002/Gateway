import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="md:w-3/4 mt-10 mb-10 flex flex-col">
        {/* Back Button */}
        <div className="mb-5">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Job Title Card */}
        <div>
          <Card className="bg-[#4A70A9] rounded-md">
            <CardHeader>
              <div className="h-9 w-3/4 bg-white/20 rounded mb-2 animate-pulse" />
              <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
            </CardHeader>
          </Card>
        </div>

        {/* Job Summary */}
        <div className="mt-10">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded ml-5 animate-pulse" />
            <Separator className="mt-5 mb-10 bg-[#4A70A9]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-5 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div className="mt-10 md:mb-5">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded ml-5 animate-pulse" />
            <Separator className="mt-5 mb-10 bg-[#4A70A9]" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Job Detail Card */}
      <div className="md:w-1/4 md:mt-10 mb-20">
        <Card className="border-[#4A70A9] rounded-sm">
          <div className="pl-6 pr-6">
            {/* Company Logo */}
            <div className="w-full flex justify-center">
              <div className="h-[180px] w-[220px] bg-gray-200 rounded-md animate-pulse" />
            </div>

            {/* Company Name */}
            <div className="mt-3 mb-3">
              <div className="h-8 w-3/4 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            {/* Company Bio */}
            <div className="mb-3 space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Email Section */}
            <div className="flex flex-col">
              <div>
                <div className="h-5 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Contact Section */}
              <div className="mt-4">
                <div className="h-5 w-20 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-3 mt-5 gap-5">
              <div className="h-9 bg-gray-200 rounded-none animate-pulse" />
              <div className="h-9 bg-gray-200 rounded-none animate-pulse" />
              <div className="h-9 bg-gray-200 rounded-none animate-pulse" />
            </div>
          </div>
        </Card>

        {/* Apply Button */}
        <div className="h-10 w-full bg-gray-200 rounded mt-4 animate-pulse" />
      </div>
    </div>
  );
}
