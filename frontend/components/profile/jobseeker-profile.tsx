"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import Profile from "@/public/user_profile.jpg";
import {
  profileInfoSchema,
  ProfileInfoFormValues,
  experienceSchema,
  EducationSchema,
  skillsSchema,
} from "@/app/schemas/auth";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { ZodError } from "zod";
import { X } from "lucide-react";
//calender
import { DatePickerField } from "../calander/date-picker-filed";
import {
  useDeleteJobSeekerEducationMutation,
  useDeleteJobSeekerExperienceMutation,
  useUpdateJobSeekerProfileMutation,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { ExperienceLevelValue } from "@/helper/yearsOfExperience";

interface JobSeekerProfileProps {
  user: any;
  skillList: any;
}

type DraftFields = {
  newEducation: Partial<Education>;
  newSkill: Partial<Skill>;
  newExperience: Partial<Experience>;
};

interface Education {
  level: string;
  institution: string;
  start_date: string;
  end_date?: string;
}

interface PersistedEducation extends Education {
  id: number;
}

interface PersistedExperience extends Experience {
  id: number;
}
interface Skill {
  id: number;
  name: string;
}

interface Experience {
  work_place: string;
  role: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

function JobSeekerProfile({ user, skillList }: JobSeekerProfileProps) {
  const router = useRouter();
  //RTK query:
  const [updateProfile, { isLoading, isError, isSuccess }] =
    useUpdateJobSeekerProfileMutation();
  const [deleteEducation] = useDeleteJobSeekerEducationMutation();
  const [deleteExperience] = useDeleteJobSeekerExperienceMutation();

  const [edit, setEdit] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user.profile_pic_url || null,
  );
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const parsedYears =
    user.years_of_experience ?
      (() => {
        if (typeof user.years_of_experience === "object") {
          return {
            lower: Number(user.years_of_experience.lower),
            upper:
              user.years_of_experience.upper != null ?
                Number(user.years_of_experience.upper)
              : null,
          };
        }
        try {
          const p = JSON.parse(user.years_of_experience);
          //console.log("lower: ", p.lower);
          //console.log("higher: ", p.higher);

          return {
            lower: Number(p.lower),
            upper: p.upper != null ? Number(p.upper) : undefined,
          };
        } catch {
          return { lower: undefined, upper: undefined };
        }
      })()
    : { lower: undefined, upper: undefined };

  const educationLevels = [
    "High School",
    "Diploma",
    "Bachelor's",
    "Master's",
    "PhD",
    "Other",
  ];
  //console.log("Hello", user);
  const form = useForm<ProfileInfoFormValues & DraftFields>({
    resolver: zodResolver(profileInfoSchema) as unknown as Resolver<
      ProfileInfoFormValues & DraftFields
    >,
    defaultValues: {
      username: user.user_name || "",
      email: user.email || "",
      phone: user.contact || "",
      dob: user.dob || "",
      years_of_experience: parsedYears,
      location: user.location || "",
      bio: user.bio || "",
      education: user.education || [],
      skills: user.skills || [],
      experiences: user.experiences || [],
      newExperience: {
        work_place: "",
        role: "",
        start_date: "",
        end_date: "",
        description: "",
      },
      newEducation: {
        level: "",
        institution: "",
        start_date: "",
        end_date: "",
      },
      newSkill: {
        name: "",
      },
      linkedin_url: user.linkedin_url || "",
      portfolio_url: user.portfolio_url || "",
      resume: user.cv_url || "",
      profile: user.profile_pic_url || "",
    },
  });
  const [originalValues, setOriginalValues] =
    useState<ProfileInfoFormValues | null>(null);
  const educationFields: (Education | PersistedEducation)[] =
    form.watch("education") ?? [];
  const experienceFields: (Experience | PersistedExperience)[] =
    form.watch("experiences") ?? [];

  useEffect(() => {
    if (!user) return;

    const initialEducation = user.education?.map((edu: any) => ({
      ...edu,
      start_date: edu.start_date?.toString() ?? "",
      end_date: edu.end_date?.toString() ?? "",
    }));

    const initialExperiences = user.experiences?.map((exp: any) => ({
      ...exp,
      start_date: exp.start_date?.toString() ?? "",
      end_date: exp.end_date?.toString() ?? "",
    }));

    const initialValues: ProfileInfoFormValues = {
      username: user.user_name || "",
      email: user.email || "",
      phone: user.contact || "",
      dob: user.dob || "",
      years_of_experience: parsedYears || "",
      location: user.location || "",
      bio: user.bio || "",
      education: initialEducation || [],
      experiences: initialExperiences || [],
      skills: user.skills || [],
      newEducation: {
        level: "",
        institution: "",
        start_date: "",
        end_date: "",
      },
      newExperience: {
        work_place: "",
        role: "",
        start_date: "",
        end_date: "",
        description: "",
      },
      newSkill: { name: "" },
      linkedin_url: user.linkedin_url || "",
      portfolio_url: user.portfolio_url || "",
      resume: null,
      profile: null,
    };

    setOriginalValues(initialValues);
    form.reset(initialValues);
  }, [user]);

  async function handleSaveChanges() {
    //console.log("handleSaveChanges called!");

    if (!originalValues) return;

    const updatedValues = form.getValues();
    const formData = new FormData();

    // Helper function to check if value changed
    const hasChanged = (field: keyof ProfileInfoFormValues) => {
      return (
        JSON.stringify(originalValues[field]) !==
        JSON.stringify(updatedValues[field])
      );
    };

    // ALWAYS send required fields (even if unchanged)
    const lower = updatedValues.years_of_experience.lower;
    const upper = updatedValues.years_of_experience.upper;
    const yearsPayload = [lower, upper === undefined ? null : upper];
    formData.append("years_of_experience", JSON.stringify(yearsPayload));

    // Only append changed optional fields
    if (hasChanged("username")) {
      formData.append("username", updatedValues.username ?? "");
    }

    if (hasChanged("phone")) {
      formData.append("contact", updatedValues.phone ?? "");
    }

    if (hasChanged("dob")) {
      formData.append("dob", updatedValues.dob ?? "");
    }

    if (hasChanged("location")) {
      formData.append("location", updatedValues.location ?? "");
    }

    if (hasChanged("bio")) {
      formData.append("bio", updatedValues.bio ?? "");
    }

    if (hasChanged("linkedin_url")) {
      formData.append("linkedin_url", updatedValues.linkedin_url ?? "");
    }

    if (hasChanged("portfolio_url")) {
      formData.append("portfolio_url", updatedValues.portfolio_url ?? "");
    }

    // Profile picture - ONLY if new file uploaded (File object, not URL string)
    if (updatedValues.profile instanceof File) {
      formData.append("profile_pic", updatedValues.profile);
    }
    // Don't send anything if it's still the old URL

    // Resume - ONLY if new file uploaded (File object, not URL string)
    if (updatedValues.resume instanceof File) {
      formData.append("cv", updatedValues.resume);
    }
    // Don't send anything if it's still the old URL

    // Skills - only if changed
    if (hasChanged("skills")) {
      const originalSkillNames = (originalValues.skills ?? []).map(
        (s: Skill) => s.name,
      );
      const currentSkillNames = (updatedValues.skills ?? []).map(
        (s: Skill) => s.name,
      );

      const skillsPayload = {
        add: currentSkillNames.filter(
          (name) => !originalSkillNames.includes(name),
        ),
        remove: originalSkillNames.filter(
          (name) => !currentSkillNames.includes(name),
        ),
      };

      if (skillsPayload.add.length > 0 || skillsPayload.remove.length > 0) {
        formData.append("skills", JSON.stringify(skillsPayload));
      }
    }

    // Experiences - only if changed
    if (hasChanged("experiences")) {
      formData.append(
        "experiences_data",
        JSON.stringify(updatedValues.experiences) ?? [],
      );
    }

    // Education - only if changed
    if (hasChanged("education")) {
      formData.append(
        "education_data",
        JSON.stringify(updatedValues.education) ?? [],
      );
    }

    // Check if form is dirty before submitting
    if (!form.formState.isDirty) {
      alert("No changes detected");
      return;
    }

    try {
      const result = await updateProfile(formData).unwrap();
      //console.log("Profile updated:", result);

      setOriginalValues({
        ...updatedValues,
        skills: updatedValues.skills?.map((s: Skill) => ({ ...s })) ?? [],
      });
      setEdit(false);
      alert("Profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to update profile:", err);

      const backendErrors = err?.data?.data || err?.error?.data?.data || {};
      if (backendErrors && typeof backendErrors === "object") {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const message =
            Array.isArray(messages) ? messages[0] : String(messages);
          form.setError(field as keyof ProfileInfoFormValues, {
            type: "server",
            message,
          });
        });
      }

      if (!Object.keys(backendErrors).length) {
        alert(
          err?.data?.message ||
            err?.error?.data?.message ||
            "Failed to update profile",
        );
      }
    }
  }
  function hasId<T extends object>(item: T): item is T & { id: number } {
    return "id" in item && typeof (item as any).id === "number";
  }

  async function handleEducationDelete(id: number) {
    try {
      await deleteEducation(id).unwrap();
      const education = (form.getValues("education") ??
        []) as PersistedEducation[];
      const remaining = education.filter((edu) => edu.id !== id);
      alert(id + "deleted successfully!");
      form.setValue("education", remaining ?? [], { shouldDirty: true });
    } catch (err) {
      alert("Failed to delete education");
    }
  }

  async function handleExperienceDelete(id: number) {
    try {
      await deleteExperience(id).unwrap();

      const experiences = (form.getValues("experiences") ??
        []) as PersistedExperience[];
      const remaining = experiences.filter((exp) => exp.id !== id);

      alert(id + " deleted successfully!");
      form.setValue("experiences", remaining, { shouldDirty: true });
    } catch (err) {
      alert("Failed to delete experience");
    }
  }

  const skillsFields =
    useWatch({
      control: form.control,
      name: "skills",
    }) ?? [];

  const addExperience = () => {
    const draft = form.getValues("newExperience");

    try {
      const parsed = experienceSchema.parse(draft);
      const existing = (form.getValues("experiences") ?? []) as Experience[];
      const isDuplicate = existing.some(
        (exp) =>
          exp.work_place.toLowerCase() === parsed.work_place.toLowerCase() &&
          exp.role.toLowerCase() === parsed.role.toLowerCase() &&
          exp.start_date === parsed.start_date,
      );

      if (isDuplicate) {
        form.setError("newExperience.work_place", {
          message: "This experience already exists",
        });
        return;
      }

      form.setValue("experiences", [...existing, parsed], {
        shouldDirty: true,
      });

      form.resetField("newExperience");
    } catch (error) {
      if (error instanceof ZodError) {
        error.issues.forEach((issue) => {
          const fieldPath = issue.path.join(".");
          form.setError(`newExperience.${fieldPath}` as any, {
            message: issue.message,
          });
        });
      }
    }
  };

  //Skills
  const [showSkillsList, setShowSkillsList] = useState(false);
  const addSkill = () => {
    const draft = form.getValues("newSkill");
    const existing = (form.getValues("skills") ?? []) as {
      id: number;
      name: string;
    }[];

    const isDuplicate = existing.some(
      (s) => s.name.toLowerCase() === draft.name?.toLowerCase(),
    );

    if (isDuplicate) {
      form.setError("newSkill.name", {
        message: "Skill already exists",
      });
      return;
    }

    const parsed = skillsSchema.parse(draft);

    form.setValue("skills", [...existing, parsed], {
      shouldDirty: true,
    });

    form.resetField("newSkill");
  };

  const removeSkill = (indexToRemove: number) => {
    const currentSkills = form.getValues("skills") ?? [];
    const updatedSkills = currentSkills.filter(
      (_, index) => index !== indexToRemove,
    );
    form.setValue("skills", updatedSkills, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addEducation = () => {
    const draft = form.getValues("newEducation");

    try {
      const parsed = EducationSchema.parse(draft);

      const existing = (form.getValues("education") ?? []) as Education[];

      const isDuplicate = existing.some(
        (edu) =>
          edu.institution.toLowerCase() === parsed.institution.toLowerCase() &&
          edu.level.toLowerCase() === parsed.level.toLowerCase() &&
          edu.start_date === parsed.start_date,
      );

      if (isDuplicate) {
        form.setError("newEducation.institution", {
          message: "This education already exists",
        });
        return;
      }

      form.setValue("education", [...existing, parsed], {
        shouldDirty: true,
      });

      form.resetField("newEducation");
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          const fieldPath = issue.path.join(".");
          form.setError(`newEducation.${fieldPath}` as any, {
            message: issue.message,
          });
        });
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSaveChanges)}>
      <div>
        <div className="flex justify-between mb-10 mt-2">
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
          </div>
          <div>
            {edit ?
              <div>
                <Button
                  type="submit"
                  variant="link"
                  disabled={!form.formState.isDirty || isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    if (!originalValues) return; // guard
                    form.reset(originalValues); // reset to the last saved values
                    setEdit(false);
                    // Clear file inputs
                    if (resumeInputRef.current)
                      resumeInputRef.current.value = "";
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    router.refresh();
                  }}
                >
                  Cancel
                </Button>
              </div>
            : <Button variant={"link"} onClick={() => setEdit(true)}>
                Edit
              </Button>
            }
          </div>
        </div>
        <Card className="w-full">
          <CardContent>
            <div className="flex justify-between md:flex-row flex-col">
              <div className="flex-row align-middle md:flex md:align-baseline">
                <div className="flex justify-center">
                  <Image
                    src={profileImage || Profile}
                    alt="Profile"
                    width={160}
                    height={160}
                    unoptimized
                    className="w-40 h-40 object-cover border rounded-md border-[#4A70A9]"
                  />
                </div>
                <div className="m-4 flex justify-center">
                  <Input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      if (file.size > 2 * 1024 * 1024) {
                        alert("Image must be less than 2MB");
                        return;
                      }

                      setProfileImage(URL.createObjectURL(file));
                      form.setValue("profile", file, { shouldDirty: true });
                    }}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    variant={"outline"}
                    className="border-[#4A70A9] py-5 px-12.5"
                    disabled={!edit}
                  >
                    Upload new photo
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="mt-4 mb-5 bg-[#4A70A9]" />
            <Card className=" border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Personal Info</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className=" grid grid-cols-1 gap-3 md:grid-cols-3 mb-3">
                  <div>
                    <Controller
                      name="username"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Username</FieldLabel>
                          <Input {...field} disabled />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Email</FieldLabel>
                          <Input {...field} disabled />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="phone"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Phone</FieldLabel>
                          <Input
                            value={field.value || "+977"}
                            disabled={!edit}
                            onChange={(e) => {
                              let value = e.target.value;

                              // Force +977
                              if (!value.startsWith("+977")) {
                                value = "+977";
                              }

                              // Allow only digits after +977
                              value =
                                "+977" +
                                value.slice(4).replace(/\D/g, "").slice(0, 10);

                              field.onChange(value);
                            }}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex">
                      <Controller
                        name="years_of_experience"
                        control={form.control}
                        render={({ field }) => {
                          const selectedLabel =
                            ExperienceLevelValue.find(
                              (opt) =>
                                opt.lower === field.value?.lower &&
                                opt.upper === field.value?.upper,
                            )?.label || "";

                          return (
                            <Field>
                              <FieldLabel>Experience Level</FieldLabel>

                              <select
                                value={selectedLabel}
                                disabled={!edit}
                                className={`w-full border rounded-md -mt-1 px-3 py-1.5
            ${!edit ? "bg-white text-[#838383]" : "bg-white text-black"}`}
                                onChange={(e) => {
                                  const selected = ExperienceLevelValue.find(
                                    (opt) => opt.label === e.target.value,
                                  );

                                  if (!selected) return;

                                  field.onChange({
                                    lower: selected.lower,
                                    upper: selected.upper,
                                  });
                                }}
                              >
                                <option value="">Select experience</option>
                                {ExperienceLevelValue.map((opt) => (
                                  <option key={opt.label} value={opt.label}>
                                    <div className="flex justify-between">
                                      <p>{opt.label}</p>
                                    </div>
                                  </option>
                                ))}
                              </select>
                            </Field>
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel className="mb-2">Date of Birth</FieldLabel>
                    <DatePickerField
                      name="dob"
                      control={form.control}
                      minDate={new Date(1900, 0, 1)}
                      maxDate={new Date()}
                      disabled={!edit}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-5 border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Location</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <Input {...field} disabled={!edit} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="mt-5 border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Bio</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="bio"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <Textarea {...field} disabled={!edit} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="mt-5 border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Education</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {educationFields.map((edu, index) => (
                  <React.Fragment key={"id" in edu ? edu.id : index}>
                    <div>
                      {edit && "id" in edu && (
                        <div className="flex  justify-end">
                          <X
                            size={20}
                            strokeWidth={3}
                            className="cursor-pointer  text-gray-500"
                            onClick={() => handleEducationDelete(edu.id)}
                          />
                        </div>
                      )}
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-2 md:grid-cols-4 mb-3"
                      >
                        <Controller
                          name={`education.${index}.institution`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel>Name</FieldLabel>
                              <Input {...field} disabled={!edit} />
                              {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`education.${index}.level`}
                          control={form.control}
                          render={({ field, fieldState }) => {
                            const currentValue = field.value || ""; // fallback to empty string
                            return (
                              <Field>
                                <FieldLabel>Level</FieldLabel>
                                <select
                                  {...field}
                                  value={currentValue}
                                  disabled={!edit}
                                  className={`w-full border rounded-md px-2 py-1 
                                  ${
                                    !edit ?
                                      "bg-white text-[#838383] "
                                    : "bg-white text-black"
                                  }
                                  `}
                                >
                                  <option value="">Select level</option>
                                  {educationLevels.map((level) => (
                                    <option key={level} value={level}>
                                      {level}
                                    </option>
                                  ))}
                                </select>
                                {fieldState.error && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            );
                          }}
                        />

                        <Controller
                          name={`education.${index}.start_date`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel>Start Year</FieldLabel>
                              <Input
                                {...field}
                                type="number"
                                min={1900}
                                max={new Date().getFullYear()}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)} // keep as string
                                disabled={!edit}
                              />
                              {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name={`education.${index}.end_date`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel>End Year</FieldLabel>
                              <Input
                                {...field}
                                type="number"
                                min={1900}
                                max={new Date().getFullYear()}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)} // keep as string
                                disabled={!edit}
                              />
                              {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </div>

                    {edit && (
                      <div>
                        <Separator className="mt-8 mb-8" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
                <div hidden={!edit} className="mb-5 mt-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Controller
                      name="newEducation.institution"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Name</FieldLabel>
                          <Input {...field} disabled={!edit} />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="newEducation.level"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Level</FieldLabel>
                          <select
                            {...field}
                            disabled={!edit}
                            className="w-full border rounded-md px-2 py-1"
                          >
                            <option value="">Select level</option>
                            {educationLevels.map((level) => (
                              <option key={level}>{level}</option>
                            ))}
                          </select>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="newEducation.start_date"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Start Year</FieldLabel>
                          <Input {...field} disabled={!edit} />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="newEducation.end_date"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>End Year</FieldLabel>
                          <Input {...field} disabled={!edit} />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  hidden={!edit}
                  className="w-full"
                  variant={"brand"}
                  onClick={addEducation}
                >
                  Add Education
                </Button>
              </CardContent>
            </Card>
            <Card className="mt-5 border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Experience</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {experienceFields.map((exp, index) => (
                  <div key={"id" in exp ? exp.id : index} className="mb-7">
                    {edit && "id" in exp && (
                      <div className="flex  justify-end">
                        <X
                          size={20}
                          strokeWidth={3}
                          className="cursor-pointer  text-gray-500"
                          onClick={() => handleExperienceDelete(exp.id)}
                        />
                      </div>
                    )}
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-2 md:grid-cols-4 mb-3"
                    >
                      <Controller
                        name={`experiences.${index}.work_place`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel>Company Name</FieldLabel>
                            <Input {...field} disabled={!edit} />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`experiences.${index}.role`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel>Role</FieldLabel>
                            <Input {...field} disabled={!edit} />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />{" "}
                      <DatePickerField
                        name={`experiences.${index}.start_date`}
                        control={form.control}
                        disabled={!edit}
                        label="Start Date"
                        maxDate={new Date()}
                      />
                      <DatePickerField
                        disabled={!edit}
                        name={`experiences.${index}.end_date`}
                        control={form.control}
                        label="End Date"
                        maxDate={new Date()}
                      />
                    </div>
                    <Controller
                      name={`experiences.${index}.description`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <Textarea {...field} disabled={!edit} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    {edit && (
                      <div>
                        <Separator className="mt-8 -[#]" />
                      </div>
                    )}
                  </div>
                ))}
                <div hidden={!edit} className="mb-5 mt-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Controller
                      name="newExperience.work_place"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Company Name</FieldLabel>
                          <Input {...field} disabled={!edit} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="newExperience.role"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Role</FieldLabel>
                          <Input {...field} disabled={!edit} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />{" "}
                    <DatePickerField
                      name="newExperience.start_date"
                      control={form.control}
                      label="Start Date"
                      maxDate={new Date()}
                    />
                    <DatePickerField
                      name="newExperience.end_date"
                      control={form.control}
                      label="End Date"
                      maxDate={new Date()}
                    />
                  </div>
                  <Controller
                    name="newExperience.description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea {...field} disabled={!edit} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  hidden={!edit}
                  className="w-full"
                  onClick={addExperience}
                  variant={"brand"}
                >
                  Add Experience
                </Button>
              </CardContent>
            </Card>
            <Card className="mt-5 border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Skills</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex  flex-wrap gap-2 ">
                  {skillsFields.map((skill: Skill, index: number) => (
                    <div
                      key={index}
                      className="border-[#4A70A9] relative  justify-center pl-10 pr-10 pt-2 pb-2 rounded-sm m-2  border font-semibold  flex"
                    >
                      <span>{skill.name}</span>
                      {edit && (
                        <X
                          size={19}
                          strokeWidth={4}
                          className="ml-2 cursor-pointer text-red-600 absolute -top-2 -right-2"
                          onClick={() => removeSkill(index)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div hidden={!edit} className="mb-5 mt-5">
                  <Controller
                    name="newSkill.name"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const value = field.value ?? "";

                      // Filter the skillList based on what user typed
                      const filteredSkills = skillList.filter((skill: any) =>
                        skill.name.toLowerCase().includes(value.toLowerCase()),
                      );

                      return (
                        <Field className="relative">
                          <FieldLabel>New Skill</FieldLabel>

                          <Input
                            {...field}
                            disabled={!edit}
                            placeholder="Type a skill"
                            autoComplete="off"
                            onInput={() => setShowSkillsList(true)}
                          />

                          {edit &&
                            showSkillsList &&
                            value.length > 0 &&
                            filteredSkills.length > 0 && (
                              <div className="absolute z-50 mt-16 w-full border bg-white shadow-md max-h-40 overflow-y-auto">
                                {filteredSkills.map((skill: any) => (
                                  <div
                                    key={skill.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-muted"
                                    onClick={() => {
                                      // Pass both id and name when selected
                                      form.setValue("newSkill", {
                                        id: skill.id,
                                        name: skill.name,
                                      });
                                      setShowSkillsList(false);
                                    }}
                                  >
                                    {skill.name}
                                  </div>
                                ))}
                              </div>
                            )}

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                <Button
                  type="button"
                  variant={"brand"}
                  hidden={!edit}
                  className="w-full"
                  onClick={addSkill}
                >
                  Add Skill
                </Button>
              </CardContent>
            </Card>
            <Card className="mt-5 border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Social Links</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Controller
                    name="linkedin_url"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>LinkedIn</FieldLabel>
                        <Input
                          {...field}
                          disabled={!edit}
                          value={field.value ?? ""}
                          placeholder="https://linkedin.com/in/username"
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="portfolio_url"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Portfolio / Website</FieldLabel>
                        <Input
                          {...field}
                          disabled={!edit}
                          value={field.value ?? ""}
                          placeholder="https://yourwebsite.com"
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mt-5 border-[#4A70A9]">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl">Resume</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Hidden Input */}
                <Input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx" // optional: restrict to resume files
                  ref={resumeInputRef} // use a ref
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setResumeFileName(file.name);
                    form.setValue("resume", file, { shouldDirty: true });
                  }}
                />

                {/* Button triggers input click */}
                <Button
                  type="button"
                  variant={"brand"}
                  className="w-full "
                  disabled={!edit}
                  onClick={() => resumeInputRef.current?.click()}
                >
                  Upload Resume
                </Button>
                {(resumeFileName || user.cv_url) && (
                  <p className="mt-2 text-sm text-gray-600">
                    Resume:{" "}
                    <a
                      href={user.cv_url} // or URL.createObjectURL(file) if uploaded
                      download // <- triggers download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 underline"
                    >
                      {resumeFileName || "Download Resume"}
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

export default JobSeekerProfile;
