import { start } from "repl";
import z from "zod";
import { describe } from "zod/v4/core";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8).max(20),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

//export type RegisterFormValues = z.infer<typeof registerSchema>;

// export const registerSchema = z
//   .object({
//     email: z.email(),
//     role: z.enum(["job_seeker", "employer"]),
//     fullname: z.string().min(8).max(20).optional(),
//     companyName: z.string().min(2).max(50).optional(),
//     password: z.string().min(8).max(20),
//     confirmPassword: z.string().min(8).max(20),
//   })
//   .refine((data) => {
//     if (data.role === "job_seeker") {
//       return data.fullname !== undefined;
//     } else if (data.role === "employer") {
//       return data.companyName !== undefined;
//     }
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });
export const registerJobSeekerSchema = z
  .object({
    email: z.string().email(),
    fullname: z.string().min(8).max(50),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterJobSeekerFormValues = z.infer<
  typeof registerJobSeekerSchema
>;

export const registerEmployerSchema = z
  .object({
    email: z.string().email(),
    companyName: z.string().min(2).max(50),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterEmployerFormValues = z.infer<typeof registerEmployerSchema>;

//form schemas for profile editing can be added here

export const EducationSchema = z.object({
  level: z
    .string()
    .min(2, "Education level must be at least 2 characters")
    .max(50),
  institution: z
    .string()
    .min(2, "Institution name must be at least 2 characters")
    .max(20),
  start_date: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid 4-digit year")
    .refine(
      (val) => Number(val) >= 1900 && Number(val) <= new Date().getFullYear(),
      { message: "Year must be between 1900 and current year" },
    ),
  end_date: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid 4-digit year")
    .refine(
      (val) => Number(val) >= 1900 && Number(val) <= new Date().getFullYear(),
      { message: "Year must be between 1900 and current year" },
    )
    .optional(),
});
// what if skills is tags with id and name
export const skillsSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Skill name must be at least 1 character").max(50),
});

export const experienceSchema = z
  .object({
    work_place: z
      .string()
      .min(2, "Work place must be at least 2 characters")
      .max(40),
    role: z.string().min(2, "Role must be at least 2 characters").max(50),
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)")
      .refine(
        (val) => {
          const year = Number(val.split("-")[0]);
          return year >= 1900 && year <= new Date().getFullYear();
        },
        { message: "Year must be between 1900 and current year" },
      ),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)")
      .refine(
        (val) => {
          const year = Number(val.split("-")[0]);
          return year >= 1900 && year <= new Date().getFullYear();
        },
        { message: "Year must be between 1900 and current year" },
      )
      .optional(),
    description: z
      .string()
      .min(1, "Description cannot be kept empty.")
      .max(200, "Description must be at most 200 characters"),
  })
  .refine(
    (data) =>
      !data.end_date || new Date(data.end_date) >= new Date(data.start_date),
    {
      message: "End date cannot be before start date",
      path: ["end_date"], // show error on end_date field
    },
  );

export const newExperienceSchema = z
  .object({
    work_place: z
      .string()
      .min(2, "Work place must be at least 2 characters")
      .max(40)
      .optional(),
    role: z
      .string()
      .min(2, "Role must be at least 2 characters")
      .max(50)
      .optional(),
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)")
      .refine(
        (val) => {
          const year = Number(val.split("-")[0]);
          return year >= 1900 && year <= new Date().getFullYear();
        },
        { message: "Year must be between 1900 and current year" },
      )
      .optional(),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)")
      .refine(
        (val) => {
          const year = Number(val.split("-")[0]);
          return year >= 1900 && year <= new Date().getFullYear();
        },
        { message: "Year must be between 1900 and current year" },
      )
      .optional(),
    description: z
      .string()
      .max(200, "Description must be at most 200 characters")
      .optional(),
  })
  .refine(
    (data) =>
      !data.end_date ||
      !data.start_date ||
      new Date(data.end_date) >= new Date(data.start_date),
    { message: "End date cannot be before start date", path: ["end_date"] },
  );

export const profileInfoSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.email("Invalid email address"),
  phone: z.string().regex(/^\+977\d{10}$/, "Phone number must start with +977"),

  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional(),

  years_of_experience: z.object({
    lower: z.number(),
    upper: z.number().nullable().optional(),
  }),

  location: z.string().min(4).max(100),
  bio: z.string().max(500).optional(),

  education: z.array(EducationSchema).optional(),
  skills: z.array(skillsSchema).optional(),
  experiences: z.array(experienceSchema).optional(),

  linkedin_url: z.string().url().optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")),

  resume: z.any().optional(),
  profile: z.any().optional(),
});

export type ProfileInfoFormValues = z.infer<typeof profileInfoSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

//Employer Profile
export const employerProfileSchema = z.object({
  company_name: z.string().min(2).max(50),
  email: z.email("Invalid email address"),
  company_logo: z.union([z.instanceof(File), z.string()]).optional(),
  bio: z.string().max(500).optional(),
  location: z
    .string()
    .min(4, "Location must be at least 4 characters")
    .max(100),
  contact: z
    .string()
    .min(1, "Contact number is required")
    .regex(
      /^\+977\d{10}$/,
      "Phone number must start with +977 and contain exactly 10 digits",
    ),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
  website_url: z.string().url().optional().or(z.literal("")),
  facebook_url: z.string().url().optional().or(z.literal("")),
});

export type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;

// Full validation for "Post"
export const postJobSchemaPost = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  job_type: z.string().min(1, "Job type is required"),
  work_mode: z.string().min(1, "Work mode is required"),
  years_of_experience: z.object({
    lower: z.number().min(0, "Minimum experience is required"),
    upper: z.number().optional(),
  }),
  salary_range: z
    .object({
      lower: z.string().min(1, "Lower salary is required"),
      upper: z.string().min(1, "Upper salary is required"),
    })
    .refine((data) => Number(data.lower) <= Number(data.upper), {
      message: "Lower salary cannot be greater than upper salary",
      path: ["upper"],
    }),
  expire_days: z.string().min(1, "Expire days is required"),
  skills: z.object({
    add: z.array(z.string()).min(1, "At least one skill is required"),
    remove: z.array(z.string()),
  }),
});

// Draft schema: everything optional except title
export const postJobSchema = z
  .object({
    action: z.enum(["post", "draft"]),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    location: z.string().optional(),
    job_type: z.string().optional(),
    work_mode: z.string().optional(),
    years_of_experience: z.object({
      lower: z.string().optional(),
      upper: z.string().optional(),
    }),
    salary_range: z.object({
      lower: z.string().optional(),
      upper: z.string().optional(),
    }),
    expire_days: z.string().optional(),
    skills: z.object({
      add: z.array(z.string()).optional(),
      remove: z.array(z.string()).optional(),
    }),
  })
  .superRefine((data, ctx) => {
    // Only validate if action is "post"
    if (data.action === "post") {
      // Description is required
      if (!data.description || data.description.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Description is required",
          path: ["description"],
        });
      }

      // Location is required
      if (!data.location || data.location.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Location is required",
          path: ["location"],
        });
      }

      // Job type is required
      if (!data.job_type || data.job_type.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Job type is required",
          path: ["job_type"],
        });
      }

      // Work mode is required
      if (!data.work_mode || data.work_mode.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Work mode is required",
          path: ["work_mode"],
        });
      }

      // Years of experience - lower bound required
      if (
        !data.years_of_experience.lower ||
        data.years_of_experience.lower.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Experience level is required",
          path: ["years_of_experience"],
        });
      }

      // Salary range - both bounds required
      if (!data.salary_range.lower || data.salary_range.lower.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Lower salary is required",
          path: ["salary_range", "lower"],
        });
      }

      if (!data.salary_range.upper || data.salary_range.upper.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Upper salary is required",
          path: ["salary_range", "upper"],
        });
      }

      // Expire days is required
      if (!data.expire_days || data.expire_days.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Expire days is required",
          path: ["expire_days"],
        });
      }

      // Skills - at least one required
      if (!data.skills.add || data.skills.add.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one skill is required",
          path: ["skills", "add"],
        });
      }
    }

    // Validate ranges (applies to both post and draft)
    // Salary range validation
    if (data.salary_range.lower && data.salary_range.upper) {
      const lower = Number(data.salary_range.lower);
      const upper = Number(data.salary_range.upper);

      if (!isNaN(lower) && !isNaN(upper) && lower > upper) {
        ctx.addIssue({
          code: "custom",
          message: "Lower salary cannot be greater than upper salary",
          path: ["salary_range", "upper"],
        });
      }
    }
  });

export type postJobFormValues = z.infer<typeof postJobSchema>;
