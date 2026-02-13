"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Clock, RotateCcw, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldError, FieldLabel, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  usePasswordResetRequestMutation,
  usePasswordResetVerifyOTPMutation,
  usePasswordResetSetNewMutation,
} from "@/lib/api";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;
const OTP_EXPIRY = 120; // 2 minutes in seconds
const RESEND_COOLDOWN = 30; // seconds after resend

// Email form schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Password form schema
const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

type ForgotPasswordStep = "email" | "otp" | "newPassword";

export function ForgotPassword() {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState<string | null>(null);

  // OTP timer states
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY);
  const isExpired = timeLeft <= 0;
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // API mutations
  const [passwordResetRequest, { isLoading: isRequestLoading }] =
    usePasswordResetRequestMutation();
  const [passwordResetVerifyOTP, { isLoading: isVerifyLoading }] =
    usePasswordResetVerifyOTPMutation();
  const [passwordResetSetNew, { isLoading: isSetNewLoading }] =
    usePasswordResetSetNewMutation();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Focus first OTP box on OTP step
  useEffect(() => {
    if (currentStep === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [currentStep]);

  // OTP expiry timer
  useEffect(() => {
    if (currentStep !== "otp" || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, currentStep]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const timerColour =
    isExpired ? "text-red-500"
    : timeLeft <= 30 ? "text-orange-500"
    : "text-[#4A70A9]";

  const focusInput = (i: number) => inputRefs.current[i]?.focus();

  const handleChange = (index: number, value: string) => {
    if (isExpired) return;
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError(null);
    if (digit && index < OTP_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (isExpired) return;
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        const next = [...otp];
        next[index - 1] = "";
        setOtp(next);
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      focusInput(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isExpired) return;
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => {
      next[i] = c;
    });
    setOtp(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  // Step 1: Submit email and request OTP
  const handleEmailSubmit = async (data: EmailFormValues) => {
    setSuccessMessage(null);
    setOtpError(null);

    try {
      await passwordResetRequest({ email: data.email }).unwrap();

      // Save email and move to OTP step
      setUserEmail(data.email);
      setCurrentStep("otp");
      setTimeLeft(OTP_EXPIRY);
      setResendCooldown(0);
    } catch (err: any) {
      const serverMsg =
        err?.data?.email?.[0] ??
        err?.data?.detail ??
        err?.data?.message ??
        "Failed to send OTP. Please try again.";
      emailForm.setError("email", { message: serverMsg });
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (isExpired) return;
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setOtpError("Please enter all 6 digits.");
      return;
    }

    setOtpError(null);
    try {
      await passwordResetVerifyOTP({
        email: userEmail,
        otp_code: code,
      }).unwrap();

      // Move to new password step
      setCurrentStep("newPassword");
    } catch (err: any) {
      const serverMsg =
        err?.data?.otp_code?.[0] ??
        err?.data?.detail ??
        err?.data?.message ??
        "Invalid or expired OTP. Please try again.";
      setOtpError(serverMsg);
      setOtp(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    }
  };

  // Step 3: Set new password
  const handleSetNewPassword = async (data: PasswordFormValues) => {
    setSuccessMessage(null);
    setOtpError(null);

    try {
      await passwordResetSetNew({
        email: userEmail,
        new_password: data.newPassword,
        confirm_new_password: data.confirmPassword,
      }).unwrap();

      setSuccessMessage("Password reset successfully!");
      passwordForm.reset();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const serverMsg =
        err?.data?.new_password?.[0] ??
        err?.data?.confirm_new_password?.[0] ??
        err?.data?.detail ??
        err?.data?.message ??
        "Failed to reset password. Please try again.";
      passwordForm.setError("newPassword", { message: serverMsg });
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setOtpError(null);
    try {
      await passwordResetRequest({ email: userEmail }).unwrap();
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(OTP_EXPIRY);
      setResendCooldown(RESEND_COOLDOWN);
      focusInput(0);
    } catch (err: any) {
      const serverMsg =
        err?.data?.detail ??
        err?.data?.message ??
        "Failed to resend OTP. Please try again.";
      setOtpError(serverMsg);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError(null);
    setTimeLeft(OTP_EXPIRY);
    setResendCooldown(0);
  };

  const filled = otp.join("").length;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-[#4A70A9] uppercase">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Enter Email */}
          {currentStep === "email" && (
            <form
              className="flex flex-col gap-5"
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
            >
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Enter your email address and we'll send you an OTP to reset
                  your password.
                </p>
              </div>

              <FieldGroup>
                <Controller
                  name="email"
                  control={emailForm.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Email Address</FieldLabel>
                      <Input placeholder="abc@gmail.com" {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                variant="brand"
                className="w-full uppercase"
                disabled={isRequestLoading}
              >
                {isRequestLoading ? "Sending OTP..." : "Send OTP"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBackToLogin}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {currentStep === "otp" && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              {/* Heading */}
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#4A70A9] uppercase">
                  Enter OTP
                </h2>
                <p className="text-muted-foreground text-sm max-w-xs">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-foreground">
                    {userEmail}
                  </span>
                  . Enter it below to verify your identity.
                </p>
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-1.5 text-sm font-medium ${timerColour}`}
              >
                <Clock size={14} />
                {isExpired ?
                  <span>Code expired — please resend to get a new one</span>
                : <span>Code expires in {formatTime(timeLeft)}</span>}
              </div>

              {/* OTP boxes */}
              <div className="flex gap-2 sm:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={isExpired}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={[
                      "w-11 h-14 sm:w-12 sm:h-14 rounded-lg border-2 text-center text-xl font-bold",
                      "focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]",
                      "transition-colors caret-transparent",
                      isExpired ?
                        "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : otpError ? "border-red-400 bg-red-50 text-red-600"
                      : digit ? "border-[#4A70A9] bg-blue-50 text-[#4A70A9]"
                      : "border-gray-200 bg-white text-gray-800",
                    ].join(" ")}
                  />
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 -mt-2">
                {Array(OTP_LENGTH)
                  .fill(null)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={[
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        !isExpired && i < filled ?
                          "bg-[#4A70A9]"
                        : "bg-gray-200",
                      ].join(" ")}
                    />
                  ))}
              </div>

              {/* Error */}
              {otpError && !isExpired && (
                <p className="text-sm text-red-500 -mt-1">{otpError}</p>
              )}

              {/* Verify button */}
              <Button
                variant="brand"
                className="uppercase w-full max-w-xs"
                onClick={handleVerifyOTP}
                disabled={isVerifyLoading || filled < OTP_LENGTH || isExpired}
              >
                {isVerifyLoading ? "Verifying..." : "Verify & Continue"}
              </Button>

              {/* Resend */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Didn&apos;t receive the code?</span>
                {resendCooldown > 0 ?
                  <span className="text-[#4A70A9] font-medium">
                    Resend in {resendCooldown}s
                  </span>
                : <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isRequestLoading}
                    className="flex items-center gap-1 text-[#4A70A9] font-medium hover:underline disabled:opacity-50"
                  >
                    <RotateCcw size={13} />
                    {isRequestLoading ? "Sending..." : "Resend"}
                  </button>
                }
              </div>

              {/* Back */}
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-xs text-muted-foreground hover:underline"
              >
                ← Change Email
              </button>
            </div>
          )}

          {/* Step 3: Set New Password */}
          {currentStep === "newPassword" && (
            <form
              className="flex flex-col gap-5"
              onSubmit={passwordForm.handleSubmit(handleSetNewPassword)}
            >
              {successMessage && (
                <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
                  {successMessage}
                  <br />
                  Redirecting to login...
                </div>
              )}

              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Set New Password</h2>
                <p className="text-sm text-gray-600">
                  Enter your new password below.
                </p>
              </div>

              <FieldGroup>
                {/* New password */}
                <Controller
                  name="newPassword"
                  control={passwordForm.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>New Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="**********"
                          type={showNew ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowNew((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full p-0.5"
                        >
                          {showNew ?
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

                {/* Confirm password */}
                <Controller
                  name="confirmPassword"
                  control={passwordForm.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Confirm New Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="**********"
                          type={showConfirm ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowConfirm((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full p-0.5"
                        >
                          {showConfirm ?
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
              </FieldGroup>

              <Button
                type="submit"
                variant="brand"
                className="w-full uppercase"
                disabled={isSetNewLoading}
              >
                {isSetNewLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBackToLogin}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
