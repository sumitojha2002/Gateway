"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/app/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function ChangePassword() {
  const session = useSession();
  const role = session.data?.user?.role;
  console.log("change password profile role: ", role);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  return (
    <div className="w-full">
      <div className="flex justify-between mb-10 mt-2">
        <div>
          <h1 className="text-3xl font-bold">Change Password</h1>
        </div>
      </div>
      <Card className="w-full">
        <CardContent>
          <form className="flex flex-col gap-5">
            <div className="flex justify-between md:flex-row flex-col"></div>
            <Controller
              name={"currentPassword"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Current Password</FieldLabel>
                  <Input {...field} placeholder="password" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={"newPassword"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <Input {...field} placeholder={"password"} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={"confirmPassword"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Re-enter Password</FieldLabel>
                  <Input {...field} placeholder={"password"} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div>
              <Button variant={"brand"} className="w-full">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
