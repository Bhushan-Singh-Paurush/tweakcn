"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "./ui/label";
import Link from "next/link";
import { Checkbox } from "./ui/checkbox";
import { login, sendLoginOTP } from "@/service/operations/auth";
import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { addUser } from "@/slices/user";
import { useAppDispatch } from "@/hooks/reduxHook";
import { motion, Variants } from "framer-motion";

export const loginSchema = z.object({
  email: z.email({ message: "Your email is invalid." }),
  password: z.string().min(8, "Password must be greater then 8"),
  isPersist: z.boolean(),
});

export function LoginForm({
  className,
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isPersist: true,
    },
  });
  const [step, setStep] = useState<number>(1);
  const [otp, setOtp] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const route = useRouter();
  const dispatch=useAppDispatch()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        delayChildren: 0.8,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants:Variants  = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  async function loginSubmit() {
    setIsPending(true);
    try {
      const result = await sendLoginOTP(getValues("email"));

      setStep(2);

      alert(result.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  }

  async function submit() {
    try {
      if (otp.length < 6) {
        alert("OTP must be of 6 digits");
        return;
      }

      const result = await login(getValues(), otp);


        dispatch(addUser(result.data))

      if (result.data.role === "client") route.push("/client");
      else route.push("/admin/dashboard");

    } catch (error) {
      console.log(error);
    }
  }

  if (step === 2)
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn("flex flex-col gap-6", className)}
      >
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle>Verify your login</CardTitle>
            <CardDescription>
              Enter the verification code we sent to your email address:{" "}
              <span className="font-medium">{getValues("email")}</span>
              <span className="font-medium">
                and this opt will expire{" "}
                {new Date(
                  new Date().getTime() + 5 * 60 * 1000,
                ).toLocaleString()}
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <motion.div variants={itemVariants}>
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="otp-verification">
                      Verification code
                    </FieldLabel>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setOtp("");loginSubmit();
                      }}
                      disabled={isPending}
                    >
                      <RefreshCwIcon />
                      Resend Code
                    </Button>
                  </div>
                  <div className=" flex items-center justify-center my-4">
                    <InputOTP
                      value={otp}
                      maxLength={6}
                      id="otp-verification"
                      onChange={(value) => setOtp(value)}
                      required
                    >
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <FieldDescription>
                    <a href="#">I no longer have access to this email address.</a>
                  </FieldDescription>
                </Field>
              </motion.div>
            </motion.div>
          </CardContent>
          <CardFooter>
            <motion.div variants={itemVariants} initial="hidden" animate="show" className="w-full">
              <Field>
                <Button type="submit" onClick={() => submit()} className="w-full">
                  Verify
                </Button>
                <div className="text-sm text-muted-foreground">
                  Having trouble signing in?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    Contact support
                  </a>
                </div>
              </Field>
            </motion.div>
          </CardFooter>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </motion.div>
    );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("flex flex-col gap-6", className)} 
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your motion tech account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(loginSubmit)}>
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <FieldGroup>
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="text"
                      placeholder="m@example.com"
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
                  </Field>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      {...register("password")}
                      className={cn("", {
                        "border-destructive ": errors.password,
                      })}
                    />
                    {errors.password && (
                      <div className=" text-destructive mt-2 text-sm">
                        {errors.password.message}
                      </div>
                    )}
                  </Field>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Controller
                      name="isPersist"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="isPersist"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />

                    <Label htmlFor="isPersist">Keep Me Signed In</Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-default-800 dark:text-default-400 leading-6 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Field>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className={`${isPending ? "bg-chart-5" : ""}`}
                    >
                      {isPending && <Spinner data-icon="inline-start" />}
                      Login
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="#" className=" text-chart-5 hover:underline ">Sign up</a>
                    </FieldDescription>
                  </Field>
                </motion.div>
              </FieldGroup>
            </motion.div>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </motion.div>
  );
}
