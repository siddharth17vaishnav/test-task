"use client";
import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Mail, Lock } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  ErrorResponse,
  RESET_STORE,
  RootReduxState,
} from "@/store/root-reducer.type";
import { removeCookie } from "@/utils/cookies";
import { pushHandler } from "@/utils/genericRouting";
import { useAppDispatch } from "@/store";
import { useUpdatePasswordMutation } from "@/store/users/users.api";
import { useToast } from "@/hooks/use-toast";

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const Profile = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [updatePassword] = useUpdatePasswordMutation();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootReduxState) => state.userSlice);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = () => {
    removeCookie("accessToken");
    dispatch({ type: RESET_STORE });
    pushHandler("auth/login");
  };

  const handleUpdatePassword = (
    values: PasswordFormValues,
    { setSubmitting }: FormikHelpers<PasswordFormValues>
  ) => {
    console.log({ values });
    updatePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    }).then((res) => {
      const { data, error } = res;
      const err = error as ErrorResponse;
      if (err) {
        toast({ title: err.data.message });
      } else if (data) {
        toast({ title: "Password updated successfully" });
        setIsOpen(false);
      }
      setSubmitting(false);
    });
  };
  return (
    <div className="flex items-center justify-center min-h-[92vh] bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{`${user.first_name} ${user.last_name}`}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="mr-2 h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <p className="text-sm text-gray-500">
                Last login:{" "}
                {user.last_login_at &&
                  format(user.last_login_at, "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Lock className="mr-2 h-4 w-4" /> Update Password
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Password</DialogTitle>
              </DialogHeader>
              <Formik
                initialValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={PasswordSchema}
                onSubmit={handleUpdatePassword}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Old Password</Label>
                      <Field
                        as={Input}
                        id="oldPassword"
                        name="oldPassword"
                        type="password"
                      />
                      {errors.oldPassword && touched.oldPassword && (
                        <div className="text-red-500 text-sm">
                          {errors.oldPassword}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Field
                        as={Input}
                        id="newPassword"
                        name="newPassword"
                        type="password"
                      />
                      {errors.newPassword && touched.newPassword && (
                        <div className="text-red-500 text-sm">
                          {errors.newPassword}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      Change Password
                    </Button>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
          <Button onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
