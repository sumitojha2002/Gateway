import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useMemo } from "react";

interface JobPageProps {
  expireDate: string;
  title: string;
}

export function JobTitle({ expireDate, title }: JobPageProps) {
  const convertDate = (): string => {
    if (!expireDate) return "";
    return new Date(expireDate).toISOString().split("T")[0]; // 2026-01-21
  };

  return (
    <div>
      <Card className="bg-[#4A70A9] rounded-md">
        <CardHeader>
          <CardTitle>
            <h1 className="text-white text-3xl mb-2 font-bold">{title}</h1>
          </CardTitle>
          <div className="text-white text-[18px] font-semibold">
            Apply before: {convertDate()}
          </div>
          <CardAction>
            <Heart />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
