import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="rounded-md mb-4">
            <CardHeader>
              <CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Title and Location */}
                  <div className="flex flex-col gap-2 text-center md:text-left">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
                  </div>

                  {/* Job Type, Work Mode, Experience badges */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                  </div>

                  {/* Salary */}
                  <div className="flex justify-center md:justify-end items-center">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </div>
  );
}
