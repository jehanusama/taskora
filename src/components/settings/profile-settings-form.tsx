"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileSchema, ProfileInput } from "@/lib/validations/settings";
import { useCurrentUser, useUpdateProfile } from "@/hooks/use-auth";
import { toast } from "@/components/ui/toast";
import { Loader2, Upload } from "lucide-react";

export function ProfileSettingsForm() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      title: "Product Lead",
      department: "Product & Engineering",
      bio: "Crafting delightful product experiences for modern agile squads.",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        title: "Product Lead",
        department: user.department || "Product & Engineering",
        bio: "Crafting delightful product experiences for modern agile squads.",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileInput) => {
    await updateProfile.mutateAsync(data);
    toast.create({
      title: "Profile Updated",
      description: "Your user profile changes have been saved.",
      type: "success",
    });
  };

  const isPending = updateProfile.isPending || isSubmitting;

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold">My Profile</CardTitle>
        <CardDescription className="text-xs">
          Personal details, display name, and avatar visible to teammates.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Avatar Upload Preview */}
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <Avatar size="lg" className="size-16 ring-2 ring-border">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="text-base font-bold">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user?.name}</h4>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 h-7 text-xs gap-1.5"
              onClick={() =>
                toast.create({
                  title: "Avatar update",
                  description: "Photo uploaded successfully (simulation).",
                  type: "success",
                })
              }
            >
              <Upload className="size-3" /> Change Photo
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input
                id="profile-name"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
                className="h-9"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email" className="text-xs font-semibold">
                Email Address
              </Label>
              <Input
                id="profile-email"
                type="email"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                className="h-9"
              />
              {errors.email && (
                <p className="text-[11px] text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-title" className="text-xs font-semibold">
                Job Title
              </Label>
              <Input
                id="profile-title"
                {...register("title")}
                aria-invalid={Boolean(errors.title)}
                className="h-9"
              />
              {errors.title && (
                <p className="text-[11px] text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-department" className="text-xs font-semibold">
                Department
              </Label>
              <Input
                id="profile-department"
                {...register("department")}
                aria-invalid={Boolean(errors.department)}
                className="h-9"
              />
              {errors.department && (
                <p className="text-[11px] text-destructive">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-bio" className="text-xs font-semibold">
              Bio
            </Label>
            <Textarea
              id="profile-bio"
              rows={3}
              {...register("bio")}
              className="resize-none text-xs"
            />
            {errors.bio && (
              <p className="text-[11px] text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending || !isDirty} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

