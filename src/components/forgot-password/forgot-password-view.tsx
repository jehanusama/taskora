import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href={routes.home()}
            className="flex items-center gap-2.5 font-bold tracking-tight text-foreground"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-5" />
            </div>
            <span className="text-2xl font-heading font-extrabold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">
            Recover access to your {siteConfig.name} account.
          </p>
        </div>

        {/* Card */}
        <Card className="rounded-2xl border border-border/80 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Reset Password</CardTitle>
            <CardDescription className="text-xs">
              Enter your email and we will send you a secure recovery link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

