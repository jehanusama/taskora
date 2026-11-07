import { Metadata } from "next";
import { RegisterView } from "@/components/register/register-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Create Account | ${siteConfig.name}`,
  description: "Sign up for a new account.",
};

export default function RegisterPage() {
  return <RegisterView />;
}

