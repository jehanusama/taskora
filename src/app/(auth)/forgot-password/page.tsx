import { Metadata } from "next";
import { ForgotPasswordView } from "@/components/forgot-password/forgot-password-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Reset Password | ${siteConfig.name}`,
  description: "Recover access to your account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}

