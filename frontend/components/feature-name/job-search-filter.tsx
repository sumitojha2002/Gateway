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

export default function JobSearchFilter() {
  const Menu = [
    {
      title: "Experience",
      menuItem: ["Entry Level", "Mid Level", "Senior Level"],
    },
    {
      title: "Job Type",
      menuItem: ["Full Time", "Part Time", "Internship", "Freelance"],
    },
    {
      title: "Location",
      menuItem: ["Kalanki", "Lalitpur", "Bhaktapur", "Thamel"],
    },
    {
      title: "Work Mode",
      menuItem: ["Onsite", "Remote", "Hybrid"],
    },
  ];

  return (
    <div className={styles.filterContainer}>
      <Menubar className="flex gap-5 border-none">
        <InputGroup className="w-1xs border-none ">
          <InputGroupInput
            className="text-[10px] md:text-[15px]"
            placeholder="Search..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <div className="hidden md:flex">
          {Menu.map((menuObject, index) => (
            <MenubarMenu key={index}>
              <MenubarTrigger className={styles.responsiveText}>
                <p className="mr-1">{menuObject.title}</p>
                <ChevronDown size={15} />
              </MenubarTrigger>
              <MenubarContent>
                {menuObject.menuItem.map((item, itemIndex) => (
                  <MenubarItem key={itemIndex}>{item}</MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          ))}
        </div>
        <Button variant={"brand"} className={styles.responsiveSearchButton}>
          Search
        </Button>
        <MobileJobFilter menu={Menu} />
      </Menubar>
    </div>
  );
}
