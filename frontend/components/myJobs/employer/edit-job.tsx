"use client";
import { postJobFormValues, postJobSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ArrowLeft } from "lucide-react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateJobMutation, usePatchJobMutation } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { ExperienceLevelValue } from "@/helper/yearsOfExperience";

const CONSTANTS = {
  JOB_STATUS: {
    ACTIVE: "active",
    DRAFT: "draft",
  } as const,

  JOB_TYPES: [
    { label: "Intern", value: "intern" },
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
    { label: "Contract", value: "contract" },
  ] as const,

  WORK_MODES: [
    { label: "Onsite", value: "onsite" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
  ] as const,

  MESSAGES: {
    DRAFT_SAVED: "Draft has been saved successfully",
    JOB_POSTED: "Job has been posted successfully",
    SUBMIT_FAILED: "Failed to submit job. Please try again.",
    NO_CHANGES: "No changes to save",
    FIX_ERRORS: "Please fix the errors in the form",
  },

  RANGE_BOUNDS: "[)" as const,
};

export type JobData = {
  id: number;
  title: string;
  description: string;
  company_name: string;
  location: string;
  email: string;
  job_type: string;
  work_mode: string;
  status: string;
  experience_level: string;
  years_of_experience: string;
  salary_range: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  skills: Skill[];
};

type Skill = { id: number; name: string };

type EditJobProps = {
  skills: Skill[];
  data: JobData;
};

type RangeValue = {
  lower: string;
  upper: string;
};

function parseRange(
  value?: string | null | object,
  defaultValue: RangeValue = { lower: "", upper: "" }
): RangeValue {
  if (!value) return defaultValue;

  // Handle object (already parsed PostgreSQL range)
  if (typeof value === "object") {
    const rangeObj = value as {
      lower?: number | string;
      upper?: number | string | null;
      bounds?: string;
    };
    return {
      lower: rangeObj.lower != null ? String(rangeObj.lower) : "",
      upper: rangeObj.upper != null ? String(rangeObj.upper) : "",
    };
  }

  // Handle string (needs JSON parsing)
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return {
        lower: parsed.lower != null ? String(parsed.lower) : "",
        upper: parsed.upper != null ? String(parsed.upper) : "",
      };
    } catch (error) {
      console.warn("Failed to parse range value:", value, error);
      return defaultValue;
    }
  }

  return defaultValue;
}
function getExpireDays(expiresAt?: string): string {
  if (!expiresAt) return "";

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) return "0";

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return String(diffDays);
}

function navigateUpLevels(pathname: string, levels: number): string {
  const segments = pathname.split("/").filter(Boolean);
  const newSegments = segments.slice(0, Math.max(0, segments.length - levels));
  return "/" + newSegments.join("/");
}

export function EditJob({ skills, data }: EditJobProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [updateJob] = useUpdateJobMutation();
  const [patchJob] = usePatchJobMutation();
  const [loadingAction, setLoadingAction] = useState<"post" | "draft" | null>(
    null
  );

  const [skillInput, setSkillInput] = useState("");
  const [showSkillsList, setShowSkillsList] = useState(false);
  const skillsDropdownRef = useRef<HTMLDivElement>(null);

  const form = useForm<postJobFormValues>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      action: "post",
      title: data.title ?? "",
      description: data.description ?? "",
      job_type: data.job_type ?? "",
      work_mode: data.work_mode ?? "",
      location: data.location ?? "",
      expire_days: getExpireDays(data.expires_at),
      years_of_experience: parseRange(data.years_of_experience),
      salary_range: parseRange(data.salary_range),
      skills: {
        add: data.skills?.map((s) => s.name) ?? [],
        remove: [],
      },
    },
  });

  const isDirty = form.formState.isDirty;

  // Reset form when data changes
  useEffect(() => {
    if (!data) return;

    form.reset({
      action: "post",
      title: data.title ?? "",
      description: data.description ?? "",
      job_type: data.job_type ?? "",
      work_mode: data.work_mode ?? "",
      location: data.location ?? "",
      expire_days: getExpireDays(data.expires_at),
      years_of_experience: parseRange(data.years_of_experience),
      salary_range: parseRange(data.salary_range),
      skills: {
        add: data.skills?.map((s) => s.name) ?? [],
        remove: [],
      },
    });
  }, [data, form]);

  // Close skills dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        skillsDropdownRef.current &&
        !skillsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSkillsList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation
  const goBackTwoSteps = useCallback(() => {
    const newPath = navigateUpLevels(pathname, 2);
    router.push(newPath);
  }, [pathname, router]);

  // Skills logic
  const allSkills = useMemo(() => skills.map((s) => s.name), [skills]);
  const addedSkills = form.watch("skills.add") || [];

  const filteredSkills = useMemo(
    () =>
      allSkills.filter(
        (skill) =>
          skill.toLowerCase().includes(skillInput.toLowerCase()) &&
          !addedSkills.includes(skill)
      ),
    [allSkills, skillInput, addedSkills]
  );

  const removeSkill = useCallback(
    (skillToRemove: string) => {
      const currentAdd = form.getValues("skills.add") || [];
      form.setValue(
        "skills.add",
        currentAdd.filter((s) => s !== skillToRemove),
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );
    },
    [form]
  );

  const addSkill = useCallback(
    (skillToAdd: string) => {
      form.setValue("skills.add", [...addedSkills, skillToAdd], {
        shouldDirty: true,
        shouldValidate: true,
      });
      setSkillInput("");
      setShowSkillsList(false);
    },
    [form, addedSkills]
  );

  // Build FormData for PUT (full update)
  const buildFormData = useCallback(
    (values: postJobFormValues, action: "post" | "draft") => {
      const formData = new FormData();

      formData.append("title", String(values.title));
      formData.append("description", String(values.description));
      formData.append("location", String(values.location));
      formData.append("job_type", String(values.job_type));
      formData.append("work_mode", String(values.work_mode));
      formData.append("expire_days", String(values.expire_days));
      formData.append(
        "status",
        action === "post"
          ? CONSTANTS.JOB_STATUS.ACTIVE
          : CONSTANTS.JOB_STATUS.DRAFT
      );

      formData.append(
        "years_of_experience",
        JSON.stringify({
          bounds: CONSTANTS.RANGE_BOUNDS,
          lower: values.years_of_experience?.lower ?? null,
          upper: values.years_of_experience?.upper ?? null,
        })
      );

      formData.append(
        "salary_range",
        JSON.stringify({
          lower: values.salary_range?.lower ?? null,
          upper: values.salary_range?.upper ?? null,
        })
      );

      formData.append(
        "skills",
        JSON.stringify({
          add: (values.skills.add ?? []).map(String),
          remove: (values.skills.remove ?? []).map(String),
        })
      );

      return formData;
    },
    []
  );

  // Build FormData for PATCH (partial update)
  const buildPatchFormData = useCallback(
    (values: postJobFormValues) => {
      const formData = new FormData();
      const dirtyFields = form.formState.dirtyFields;

      // Always add title
      formData.append("title", String(values.title));

      if (dirtyFields.description) {
        formData.append("description", String(values.description));
      }

      if (dirtyFields.location) {
        formData.append("location", String(values.location));
      }

      if (dirtyFields.job_type) {
        formData.append("job_type", String(values.job_type));
      }

      if (dirtyFields.work_mode) {
        formData.append("work_mode", String(values.work_mode));
      }

      if (dirtyFields.expire_days) {
        formData.append("expire_days", String(values.expire_days));
      }

      if (dirtyFields.years_of_experience) {
        const lower = values.years_of_experience?.lower
          ? Number(values.years_of_experience.lower)
          : null;
        const upper = values.years_of_experience?.upper
          ? Number(values.years_of_experience.upper)
          : null;

        const yearsOfExp = [lower, upper];
        formData.append("years_of_experience", JSON.stringify(yearsOfExp));
      }

      if (dirtyFields.salary_range) {
        const lower = values.salary_range?.lower || null;
        const upper = values.salary_range?.upper || null;

        formData.append(
          "salary_range",
          JSON.stringify({
            lower: lower,
            upper: upper,
          })
        );
      }

      if (dirtyFields.skills) {
        const originalSkills = data.skills?.map((s) => s.name) ?? [];
        const currentSkills = values.skills.add ?? [];
        const addedSkills = currentSkills.filter(
          (skill) => !originalSkills.includes(skill)
        );
        const removedSkills = originalSkills.filter(
          (skill) => !currentSkills.includes(skill)
        );

        if (addedSkills.length > 0 || removedSkills.length > 0) {
          formData.append(
            "skills",
            JSON.stringify({
              add: addedSkills,
              remove: removedSkills,
            })
          );
        }
      }

      formData.append("status", CONSTANTS.JOB_STATUS.DRAFT);

      return formData;
    },
    [form.formState.dirtyFields, data.skills]
  );
  // Submit handler
  const handleSubmitForm = async (
    values: postJobFormValues,
    action: "post" | "draft"
  ) => {
    setLoadingAction(action);

    try {
      if (action === "draft") {
        // Check if there are any changes using isDirty
        if (!form.formState.isDirty) {
          setLoadingAction(null);
          return;
        }

        const formData = buildPatchFormData(values);

        await patchJob({
          id: data.id,
          body: formData,
        }).unwrap();

        // Reset form state to mark as pristine
        form.reset(values, { keepValues: true });
        alert("Draft job saved successfully.");
      } else {
        const formData = buildFormData(values, action);

        await updateJob({
          id: data.id,
          body: formData,
        }).unwrap();

        alert("Job posted successfully.");
        router.push("/employer/my-jobs/draft");
      }
    } catch (err: any) {
      console.error("Error submitting job:", err);
      alert("Error while submitting job.");
      // Handle backend validation errors
      const backendErrors = err?.data?.data || err?.error?.data?.data || {};

      if (Object.keys(backendErrors).length > 0) {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const message = Array.isArray(messages)
            ? messages[0]
            : String(messages);

          form.setError(field as any, {
            type: "server",
            message,
          });
        });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div className="flex flex-col gap-4">
          <ArrowLeft
            size={20}
            className="cursor-pointer"
            onClick={goBackTwoSteps}
          />
          <h1 className="text-3xl font-bold">Edit Job</h1>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Job Title */}
          <Card className="border-[#4A70A9] rounded-md mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Job Title</CardTitle>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input
                      {...field}
                      placeholder="Enter job title"
                      className="rounded-md p-5 font-semibold"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card className="border-[#4A70A9] rounded-md mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Job Description</CardTitle>
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Textarea placeholder="Describe about job" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardHeader>
          </Card>

          {/* Location & Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
            <Card className="border-[#4A70A9] rounded-md mb-6 md:mb-0">
              <CardHeader>
                <CardTitle className="text-2xl">Location</CardTitle>
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <Input {...field} placeholder="Enter location" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardHeader>
            </Card>

            <Card className="border-[#4A70A9] rounded-md mb-6 md:mb-0">
              <CardHeader>
                <CardTitle className="text-2xl">Job Type</CardTitle>
                <Controller
                  name="job_type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <select
                        {...field}
                        className={`w-full border rounded-md px-4 py-1 ${
                          !field.value ? "text-gray-400" : "text-black"
                        }`}
                      >
                        <option value="" disabled hidden>
                          Select job type
                        </option>
                        {CONSTANTS.JOB_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardHeader>
            </Card>

            {/* Years of Experience */}
            {/* Years of Experience */}
            <Card className="border-[#4A70A9] rounded-md mb-6 md:mb-0">
              <CardHeader>
                <CardTitle className="text-2xl">Years of Experience</CardTitle>

                <Controller
                  name="years_of_experience"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    // Helper to create a normalized select value
                    const getSelectValue = (lower?: string, upper?: string) => {
                      if (!lower) return "";
                      // Treat empty string as null for comparison
                      const normalizedUpper = upper || "null";
                      return `${lower}-${normalizedUpper}`;
                    };

                    const currentSelectValue = getSelectValue(
                      field.value?.lower,
                      field.value?.upper
                    );

                    return (
                      <Field>
                        <select
                          className={`w-full border rounded-md px-4 py-2 ${
                            !currentSelectValue ? "text-gray-400" : "text-black"
                          }`}
                          value={currentSelectValue}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              field.onChange({ lower: "", upper: "" });
                              return;
                            }

                            const [lower, upper] = e.target.value.split("-");
                            field.onChange({
                              lower: lower,
                              upper: upper === "null" ? "" : upper,
                            });
                          }}
                        >
                          <option value="">Select experience</option>

                          {ExperienceLevelValue.map((opt) => {
                            const optValue = `${opt.lower}-${
                              opt.upper ?? "null"
                            }`;
                            return (
                              <option key={optValue} value={optValue}>
                                {opt.label}
                              </option>
                            );
                          })}
                        </select>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </CardHeader>
            </Card>

            {/* Work Mode */}
            <Card className="border-[#4A70A9] rounded-md mb-6 md:mb-0">
              <CardHeader>
                <CardTitle className="text-2xl">Work Mode</CardTitle>
                <Controller
                  name="work_mode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <select
                        {...field}
                        className={`w-full border rounded-md px-4 py-1 ${
                          !field.value ? "text-gray-400" : "text-black"
                        }`}
                      >
                        <option value="" disabled hidden>
                          Select work mode
                        </option>
                        {CONSTANTS.WORK_MODES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardHeader>
            </Card>
          </div>

          {/* Skills */}
          <Card className="border-[#4A70A9] rounded-md mb-6 md:mt-5">
            <CardHeader>
              <CardTitle className="text-2xl">Skills</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {addedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="relative px-4 py-2 border rounded-md font-semibold"
                  >
                    {skill}
                    <X
                      size={16}
                      className="absolute -top-2 -right-2 cursor-pointer text-red-600"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>

              <Field className="relative" ref={skillsDropdownRef}>
                <Input
                  placeholder="Type a skill"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setShowSkillsList(true);
                  }}
                  onFocus={() => setShowSkillsList(true)}
                />

                {showSkillsList && skillInput && filteredSkills.length > 0 && (
                  <div className="absolute z-50 mt-9 w-full border bg-white shadow-md max-h-40 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="px-3 py-2 cursor-pointer hover:bg-muted"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </Field>
            </CardContent>
          </Card>

          {/* Offered Salary */}
          <Card className="mt-5 border-[#4A70A9] rounded-md mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Offered Salary</CardTitle>
              <Controller
                name="salary_range"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="Lower"
                          type="number"
                          min={0}
                          value={field.value?.lower ?? ""}
                          onChange={(e) => {
                            field.onChange({
                              ...field.value,
                              lower: e.target.value,
                            });
                          }}
                        />
                        {form.formState.errors.salary_range?.lower && (
                          <FieldError
                            errors={[
                              {
                                message:
                                  form.formState.errors.salary_range.lower
                                    .message || "Lower salary is required",
                              },
                            ]}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <Input
                          placeholder="Upper"
                          type="number"
                          min={0}
                          value={field.value?.upper ?? ""}
                          onChange={(e) => {
                            field.onChange({
                              ...field.value,
                              upper: e.target.value,
                            });
                          }}
                        />
                        {form.formState.errors.salary_range?.upper && (
                          <FieldError
                            errors={[
                              {
                                message:
                                  form.formState.errors.salary_range.upper
                                    .message || "Upper salary is required",
                              },
                            ]}
                          />
                        )}
                      </div>
                    </div>
                  </Field>
                )}
              />
            </CardHeader>
          </Card>

          {/* Expire Days */}
          <Card className="mt-5 border-[#4A70A9] rounded-md mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Expire Days</CardTitle>
              <Controller
                name="expire_days"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input
                      type="number"
                      {...field}
                      min={0}
                      placeholder="Enter days"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardHeader>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={"brand"}
              onClick={() => {
                form.setValue("action", "post", { shouldValidate: false });
                form.handleSubmit((values) =>
                  handleSubmitForm(values, "post")
                )();
              }}
              disabled={loadingAction !== null}
            >
              {loadingAction === "post" ? "Posting..." : "Post"}
            </Button>

            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                form.setValue("action", "draft", { shouldValidate: false });
                form.handleSubmit((values) =>
                  handleSubmitForm(values, "draft")
                )();
              }}
              disabled={loadingAction !== null || !isDirty}
            >
              {loadingAction === "draft" ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
