import { toast as baseToast } from "@/components/ui/toast";

export interface NotifyOptions {
  title: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error" | "loading";
}

export const notify = {
  success(title: string, description?: string) {
    return baseToast.add({ title, description, type: "success" });
  },
  error(title: string, description?: string) {
    return baseToast.add({ title, description, type: "error" });
  },
  info(title: string, description?: string) {
    return baseToast.add({ title, description, type: "info" });
  },
  warning(title: string, description?: string) {
    return baseToast.add({ title, description, type: "warning" });
  },
  show(options: NotifyOptions) {
    return baseToast.add(options);
  },
};

