export const JOB_FILTER_CONSTANTS = {
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

// Derived menu shape for Experience so it fits the same FilterCategory type
export const EXPERIENCE_MENU = {
  title: { label: "Experience", value: "experience_level" },
  menuItem: Object.entries(JOB_FILTER_CONSTANTS.EXPERIENCE_LEVELS).map(
    ([key, val]) => ({ label: val.label, value: key }), // value = "junior" | "mid" | "senior"
  ),
};

// The full menu array consumed by both filter components
export const FILTER_MENU = [
  {
    title: JOB_FILTER_CONSTANTS.JOB_TYPE.title,
    menuItem: JOB_FILTER_CONSTANTS.JOB_TYPE.menuItem,
  },
  {
    title: JOB_FILTER_CONSTANTS.WORK_MODE.title,
    menuItem: JOB_FILTER_CONSTANTS.WORK_MODE.menuItem,
  },
  EXPERIENCE_MENU,
] as const;
