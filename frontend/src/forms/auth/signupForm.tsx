import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSignupMutation } from "@/store/users/users.api";
import { omit } from "lodash";
import { ErrorResponse } from "@/store/root-reducer.type";
import { useAppDispatch } from "@/store";
import { addCookie } from "@/utils/cookies";
import { setUser } from "@/store/users/user.slice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignupForm = () => {
  const [signup] = useSignupMutation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    errors,
    isSubmitting,
    dirty,
    isValid,
  } = useFormik<SignupFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      signup(omit(values, ["confirmPassword"])).then((res) => {
        const { data, error } = res;
        const err = error as ErrorResponse;
        if (err) {
          toast({ title: err.data.message });
        } else if (data) {
          addCookie("accessToken", data.accessToken);
          addCookie("refreshToken", data.refreshToken);
          dispatch(setUser(data.user));
          router.push("/");
        }
      });
    },
  });
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full items-center gap-4">
        {/* Name Field */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          {touched.name && errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {touched.email && errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          {touched.password && errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.confirmPassword}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full mt-4"
        type="submit"
        disabled={isSubmitting || !(dirty && isValid)}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;
