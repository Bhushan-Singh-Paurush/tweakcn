"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm} from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordService } from "@/service/operations/auth";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
const ForgotPassForm = () => {
  const schema = z.object({
    email: z.email({ message: "Your email is invalid." }),
  });

  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    
    setIsPending(true)
    
    try {
      const result = await forgotPasswordService(data.email);

      alert(result.message);
    } catch (error) {
      console.log(error);
    }finally{
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="dashcode@gmail.com"
          {...register("email")}
          className={cn("", {
            "border-destructive ": errors.email,
          })}
        />
        {errors.email && (
          <div className=" text-destructive mt-2 text-sm">
            {errors.email.message}
          </div>
        )}
      </div>

      <Button type="submit" className={` w-full ${isPending ? "bg-chart-5" : ""}`} disabled={isPending}>
         {isPending && <Spinner data-icon="inline-start" />}
        Send recovery email
      </Button>
    </form>
  );
};

export default ForgotPassForm;
