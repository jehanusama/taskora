"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/use-auth";
import { notify } from "@/lib/notify";
import { Loader2, KeyRound } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof loginSchema>, unknown, z.output<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleFillDemo = () => {
    setValue("email", "alex.morgan@taskora.io");
    setValue("password", "taskora2026!");
    notify.info(
      "Demo Credentials Injected",
      "Signed in as Alex Morgan (Admin)"
    );
  };

  const onSubmit = async (data: z.output<typeof loginSchema>) => {
    await login.mutateAsync(data.email);
    notify.success(
      "Welcome back!",
      "Successfully authenticated into Taskora."
    );
    router.push("/dashboard");
  };

  const isPending = login.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Demo Credentials Quick-Fill Button */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
        <p className="text-xs text-muted-foreground mb-2">
          Evaluating Taskora? Click below to populate demo credentials:
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillDemo}
          className="w-full text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
        >
          <KeyRound className="size-3.5" />
          Fill Demo Account (Alex Morgan)
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-xs font-semibold">
          Work Email
        </Label>
        <Input
          id="login-email"
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-xs font-semibold">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          aria-invalid={Boolean(errors.password)}
          className="h-9"
        />
        {errors.password && (
          <p className="text-[11px] text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-9 gap-2">
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Sign In to Workspace
      </Button>
    </form>
  );
}

