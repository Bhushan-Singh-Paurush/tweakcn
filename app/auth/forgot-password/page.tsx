import ForgotPassForm from "@/components/auth/forgot-pass-form";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";

export default function ForgotPass() {
  return (
    <div className="min-h-screen w-full flex items-center bg-muted justify-center px-4">
      
      <div className="flex w-full max-w-sm flex-col gap-6">
      <div  className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
           M
          </div>
          Motion Tech
        </div>
      <Card className=" shadow-xl">
        
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-xl">
            Forgot Your Password?
          </CardTitle>

          <CardDescription>
            Reset your password securely.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          
          <div className="rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
            Enter your email address and we’ll send you instructions to reset
            your password.
          </div>

          <ForgotPassForm />
        </CardContent>

        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          <span>Remember your password?</span>

          <Link
            href="/auth/login"
            className="ml-2 font-medium text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
      <FieldDescription className="px-6 text-center">
              By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </FieldDescription>
      </div>
    </div>
  );
}