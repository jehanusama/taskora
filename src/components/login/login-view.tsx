import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { LoginForm } from "./login-form";

export function LoginView() {
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
            Sign in to access your projects, tasks, and sprint boards.
          </p>
        </div>

        {/* Card */}
        <Card className="rounded-2xl border border-border/80 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Welcome back</CardTitle>
            <CardDescription className="text-xs">
              Enter your credentials to continue to your dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="justify-center border-t border-border pt-4 text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="ml-1 text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

