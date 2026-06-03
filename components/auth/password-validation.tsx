"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { resetPasswordService } from "@/service/operations/auth";
import { Spinner } from "../ui/spinner";

const schema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const PasswordValidation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:{
      password:"",
      confirmPassword:""
    }
  });

  const payload = useParams()

  async function onSubmit(data: z.infer<typeof schema>) {
    
    try {
        const result  = await resetPasswordService(data.password,payload?.token ? payload.token.toString() : "")
    
         toast.success(result.message)

      } catch (error) {
       console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your new password"
          {...register("password")}
          className={cn("", {
            "border-destructive ": errors.password,
          })}
        />

        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className={cn({
            "text-destructive": errors.confirmPassword,
          })}
        >
          Confirm Password
        </Label>

        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          className={cn("", {
            "border-destructive ": errors.confirmPassword,
          })}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className={`w-full ${isSubmitting ? "bg-chart-5" : ""}`} disabled={isSubmitting}>
         {isSubmitting && <Spinner data-icon="inline-start" />}
        Reset Password
      </Button>
    </form>
  );
};

export default PasswordValidation;
