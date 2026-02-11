// loading.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ProfileImage from "@/public/user_profile.jpg";

export default function Loading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index}>
          <CardContent>
            <div className="grid grid-cols-3 max-[1000px]:grid-cols-1 gap-2">
              <div className="flex gap-3">
                <div>
                  <Image
                    src={ProfileImage}
                    alt=""
                    width={100}
                    height={100}
                    className="border w-25 h-25 object-cover rounded-sm opacity-30"
                  />
                </div>
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <div className="h-[18px] w-32 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-[18px] w-40 bg-gray-300 rounded animate-pulse mb-1" />
                    <div className="h-[12px] w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="flex w-full gap-2">
                  <div className="border w-1/3 h-8 rounded-sm border-gray-200 bg-gray-100 animate-pulse" />
                  <div className="border w-1/3 h-8 rounded-sm border-gray-200 bg-gray-100 animate-pulse" />
                  <div className="border w-1/3 h-8 rounded-sm border-gray-200 bg-gray-100 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
                <Button variant="outline" disabled className="opacity-50">
                  View
                </Button>
                <Button variant="brand" disabled className="opacity-50">
                  Accepted
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
