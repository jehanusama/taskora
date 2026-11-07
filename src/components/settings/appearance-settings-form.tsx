"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppearanceSettingsForm() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return null;
  }

  const themes = [
    {
      id: "light",
      label: "Light Mode",
      description: "Clean, high-contrast crisp theme for bright environments.",
      icon: Sun,
    },
    {
      id: "dark",
      label: "Dark Mode",
      description: "Reduced eye strain OLED optimized dark palette.",
      icon: Moon,
    },
    {
      id: "system",
      label: "System Sync",
      description: "Automatically matches your operating system preferences.",
      icon: Laptop,
    },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Appearance & Theme</CardTitle>
        <CardDescription className="text-xs">
          Customize how Taskora looks on your screen.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  "relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 hover:border-primary/50",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                    : "border-border bg-card"
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </div>
                )}

                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg mb-3 transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-5" />
                </div>

                <span className="text-sm font-semibold text-foreground">
                  {t.label}
                </span>

                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

