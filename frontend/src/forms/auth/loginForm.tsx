import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/store";
import { ErrorResponse } from "@/store/root-reducer.type";
import { setUser } from "@/store/users/user.slice";
import { useLoginMutation } from "@/store/users/users.api";
import { addCookie } from "@/utils/cookies";
import { useRouter } from "next/router";
import React, { useState } from "react";

const LoginForm = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginUser] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    loginUser({ email, password }).then((res) => {
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
  };
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" onClick={onSubmit}>
          Login
        </Button>
      </div>
    </CardContent>
  );
};

export default LoginForm;
