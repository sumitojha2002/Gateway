"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SearchIcon, ChevronDown } from "lucide-react";
import styles from "./job-search-filter.module.css";
import { MobileJobFilter } from "./mobile-job-filter";
import { JOB_FILTER_CONSTANTS, FILTER_MENU } from "@/jobfilterconstatants";

export default function JobSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [titleInput, setTitleInput] = React.useState(
    searchParams.get("title") ?? "",
  );

  // selectedFilters keyed by the API param (e.g. "job_type", "work_mode", "experience_level")
  const [selectedFilters, setSelectedFilters] = React.useState<
    Record<string, string>
  >(() => {
    const init: Record<string, string> = {};
    FILTER_MENU.forEach((category) => {
      const val = searchParams.get(category.title.value);
      if (val) init[category.title.value] = val;
    });
    return init;
  });

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

  const buildParams = () => {
    const params = new URLSearchParams();
    if (titleInput.trim()) params.set("title", titleInput.trim());

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

    return params;
  };

  const handleSearch = () => {
    router.push(`/explore-jobs?${buildParams().toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const getActiveLabelFor = (paramKey: string): string | null => {
    const selectedValue = selectedFilters[paramKey];
    if (!selectedValue) return null;

    if (paramKey === "experience_level") {
      const expKey =
        selectedValue as keyof typeof JOB_FILTER_CONSTANTS.EXPERIENCE_LEVELS;
      return JOB_FILTER_CONSTANTS.EXPERIENCE_LEVELS[expKey]?.label ?? null;
    }

    const allItems = [
      ...JOB_FILTER_CONSTANTS.JOB_TYPE.menuItem,
      ...JOB_FILTER_CONSTANTS.WORK_MODE.menuItem,
    ];
    return allItems.find((i) => i.value === selectedValue)?.label ?? null;
  };

  return (
    <div className={styles.filterContainer}>
      <Menubar className="flex gap-5 border-none">
        <InputGroup className="w-1xs border-none">
          <InputGroupInput
            className="text-[10px] md:text-[15px]"
            placeholder="Search..."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div className="hidden md:flex">
          {FILTER_MENU.map((menuObject, index) => {
            const paramKey = menuObject.title.value;
            const activeLabel = getActiveLabelFor(paramKey);

            return (
              <MenubarMenu key={index}>
                <MenubarTrigger className={styles.responsiveText}>
                  <p className="mr-1">
                    {activeLabel ?
                      <span className="text-brand font-semibold">
                        {activeLabel}
                      </span>
                    : menuObject.title.label}
                  </p>
                  <ChevronDown size={15} />
                </MenubarTrigger>
                <MenubarContent>
                  {menuObject.menuItem.map((item, itemIndex) => {
                    const isSelected = selectedFilters[paramKey] === item.value;
                    return (
                      <MenubarItem
                        key={itemIndex}
                        className={isSelected ? "bg-accent font-semibold" : ""}
                        onClick={() => handleItemSelect(paramKey, item.value)}
                      >
                        {item.label}
                      </MenubarItem>
                    );
                  })}
                </MenubarContent>
              </MenubarMenu>
            );
          })}
        </div>

        <Button
          variant={"brand"}
          className={styles.responsiveSearchButton}
          onClick={handleSearch}
        >
          Search
        </Button>

        <MobileJobFilter menu={[...FILTER_MENU]} />
      </Menubar>
    </div>
  );
}
