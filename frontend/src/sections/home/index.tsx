import {
  Card,
  CardContent,
  CardDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import useEffectAfterMount from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { useGetActivityQuery } from "@/store/activity/activity.api";
import {
  useAcceptRequestMutation,
  useGetFriendsQuery,
  useLazySearchFriendQuery,
  useRejectRequestMutation,
  useSendFriendRequestMutation,
} from "@/store/friends/friends.api";
import { ErrorResponse, RootReduxState } from "@/store/root-reducer.type";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { debounce } from "lodash";
import {
  Bell,
  Check,
  MessageCircle,
  Plus,
  ThumbsUp,
  UserPlus,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

const HomePage = () => {
  const userData = useSelector((state: RootReduxState) => state.userSlice);
  const { toast } = useToast();
  const [seachFriend, { data }] = useLazySearchFriendQuery();
  const { data: activity } = useGetActivityQuery();
  const [sendRequest] = useSendFriendRequestMutation();
  const [acceptRequest] = useAcceptRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();
  const { data: friends, refetch } = useGetFriendsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4" />;
      case "comment":
        return <MessageCircle className="h-4 w-4" />;
      case "friend":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleSearchFriend = (searchText: string = "") => {
    seachFriend(searchText);
  };
  const debounced = useCallback(debounce(handleSearchFriend, 1000), []);
  useEffectAfterMount(() => {
    debounced(search);
  }, [search, debounced]);

  const getNameInital = (firstName: string, lastName: string) => {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
    const nameParts = fullName.trim().split(" ");

    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return initials;
  };

  const accept = (id: number) => {
    acceptRequest(id).then((res) => {
      const { error } = res;
      const err = error as ErrorResponse;
      if (err) {
        toast({ title: err.data.message });
      } else {
        toast({ title: "Friend request accepted successfully!" });
        refetch();
      }
    });
  };
  const reject = (id: number) => {
    rejectRequest(id).then((res) => {
      const { error } = res;
      const err = error as ErrorResponse;
      if (err) {
        toast({ title: err.data.message });
      } else {
        toast({ title: "Friend request rejected successfully!" });
        refetch();
      }
    });
  };

  const showButton = (status: string, id: number) => {
    if (!status) {
      return (
        <div
          className="bg-blue-600 rounded h-fit w-fit px-4 py-1 text-white hover:cursor-pointer"
          onClick={() => {
            sendRequest(id).then((res) => {
              const { error } = res;
              const err = error as ErrorResponse;
              if (err) {
                toast({ title: err.data.message });
              } else {
                debounced(search);
                toast({ title: "Friend request sent successfully!" });
              }
            });
          }}
        >
          Add
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="bg-yellow-600 rounded h-fit w-fit px-4 py-1 text-white hover:cursor-pointer">
          pending
        </div>
      );
    }
  };
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {userData?.first_name ?? ""}!</CardTitle>
          <CardDescription>
            Last login:{" "}
            {userData?.last_login_at &&
              format(userData?.last_login_at, "MMMM d, yyyy 'at' h:mm a")}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {Array.from(activity ?? []).map((i) => (
                <div key={i.id} className="flex items-start space-x-4 mb-4">
                  <div className="bg-primary-foreground p-2 rounded-full">
                    {getActivityIcon(i.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {i.type === "login" ? "Logged In" : i.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(i.created_at),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Friends</CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Plus className="hover:cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <div className="mt-5">
                    <Input
                      placeholder="Search a friend...."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                    <ScrollArea className="h-[400px] mt-4">
                      {Array.from(data ?? [])?.map((i) => {
                        return (
                          <div key={i.id} className="flex justify-between">
                            <div className="flex items-center space-x-4 mb-4">
                              <Avatar>
                                <AvatarFallback>
                                  {getNameInital(i.first_name, i.last_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium leading-none">
                                  {i.first_name} {i.last_name}
                                </p>
                              </div>
                            </div>
                            {showButton(i.status as string, i.id)}
                          </div>
                        );
                      })}
                    </ScrollArea>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {Array.from(friends?.requests ?? []).map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center space-x-4 mb-4"
                >
                  <Avatar>
                    <AvatarFallback>
                      {getNameInital(
                        friend.user.id === userData.id
                          ? friend.added_by.first_name
                          : friend.user.first_name,
                        friend.user.id === userData.id
                          ? friend.added_by.last_name
                          : friend.user.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-medium leading-none items-center">
                      {friend.user.id === userData.id
                        ? friend.added_by.first_name
                        : friend.user.first_name}{" "}
                      {friend.user.id === userData.id
                        ? friend.added_by.last_name
                        : friend.user.last_name}
                    </p>
                    <div>
                      {friend.status && friend.status == "pending" ? (
                        userData.id !== friend.added_by.id ? (
                          <div className="flex gap-2 items-center">
                            <Check
                              className="w-4 h-4 cursor-pointer"
                              onClick={() =>
                                accept(
                                  friend.user.id === userData.id
                                    ? friend.added_by.id
                                    : friend.user.id
                                )
                              }
                            />
                            <X
                              className="w-4 h-4 cursor-pointer"
                              onClick={() =>
                                reject(
                                  friend.user.id === userData.id
                                    ? friend.added_by.id
                                    : friend.user.id
                                )
                              }
                            />
                          </div>
                        ) : (
                          <div>Pending</div>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
