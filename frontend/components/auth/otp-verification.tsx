"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { ShieldCheck, RotateCcw, Clock } from "lucide-react";
import {
  useSendOTPRegisterMutation,
  useResendOTPRegisterMutation,
} from "@/lib/api";

const OTP_LENGTH = 6;
const OTP_EXPIRY = 120; // 2 minutes in seconds
const RESEND_COOLDOWN = 30; // seconds after resend

interface OtpVerificationProps {
  email: string;
  onBack?: () => void;
}

export function OtpVerification({ email, onBack }: OtpVerificationProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);

  // 2-min expiry countdown
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY);
  const isExpired = timeLeft <= 0;

  // 30s resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [sendOTP, { isLoading: isVerifying }] = useSendOTPRegisterMutation();
  const [resendOTP] = useResendOTPRegisterMutation();

  // Focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // OTP expiry timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

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
    setError(null);
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

  const handleVerify = async () => {
    if (isExpired) return;
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    setError(null);
    try {
      const result = await sendOTP({ email, otp: code }).unwrap();
      if (!result?.success) throw new Error(result?.message ?? "Invalid OTP.");

      alert("Registration successful! Redirecting to login...");
      router.push("/login");
    } catch (err: any) {
      setError(err?.message ?? "Invalid OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      await resendOTP({ email }).unwrap();
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(OTP_EXPIRY); // reset 2-min timer
      setResendCooldown(RESEND_COOLDOWN);
      focusInput(0);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const filled = otp.join("").length;

  return (
    <Card className="lg:md-25">
      <CardContent className="flex flex-col items-center gap-5 py-10 px-8 text-center">
        {/* Icon
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
          <ShieldCheck className="text-[#4A70A9]" size={32} />
        </div> */}

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#4A70A9] uppercase">
            Enter OTP
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Enter it below to activate your account.
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
                : error ? "border-red-400 bg-red-50 text-red-600"
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
                  !isExpired && i < filled ? "bg-[#4A70A9]" : "bg-gray-200",
                ].join(" ")}
              />
            ))}
        </div>

        {/* Error */}
        {error && !isExpired && (
          <p className="text-sm text-red-500 -mt-1">{error}</p>
        )}

        {/* Verify button */}
        <Button
          variant="brand"
          className="uppercase w-full max-w-xs"
          onClick={handleVerify}
          disabled={isVerifying || filled < OTP_LENGTH || isExpired}
        >
          {isVerifying ? "Verifying..." : "Verify & Continue"}
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
              onClick={handleResend}
              className="flex items-center gap-1 text-[#4A70A9] font-medium hover:underline"
            >
              <RotateCcw size={13} />
              Resend
            </button>
          }
        </div>

        {/* Back */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-muted-foreground hover:underline"
          >
            ← Back to registration
          </button>
        )}
      </CardContent>
    </Card>
  );
}
