

import PasswordValidation from "@/components/auth/password-validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted px-4 " >
      <div className="flex w-full max-w-sm flex-col gap-6">
      <div  className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
           M
          </div>
          Motion Tech
        </div>
      
      
      <Card className="shadow-xl">
        
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl">
            Reset Password
          </CardTitle>

          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <PasswordValidation />
        </CardContent>

      </Card>
      <FieldDescription className="px-6 text-center">
              By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </FieldDescription>
      </div>
    </div>
  );
}