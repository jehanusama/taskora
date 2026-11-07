import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { RegisterForm } from "./register-form";

export function RegisterView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href="/"
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
            Start managing projects with high velocity today.
          </p>
        </div>

        {/* Card */}
        <Card className="rounded-2xl border border-border/80 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Create your account</CardTitle>
            <CardDescription className="text-xs">
              Sign up in seconds. No credit card required.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RegisterForm />
          </CardContent>

          <CardFooter className="justify-center border-t border-border pt-4 text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="ml-1 text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

