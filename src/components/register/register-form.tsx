"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/use-auth";
import { toast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    await registerUser.mutateAsync({ name: data.name, email: data.email });
    toast.create({
      title: "Account Created!",
      description: "Welcome to Taskora. Your workspace is ready.",
      type: "success",
    });
    router.push("/dashboard");
  };

  const isPending = registerUser.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="reg-name" className="text-xs font-semibold">
          Full Name
        </Label>
        <Input
          id="reg-name"
          placeholder="e.g. Alex Morgan"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
          className="h-9"
        />
        {errors.name && (
          <p className="text-[11px] text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-email" className="text-xs font-semibold">
          Work Email
        </Label>
        <Input
          id="reg-email"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="reg-password" className="text-xs font-semibold">
            Password
          </Label>
          <Input
            id="reg-password"
            type="password"
            placeholder="At least 8 chars"
            {...register("password")}
            aria-invalid={Boolean(errors.password)}
            className="h-9"
          />
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-confirm" className="text-xs font-semibold">
            Confirm Password
          </Label>
          <Input
            id="reg-confirm"
            type="password"
            placeholder="Repeat password"
            {...register("confirmPassword")}
            aria-invalid={Boolean(errors.confirmPassword)}
            className="h-9"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <label className="flex items-start gap-2 cursor-pointer text-xs text-muted-foreground">
          <input
            type="checkbox"
            {...register("terms")}
            className="mt-0.5 rounded border-border text-primary focus:ring-primary"
          />
          <span>
            I agree to the Terms of Service and Privacy Policy.
          </span>
        </label>
        {errors.terms && (
          <p className="text-[11px] text-destructive">{errors.terms.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full h-9 gap-2">
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Create Free Account
      </Button>
    </form>
  );
}

