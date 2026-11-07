import { Metadata } from "next";
import { LoginView } from "@/components/login/login-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Sign In | ${siteConfig.name}`,
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return <LoginView />;
}

