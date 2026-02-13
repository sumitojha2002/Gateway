"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  RegisterEmployerFormValues,
  registerEmployerSchema,
} from "@/app/schemas/auth";
import { useRegisterMutation } from "@/lib/api";
import { OtpVerification } from "./otp-verification";

export function RegisterEmployerPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<RegisterEmployerFormValues>({
    resolver: zodResolver(registerEmployerSchema),
    shouldUnregister: true,
    defaultValues: {
      email: "",
      companyName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterEmployerFormValues) => {
    try {
      await register({
        email: data.email,
        role: "employer",
        company_name: data.companyName,
        password: data.password,
        confirm_password: data.confirmPassword,
      }).unwrap();

      // Show OTP screen
      setRegisteredEmail(data.email);
    } catch (err) {
      console.error("Registration Exception:", err);
      form.setError("email", { message: "Registration failed. Try again." });
    }
  };

  // ── OTP screen ──────────────────────────────────────────────────────────────
  if (registeredEmail) {
    return (
      <OtpVerification
        email={registeredEmail}
        onBack={() => setRegisteredEmail(null)}
      />
    );
  }

  // ── Registration form ───────────────────────────────────────────────────────
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl text-center text-[#4A70A9] uppercase">
            Register
          </CardTitle>
          <div className="flex justify-around mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/register-jobseeker"
                className={buttonVariants({ variant: "ghost" })}
                passHref
              >
                Register as Job Seeker
              </Link>
              <Link
                href="/register-employer"
                className={buttonVariants({ variant: "brand" })}
                passHref
              >
                Register as Employer
              </Link>
            </div>
          </div>
        </CardHeader>

        <FieldGroup className="p-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input placeholder="abc@gmail.com" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="companyName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Company Name</FieldLabel>
                <Input placeholder="Company Name" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <Input
                    placeholder="**********"
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full p-0.5"
                  >
                    {showPassword ?
                      <EyeOff size={16} />
                    : <Eye size={16} />}
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    placeholder="**********"
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full p-0.5"
                  >
                    {showConfirmPassword ?
                      <EyeOff size={16} />
                    : <Eye size={16} />}
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            variant="brand"
            className="uppercase m-4"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>

          <Field>
            <div className="flex justify-end">
              <p>
                I already have an account.
                <Button
                  className="text-[#4A70A9] pl-1"
                  variant="link"
                  type="button"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              </p>
            </div>
          </Field>
        </FieldGroup>
      </Card>
    </form>
  );
}
