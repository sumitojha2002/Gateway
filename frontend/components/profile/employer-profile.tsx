"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import Profile from "@/public/user_profile.jpg";
import {
  EmployerProfileFormValues,
  employerProfileSchema,
} from "@/app/schemas/auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";

import { useUpdateEmployerProfileMutation } from "@/lib/api";
import { useRouter } from "next/navigation";

interface EmployerProfileProps {
  user: any;
}

function EmployerProfile({ user }: EmployerProfileProps) {
  const router = useRouter();
  //RTK query:
  console.log(user.company_logo_url);
  const [updateEmployer, { isLoading }] = useUpdateEmployerProfileMutation();
  const [edit, setEdit] = useState(false);
  const [companyImage, setCompanyImage] = useState<string | null>(
    user.company_logo_url || null,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<EmployerProfileFormValues>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      company_name: user.company_name || "",
      email: user.email || "",
      company_logo: user.company_logo_url || "",
      location: user.location || "",
      facebook_url: user.facebook_url || "",
      linkedin_url: user.linkedin_url || "",
      instagram_url: user.instagram_url || "",
      website_url: user.website_url || "",
      bio: user.bio || "",
      contact: user.contact || "",
    },
  });
  const [originalValues, setOriginalValues] =
    useState<EmployerProfileFormValues | null>(null);

  useEffect(() => {
    const initialValues: EmployerProfileFormValues = {
      company_name: user.company_name || "",
      email: user.email || "",
      company_logo: user.company_logo_url || "",
      location: user.location || "",
      facebook_url: user.facebook_url || "",
      linkedin_url: user.linkedin_url || "",
      instagram_url: user.instagram_url || "",
      website_url: user.website_url || "",
      bio: user.bio || "",
      contact: user.contact || "",
    };

    setOriginalValues(initialValues);
    form.reset(initialValues);
  }, [user, form]);

  useEffect(() => {
    return () => {
      if (companyImage?.startsWith("blob:")) {
        URL.revokeObjectURL(companyImage);
      }
    };
  }, [companyImage]);

  async function handleSaveChanges() {
    console.log("original", originalValues);
    if (!originalValues) return;

    const updatedValues = form.getValues();
    const formData = new FormData();

    formData.append("contact", updatedValues.contact ?? "");
    formData.append("location", updatedValues.location ?? "");
    formData.append("bio", updatedValues.bio ?? "");
    formData.append("linkedin_url", updatedValues.linkedin_url ?? "");
    formData.append("instagram_url", updatedValues.instagram_url ?? "");
    formData.append("website_url", updatedValues.website_url ?? "");
    formData.append("facebook_url", updatedValues.facebook_url ?? "");

    //company logo
    if (updatedValues.company_logo instanceof File) {
      formData.append("company_logo", updatedValues.company_logo);
    }

    try {
      const result = await updateEmployer(formData).unwrap();
      console.log("Profile updated:", result);

      setEdit(false);
      alert("Profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to update profile:", err);

      const backendErrors = err?.data?.data || err?.error?.data?.data;

      // Field-level errors
      if (backendErrors && typeof backendErrors === "object") {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const message =
            Array.isArray(messages) ? messages[0] : String(messages);

          form.setError(field as keyof EmployerProfileFormValues, {
            type: "server",
            message,
          });
        });
      }

      // General error
      if (backendErrors?.detail || backendErrors?.message) {
        alert(backendErrors.detail || backendErrors.message);
      }
    }
  }

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
                  variant="link"
                  disabled={!form.formState.isDirty || isLoading}
                  type="submit"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    if (!originalValues) return; // guard
                    form.reset(originalValues); // reset to the last saved values
                    setEdit(false);

                    // Clear file inputs
                    if (fileInputRef.current) fileInputRef.current.value = "";
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
                    src={companyImage || Profile}
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
                      const previewUrl = URL.createObjectURL(file);
                      setCompanyImage(previewUrl);

                      form.setValue("company_logo", file, {
                        shouldDirty: true,
                      });
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
                      name="company_name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Company Name</FieldLabel>
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
                      name="contact"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Contact</FieldLabel>
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
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
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
                    name="website_url"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Website</FieldLabel>
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
                  <Controller
                    name="instagram_url"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Website</FieldLabel>
                        <Input
                          {...field}
                          disabled={!edit}
                          value={field.value ?? ""}
                          placeholder="https://instagram.com"
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="facebook_url"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Website</FieldLabel>
                        <Input
                          {...field}
                          disabled={!edit}
                          value={field.value ?? ""}
                          placeholder="https://facebook.com"
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
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

export default EmployerProfile;
