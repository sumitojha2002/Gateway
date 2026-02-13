"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoginFormValues, loginSchema } from "@/app/schemas/auth";
import { Card, CardHeader, CardTitle } from "../ui/card";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    // <-- Use LoginFormValues type
    resolver: zodResolver(loginSchema),
    shouldUnregister: true,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("--- STARTING SUBMISSION ---", data);
    // Note: 'credentials' is the provider name we used in NextAuth config
    const result = await signIn("credentials", {
      redirect: false, // Prevents automatic redirect on failure
      email: data.email,
      password: data.password,
      // You may need to pass a specific role identifier if your Django API requires it
      // role: 'employer', // Example
    });
    console.log("NextAuth signIn Result:", result);

    if (result?.error) {
      // 5. Handle Login Failure (e.g., incorrect credentials)
      // toast.error("Login failed. Check your email and password.");
      console.error("Login Error:", result.error);
      form.setError("email", { message: "Invalid email or password." });
    } else if (result?.ok) {
      // 6. Handle Login Success
      // Redirect the user to their dashboard or home page
      router.push("/");
    }
  };

  return (
    // <-- 7. Attach onSubmit handler to the form
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="z-10">
        <Card className="z-10">
          <CardHeader>
            <CardTitle className="text-4xl text-center text-[#4A70A9] uppercase">
              Login
            </CardTitle>
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm  w-7 h-7 rounded-full p-0.5"
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
            <Field>
              <div className="flex justify-end">
                <Link href="/forget-password">Forgot Password?</Link>
              </div>
            </Field>
            {/* The Button is now the submit button for the form */}
            <Button
              variant={"brand"}
              className="uppercase"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging In..." : "Login"}
            </Button>
            <Field>
              <div className="flex justify-end">
                <p>
                  Don't have an account yet?
                  <Button
                    className="text-[#4A70A9] pl-1"
                    variant={"link"}
                    type="button"
                    onClick={() => router.push("/register-jobseeker")}
                  >
                    Register
                  </Button>
                </p>
              </div>
            </Field>
          </FieldGroup>
        </Card>
      </div>
    </form>
  );
}
