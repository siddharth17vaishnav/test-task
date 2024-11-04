import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/forms/auth/loginForm";
import Link from "next/link";

import React from "react";

const Login = () => {
  return (
    <div className=" h-screen flex justify-center items-center">
      <Card className="mx-auto max-w-sm h-fit">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <LoginForm />
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {`Don't have account?`}{" "}
            <Link href="/auth/signup" className="hover:underline">
              Signup here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
