"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { JOB_FILTER_CONSTANTS } from "@/jobfilterconstatants";

interface FilterMenuItem {
  label: string;
  value: string;
}

interface FilterCategory {
  title: { label: string; value: string };
  menuItem: readonly FilterMenuItem[];
}

interface MobileJobFilterProps {
  menu: readonly FilterCategory[];
}

export function MobileJobFilter({ menu }: MobileJobFilterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  // selectedFilters keyed by the API param (e.g. "job_type", "experience_level")
  const [selectedFilters, setSelectedFilters] = React.useState<
    Record<string, string>
  >({});

  const handleItemSelect = (paramKey: string, itemValue: string) => {
    setSelectedFilters((prev) => {
      if (prev[paramKey] === itemValue) {
        const next = { ...prev };
        delete next[paramKey];
        return next;
      }
      return { ...prev, [paramKey]: itemValue };
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(selectedFilters).forEach(([paramKey, selectedValue]) => {
      if (paramKey === "experience_level") {
        // Translate "junior" | "mid" | "senior" → min_exp / max_exp
        const expKey =
          selectedValue as keyof typeof JOB_FILTER_CONSTANTS.EXPERIENCE_LEVELS;
        const expLevel = JOB_FILTER_CONSTANTS.EXPERIENCE_LEVELS[expKey];
        if (expLevel) {
          params.set("min_exp", String(expLevel.min));
          if (expLevel.max !== null)
            params.set("max_exp", String(expLevel.max));
        }
      } else {
        params.set(paramKey, selectedValue);
      }
    });

    router.push(`/explore-jobs?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="link">Filter</Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-75 sm:w-100 p-6">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-2xl font-bold">Job Filters</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col space-y-6 pt-3">
            {menu.map((category) => {
              const paramKey = category.title.value;

              return (
                <div key={paramKey} className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-1">
                    {category.title.label}
                  </h3>

                  <div className="flex flex-wrap gap-2 pl-2">
                    {category.menuItem.map((item) => {
                      const isSelected =
                        selectedFilters[paramKey] === item.value;
                      return (
                        <Button
                          key={item.value}
                          variant={isSelected ? "brand" : "outline"}
                          size="sm"
                          onClick={() => handleItemSelect(paramKey, item.value)}
                          className="h-8 text-sm"
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Button className="w-full" variant="brand" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
