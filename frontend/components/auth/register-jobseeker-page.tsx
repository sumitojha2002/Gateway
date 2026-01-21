"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  RegisterJobSeekerFormValues,
  registerJobSeekerSchema,
} from "@/app/schemas/auth";
import { useRegisterMutation } from "@/lib/api";

function RegisterJobSeekerPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState<"job_seeker" | "employer">("job_seeker");
  const [register, { isLoading, error }] = useRegisterMutation();

  const form = useForm<RegisterJobSeekerFormValues>({
    resolver: zodResolver(registerJobSeekerSchema),
    shouldUnregister: true,
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  });
  console.log(error);
  const onSubmit = async (data: RegisterJobSeekerFormValues) => {
    try {
      console.log("hello");
      const result = await register({
        email: data.email,
        role: "job_seeker",
        full_name: data.fullname,
        password: data.password,
        confirm_password: data.confirmPassword,
      }).unwrap();
      console.log("Registration Result:", result);
      // const result = await signIn("credentials", {
      //     redirect: false,
      //     email: data.email,
      //     password: data.password,
      // });
      // if(result?.error){
      //     console.error("Registration Error:", result.error);
      //     form.setError("email", { message: "Registration failed. Try again." });
      // }
      router.push("/login");
    } catch (err) {
      console.error("Registration Exception:", err);
      form.setError("email", { message: "Registration failed. Try again." });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl text-center text-[#4A70A9] uppercase">
            Register
          </CardTitle>
          <div className="flex justify-around mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setRole("job_seeker")}
                variant={role === "job_seeker" ? "brand" : "ghost"}
              >
                Register as Job Seeker
              </Button>
              <Link
                href="/register-employer"
                className={buttonVariants({ variant: "ghost" })}
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
            name="fullname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input placeholder="Full Name" {...field} />
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
                    variant={"ghost"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm w-7 h-7 rounded-full p-0.5"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Add confirm password field */}
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
                    variant={"ghost"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm w-7 h-7 rounded-full p-0.5"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* ... */}
          <Button
            variant={"brand"}
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
                  variant={"link"}
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

export default RegisterJobSeekerPage;
