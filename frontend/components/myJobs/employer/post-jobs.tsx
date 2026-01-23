"use client";
import { postJobSchema, postJobFormValues } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { usePostJobsMutation } from "@/lib/api";
import { ExperienceLevelValue } from "@/helper/yearsOfExperience";

type Skill = { id: number; name: string };
type PostJobsProps = {
  skills: Skill[];
};

export function PostJobs({ skills }: PostJobsProps) {
  const [postJob] = usePostJobsMutation();
  const [loadingAction, setLoadingAction] = useState<"post" | "draft" | null>(
    null,
  );

  const form = useForm<postJobFormValues>({
    resolver: zodResolver(postJobSchema),
    mode: "onSubmit",
    defaultValues: {
      action: "post",
      title: "",
      description: "",
      job_type: "",
      work_mode: "",
      location: "",
      years_of_experience: {
        lower: undefined,
        upper: undefined,
      },
      salary_range: {
        lower: "",
        upper: "",
      },
      expire_days: "",
      skills: {
        add: [],
        remove: [],
      },
    },
  });

  const buildFormData = (
    values: postJobFormValues,
    action: "post" | "draft",
  ) => {
    const formData = new FormData();

    formData.append("title", String(values.title));
    formData.append("description", String(values.description || ""));
    formData.append("location", String(values.location));
    formData.append("job_type", String(values.job_type));
    formData.append("work_mode", String(values.work_mode));
    formData.append("expire_days", String(values.expire_days));
    formData.append("status", action === "post" ? "active" : "draft");

    formData.append(
      "years_of_experience",
      JSON.stringify({
        bounds: "[)",
        lower: values.years_of_experience.lower
          ? Number(values.years_of_experience.lower)
          : null,
        upper: values.years_of_experience.upper
          ? Number(values.years_of_experience.upper)
          : null,
      }),
    );

    formData.append(
      "salary_range",
      JSON.stringify({
        lower: values.salary_range.lower
          ? Number(values.salary_range.lower)
          : null,
        upper: values.salary_range.upper
          ? Number(values.salary_range.upper)
          : null,
      }),
    );

    formData.append(
      "skills",
      JSON.stringify({
        add: values.skills.add || [],
        remove: values.skills.remove || [],
      }),
    );

    return formData;
  };

  const handleSubmitForm = async (
    values: postJobFormValues,
    action: "post" | "draft",
  ) => {
    setLoadingAction(action);

    const formData = buildFormData(values, action);

    try {
      const result = await postJob(formData).unwrap();
      alert(
        `${
          action === "post"
            ? "Job has been posted successfully"
            : "Job has been saved as draft"
        }`,
      );
      form.reset();
    } catch (err) {
      console.error("Error submitting job:", err);
      alert("Failed to submit job. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  const [skillInput, setSkillInput] = useState("");
  const [showSkillsList, setShowSkillsList] = useState(false);

  const allSkills = (skills || []).map((s) => s.name);
  const addedSkills = form.watch("skills.add") || [];

  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !addedSkills.includes(skill),
  );

  const jobTypes = [
    { label: "Intern", value: "intern" },
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
    { label: "Contract", value: "contract" },
  ];

  const workMode = [
    { label: "Onsite", value: "onsite" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
  ];

  return (
    <div>
      <div className="flex justify-between mb-10 mt-2">
        <div>
          <h1 className="text-3xl font-bold">Post Job</h1>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
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
                        className={`w-full border rounded-md px-4 py-2 ${
                          !field.value ? "text-gray-400" : "text-black"
                        }`}
                      >
                        <option value="" disabled hidden>
                          Select job type
                        </option>
                        {jobTypes.map((type) => (
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

            <Card className="border-[#4A70A9] rounded-md mb-6 md:mb-0">
              <CardHeader>
                <CardTitle className="text-2xl">Years of Experience</CardTitle>

                <Controller
                  name="years_of_experience"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <select
                        className={`w-full border rounded-md px-4 py-2 ${
                          !field.value?.lower && !field.value?.upper
                            ? "text-gray-400"
                            : "text-black"
                        }`}
                        value={
                          field.value?.lower && field.value?.upper
                            ? `${field.value.lower}-${field.value.upper}`
                            : ""
                        }
                        onChange={(e) => {
                          if (e.target.value === "") {
                            field.onChange({ lower: "", upper: "" });
                            return;
                          }

                          const selected = ExperienceLevelValue.find(
                            (opt) =>
                              `${opt.lower}-${opt.upper ?? "null"}` ===
                              e.target.value,
                          );

                          if (selected) {
                            field.onChange({
                              lower: String(selected.lower),
                              upper:
                                selected.upper !== undefined
                                  ? String(selected.upper)
                                  : "",
                            });
                          }
                        }}
                      >
                        <option value="">Select experience</option>

                        {ExperienceLevelValue.map((opt) => (
                          <option
                            key={`${opt.lower}-${opt.upper || "null"}`}
                            value={`${opt.lower}-${opt.upper || "null"}`}
                          >
                            {opt.label}
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
                        className={`w-full border rounded-md px-4 py-2 ${
                          !field.value ? "text-gray-400" : "text-black"
                        }`}
                      >
                        <option value="" disabled hidden>
                          Select work mode
                        </option>
                        {workMode.map((type) => (
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
                      className="absolute -top-2 -right-2 cursor-pointer text-red-600 bg-white rounded-full"
                      onClick={() => {
                        const currentAdd = form.getValues("skills.add") || [];
                        form.setValue(
                          "skills.add",
                          currentAdd.filter((s) => s !== skill),
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        );
                      }}
                    />
                  </div>
                ))}
              </div>

              <Field className="relative">
                <Input
                  placeholder="Type a skill"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setShowSkillsList(true);
                  }}
                  onFocus={() => setShowSkillsList(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSkillsList(false), 200);
                  }}
                />

                {showSkillsList && skillInput && filteredSkills.length > 0 && (
                  <div className="absolute z-50 mt-4 w-full border bg-white shadow-md max-h-40 overflow-y-auto rounded-md">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          form.setValue("skills.add", [...addedSkills, skill], {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setSkillInput("");
                          setShowSkillsList(false);
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </Field>
              {form.formState.errors.skills?.add && (
                <FieldError
                  errors={[form.formState.errors.skills.add]}
                  className="mt-2"
                />
              )}
            </CardContent>
          </Card>

          <Card className="mt-5 border-[#4A70A9] rounded-md mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Offered Salary</CardTitle>
              <Controller
                name="salary_range"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
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
                      <div>
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
                      placeholder="Enter days"
                      min={1}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardHeader>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={"brand"}
              disabled={loadingAction === "post"}
              onClick={() => {
                form.setValue("action", "post", { shouldValidate: false });
                form.handleSubmit((values) =>
                  handleSubmitForm(values, "post"),
                )();
              }}
            >
              {loadingAction === "post" ? "Posting..." : "Post"}
            </Button>

            <Button
              type="button"
              variant={"outline"}
              disabled={loadingAction === "draft"}
              onClick={() => {
                form.setValue("action", "draft", { shouldValidate: false });
                form.handleSubmit((values) =>
                  handleSubmitForm(values, "draft"),
                )();
              }}
            >
              {loadingAction === "draft" ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
