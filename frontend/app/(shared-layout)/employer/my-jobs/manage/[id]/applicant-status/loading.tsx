import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div className="flex flex-col gap-4">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-56 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Total Applicants */}
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <Separator className="mt-5 mb-10 " />

        {/* Applicant Cards */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex justify-between items-center">
                {/* Profile Image and Name */}
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="w-[100px] h-[100px] bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Applied Date */}
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
