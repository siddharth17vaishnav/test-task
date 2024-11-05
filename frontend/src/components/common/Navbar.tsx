import { useAppDispatch } from "@/store";
import { RESET_STORE } from "@/store/root-reducer.type";
import { setUser } from "@/store/users/user.slice";
import { useGetUserQuery } from "@/store/users/users.api";
import { removeCookie } from "@/utils/cookies";
import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data } = useGetUserQuery();
  const userData = data?.data;

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [dispatch, userData]);

  const handleLogout = () => {
    setOpen(false);
    removeCookie("accessToken");
    dispatch({ type: RESET_STORE });
    router.push("/auth/login");
  };
  const getNameInital = () => {
    const fullName = `${userData?.first_name ?? ""} ${
      userData?.last_name ?? ""
    }`;
    const nameParts = fullName.trim().split(" ");

    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return initials;
  };
  return (
    <nav className="flex justify-between items-center p-4 bg-background border-b">
      <Link href="/" className="text-xl font-bold">
        HOME
      </Link>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <UserCircle className="h-6 w-6" />
            <span className="sr-only">Open user menu</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{getNameInital()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {userData?.first_name ?? ""} {userData?.last_name ?? ""}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userData?.email ?? ""}
                </p>
              </div>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
};

export default Navbar;
