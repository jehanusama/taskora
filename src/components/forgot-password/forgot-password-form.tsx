"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { useForgotPassword } from "@/hooks/use-auth";
import { notify } from "@/lib/notify";
import { routes } from "@/config/routes";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof forgotPasswordSchema>, unknown, z.output<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.output<typeof forgotPasswordSchema>) => {
    await forgotPassword.mutateAsync(data.email);
    setSubmittedEmail(data.email);
    setSubmitted(true);
    notify.success("Reset Link Sent", `Check your inbox at ${data.email}.`);
  };

  const isPending = forgotPassword.isPending || isSubmitting;

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex size-12 mx-auto items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Recovery email dispatched</h4>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            We sent instructions to <strong>{submittedEmail}</strong>. Follow the link in the email to set a new password.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full text-xs"
          render={<Link href={routes.login()} />}
          nativeButton={false}
        >
          <ArrowLeft className="size-3.5 mr-1.5" /> Back to Sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="forgot-email" className="text-xs font-semibold">
          Account Email
        </Label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="name@company.com"
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
          className="h-9"
        />
        {errors.email && (
          <p className="text-[11px] text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-9 gap-2">
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Send Reset Link
      </Button>

      <div className="text-center pt-2">
        <Link
          href={routes.login()}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="size-3" /> Back to Sign in
        </Link>
      </div>
    </form>
  );
}

