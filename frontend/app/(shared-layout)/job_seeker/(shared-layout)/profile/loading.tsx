import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div className="h-9 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      <Card className="w-full">
        <CardContent>
          {/* Profile Image Section */}
          <div className="flex justify-between md:flex-row flex-col">
            <div className="flex-row align-middle md:flex md:align-baseline">
              <div className="flex justify-center">
                <div className="w-40 h-40 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="m-4 flex justify-center">
                <div className="h-11 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <Separator className="mt-4 mb-5 " />

          {/* Personal Info Card */}
          <Card>
            <CardHeader>
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="mt-5 ">
            <CardHeader>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>

          {/* Bio Card */}
          <Card className="mt-5 ">
            <CardHeader>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>

          {/* Education Card */}
          <Card className="mt-5 ">
            <CardHeader>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              {[1, 2].map((i) => (
                <div key={i} className="mb-7">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4 mb-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j}>
                        <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                  {i < 2 && <Separator className="mt-8 mb-8" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience Card */}
          <Card className="mt-5 ">
            <CardHeader>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              {[1, 2].map((i) => (
                <div key={i} className="mb-7">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4 mb-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j}>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="h-4 w-28 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                  {i < 2 && <Separator className="mt-8" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="mt-5 ">
            <CardHeader>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-gray-200 rounded-sm animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card className="mt-5 ">
            <CardHeader>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resume Card */}
          <Card className="mt-5 border-[#4A70A9]">
            <CardHeader>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
