"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";

interface FilterCategory {
  title: string | { label: string; value: string };
  menuItem: string[] | { label: string; value: string }[];
}

interface MobileJobFilterProps {
  menu: FilterCategory[];
}

export function MobileJobFilter({ menu }: MobileJobFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [selectedFilters, setSelectedFilters] = React.useState<
    Record<string, string>
  >({});

  const handleItemSelect = (categoryTitle: string, itemValue: string) => {
    if (selectedFilters[categoryTitle] === itemValue) {
      setSelectedFilters((prev) => {
        const newState = { ...prev };
        delete newState[categoryTitle];
        return newState;
      });
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [categoryTitle]: itemValue,
      }));
    }
  };

  const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilters((prev) => ({
      ...prev,
      Location: e.target.value,
    }));
  };

  const applyFilters = () => {
    console.log("Applying Filters:", selectedFilters);
    const params = new URLSearchParams(selectedFilters).toString();
    // In your app, you would navigate or fetch here:
    // router.push(`/jobs?${params}`);
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
            {menu.map((category, catIndex) => {
              // Determine category label and value safely
              const categoryLabel =
                typeof category.title === "string"
                  ? category.title
                  : category.title.label;
              const categoryValue =
                typeof category.title === "string"
                  ? category.title
                  : category.title.value;

              return (
                <div key={categoryValue || catIndex} className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-1">
                    {categoryLabel}
                  </h3>

                  {categoryLabel === "Location" ? (
                    <select
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleLocationSelect}
                      value={selectedFilters[categoryLabel] || ""}
                    >
                      <option value="" disabled>
                        Select a Location
                      </option>
                      {category.menuItem.map((location, locIndex) => {
                        const value =
                          typeof location === "string"
                            ? location
                            : location.value;
                        const label =
                          typeof location === "string"
                            ? location
                            : location.label;
                        return (
                          <option key={value || locIndex} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <div className="flex flex-wrap gap-2 pl-2">
                      {category.menuItem.map((item, itemIndex) => {
                        const value =
                          typeof item === "string" ? item : item.value;
                        const label =
                          typeof item === "string" ? item : item.label;

                        return (
                          <Button
                            key={value || itemIndex}
                            variant={
                              selectedFilters[categoryValue] === value
                                ? "brand"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleItemSelect(categoryValue, value)
                            }
                            className="h-8 text-sm"
                          >
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
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
