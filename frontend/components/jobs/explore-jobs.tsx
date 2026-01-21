"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JobsCard } from "./jobs-card";
import { Job } from "@/app/(shared-layout)/explore-jobs/page";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

// ============================================================================
// CONSTANTS
// ============================================================================
const CONSTANTS = {
  JOB_TYPE: {
    title: { label: "Job Type", value: "job_type" },
    menuItem: [
      { label: "Full Time", value: "full_time" },
      { label: "Part Time", value: "part_time" },
      { label: "Intern", value: "intern" },
      { label: "Contract", value: "contract" },
    ],
  },

  WORK_MODE: {
    title: { label: "Work Mode", value: "work_mode" },
    menuItem: [
      { label: "Onsite", value: "onsite" },
      { label: "Remote", value: "remote" },
      { label: "Hybrid", value: "hybrid" },
    ],
  },

  EXPERIENCE_LEVELS: {
    junior: { label: "Junior Level", min: 0, max: 2 },
    mid: { label: "Mid Level", min: 3, max: 5 },
    senior: { label: "Senior Level", min: 5, max: null }, // null = infinity
  },
} as const;

const MENU = [CONSTANTS.JOB_TYPE, CONSTANTS.WORK_MODE];

// ============================================================================
// TYPES
// ============================================================================
interface JobsProps {
  jobs: Job[];
}

type ExperienceLevel = "junior" | "mid" | "senior";

interface FilterContentProps {
  Menu: typeof MENU;
  selectedFilters: Record<string, string>;
  handleItemSelect: (key: string, value: string) => void;
  selectedExperience: ExperienceLevel[];
  toggleExperience: (level: ExperienceLevel) => void;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate the combined experience range from selected levels
 * Examples:
 * - [junior] → min: 0, max: 2
 * - [junior, mid] → min: 0, max: 5
 * - [mid, senior] → min: 3, max: null (infinity)
 * - [junior, mid, senior] → min: 0, max: null (infinity)
 */
function calculateExperienceRange(
  selectedLevels: ExperienceLevel[]
): { min: number; max: number | null } | null {
  if (selectedLevels.length === 0) {
    return null; // No experience filter
  }

  const ranges = selectedLevels.map(
    (level) => CONSTANTS.EXPERIENCE_LEVELS[level]
  );

  const min = Math.min(...ranges.map((r) => r.min));

  // If any selected level has null (infinity) as max, return null for max
  const hasInfinity = ranges.some((r) => r.max === null);
  const max = hasInfinity
    ? null
    : Math.max(...ranges.map((r) => r.max as number));

  return { min, max };
}

/**
 * Parse experience levels from URL parameters
 */
function parseExperienceLevelsFromURL(
  minExp?: string,
  maxExp?: string
): ExperienceLevel[] {
  if (!minExp && !maxExp) return [];

  const min = Number(minExp) || 0;
  const max = maxExp ? Number(maxExp) : null; // null if not provided

  const selected: ExperienceLevel[] = [];

  // Check which experience levels match the range
  (Object.keys(CONSTANTS.EXPERIENCE_LEVELS) as ExperienceLevel[]).forEach(
    (level) => {
      const range = CONSTANTS.EXPERIENCE_LEVELS[level];

      // Handle infinity case
      if (max === null && range.max === null) {
        // Both infinity - check if min matches
        if (range.min >= min) {
          selected.push(level);
        }
      } else if (max === null) {
        // URL has infinity, check if level's max is within or is also infinity
        if (range.min >= min) {
          selected.push(level);
        }
      } else if (range.max === null) {
        // Level has infinity, check if it overlaps with finite max
        if (range.min <= max) {
          selected.push(level);
        }
      } else {
        // Both finite - check overlap
        if (range.min >= min && range.max <= max) {
          selected.push(level);
        } else if (range.min <= min && range.max >= min) {
          selected.push(level);
        } else if (range.min <= max && range.max >= max) {
          selected.push(level);
        }
      }
    }
  );

  return selected;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ExploreJobSearch({ jobs }: JobsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState<
    ExperienceLevel[]
  >([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Sync URL params → state
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const filters: Record<string, string> = {};
    let minExp: string | undefined;
    let maxExp: string | undefined;

    params.forEach((value, key) => {
      if (key === "query" || key === "title") {
        setSearchQuery(value);
      } else if (key === "location") {
        setLocation(value);
      } else if (key === "min_exp") {
        minExp = value;
      } else if (key === "max_exp") {
        maxExp = value;
      } else {
        filters[key] = value;
      }
    });

    setSelectedFilters(filters);
    setSelectedExperience(parseExperienceLevelsFromURL(minExp, maxExp));
  }, [searchParams]);

  // Toggle experience level selection
  const toggleExperience = useCallback((level: ExperienceLevel) => {
    setSelectedExperience((prev) =>
      prev.includes(level)
        ? prev.filter((item) => item !== level)
        : [...prev, level]
    );
  }, []);

  // Handle filter selection
  const handleItemSelect = useCallback((key: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      if (newFilters[key] === value) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }

      return newFilters;
    });
  }, []);

  // Clear all filters
  const handleClearAll = useCallback(() => {
    setSelectedFilters({});
    setSearchQuery("");
    setLocation("");
    setSelectedExperience([]);
    router.push("/explore-jobs");
  }, [router]);

  // Apply filters and update URL
  const applyFilters = useCallback(() => {
    const params: Record<string, string> = { ...selectedFilters };

    if (searchQuery.trim()) {
      params.title = searchQuery.trim();
    }

    if (location.trim()) {
      params.location = location.trim();
    }

    // Calculate experience range from selected levels
    const experienceRange = calculateExperienceRange(selectedExperience);
    if (experienceRange) {
      params.min_exp = String(experienceRange.min);
      // Only add max_exp if it's not null (infinity)
      if (experienceRange.max !== null) {
        params.max_exp = String(experienceRange.max);
      }
      // If max is null, don't send max_exp parameter at all
    }

    const queryString = new URLSearchParams(params).toString();
    router.push(`/explore-jobs${queryString ? `?${queryString}` : ""}`);
    setIsSheetOpen(false);
  }, [selectedFilters, searchQuery, location, selectedExperience, router]);

  // Handle Enter key in search input
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        applyFilters();
      }
    },
    [applyFilters]
  );

  return (
    <div className="mt-10">
      {/* Search Bar */}
      <div className="mb-5">
        <div className="lg:w-1/2 flex gap-2 border-2 p-3 rounded-md">
          <Input
            type="search"
            placeholder="Search job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <Button variant="brand" onClick={applyFilters}>
            Search
          </Button>

          {/* Mobile Filter */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">Filter</Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="mr-5 ml-5">
                  <FilterContent
                    Menu={MENU}
                    selectedFilters={selectedFilters}
                    handleItemSelect={handleItemSelect}
                    selectedExperience={selectedExperience}
                    toggleExperience={toggleExperience}
                    location={location}
                    setLocation={setLocation}
                  />
                </div>

                <Button
                  variant={"brand"}
                  className="w-full mt-6"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex gap-0 md:gap-5">
        {/* Desktop Filters */}
        <div className="w-0 md:w-2/4">
          <Card className="hidden md:flex">
            <CardContent>
              <div className="flex justify-between">
                <p className="font-semibold">Filters</p>
                <Button variant="link" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
              <Separator className="my-4" />

              <FilterContent
                Menu={MENU}
                selectedFilters={selectedFilters}
                handleItemSelect={handleItemSelect}
                selectedExperience={selectedExperience}
                toggleExperience={toggleExperience}
                location={location}
                setLocation={setLocation}
              />

              <Button
                className="w-full mt-6"
                variant={"brand"}
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Jobs */}
        <div className="w-full">
          {jobs.length ? (
            <JobsCard job={jobs} />
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-10">
              No jobs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FILTER CONTENT COMPONENT
// ============================================================================
function FilterContent({
  Menu,
  selectedFilters,
  handleItemSelect,
  selectedExperience,
  toggleExperience,
  location,
  setLocation,
}: FilterContentProps) {
  // Calculate the current experience range display
  const experienceRangeText = useMemo(() => {
    const range = calculateExperienceRange(selectedExperience);
    if (!range) return "";

    if (range.max === null) {
      return `${range.min}+ years`; // Show "5+ years" for infinity
    }

    return `${range.min}-${range.max} years`;
  }, [selectedExperience]);

  return (
    <div className="flex flex-col space-y-6 pt-3">
      {/* Job Type and Work Mode Filters */}
      {Menu.map((category) => (
        <div key={category.title.value}>
          <h3 className="font-semibold mb-2">{category.title.label}</h3>
          <div className="flex flex-wrap gap-2">
            {category.menuItem.map((item) => (
              <Button
                key={item.value}
                variant={
                  selectedFilters[category.title.value] === item.value
                    ? "brand"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  handleItemSelect(category.title.value, item.value)
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Experience Level Filter */}
      <div>
        <h3 className="font-semibold mb-2">Experience Level</h3>
        {experienceRangeText && (
          <p className="text-sm text-gray-600 mb-3">
            Selected range: {experienceRangeText}
          </p>
        )}
        <div className="space-y-3">
          {(Object.keys(CONSTANTS.EXPERIENCE_LEVELS) as ExperienceLevel[]).map(
            (level) => (
              <div key={level} className="flex items-center gap-3">
                <Checkbox
                  id={level}
                  checked={selectedExperience.includes(level)}
                  onCheckedChange={() => toggleExperience(level)}
                />
                <Label htmlFor={level} className="cursor-pointer">
                  {CONSTANTS.EXPERIENCE_LEVELS[level].label} (
                  {CONSTANTS.EXPERIENCE_LEVELS[level].min}
                  {CONSTANTS.EXPERIENCE_LEVELS[level].max === null
                    ? "+"
                    : `-${CONSTANTS.EXPERIENCE_LEVELS[level].max}`}{" "}
                  years)
                </Label>
              </div>
            )
          )}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h3 className="font-semibold mb-2">Location</h3>
        <Input
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </div>
  );
}
