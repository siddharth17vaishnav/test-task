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
  X,
  MessageCircle,
  Plus,
  ThumbsUp,
  UserPlus,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

const activities = [
  {
    id: 1,
    type: "like",
    user: "Alice",
    content: "liked your post",
    time: "2023-06-01T09:00:00",
  },
  {
    id: 2,
    type: "comment",
    user: "Bob",
    content: "commented on your photo",
    time: "2023-05-31T14:30:00",
  },
  {
    id: 3,
    type: "friend",
    user: "Charlie",
    content: "added you as a friend",
    time: "2023-05-30T11:15:00",
  },
  {
    id: 4,
    type: "like",
    user: "David",
    content: "liked your comment",
    time: "2023-05-29T16:45:00",
  },
  {
    id: 5,
    type: "comment",
    user: "Eve",
    content: "replied to your comment",
    time: "2023-05-28T10:00:00",
  },
];

const HomePage = () => {
  const userData = useSelector((state: RootReduxState) => state.userSlice);
  const { toast } = useToast();
  const [seachFriend, { data }] = useLazySearchFriendQuery();
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
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 mb-4"
                >
                  <div className="bg-primary-foreground p-2 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user} {activity.content}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(activity.time),
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
                        friend.user.first_name,
                        friend.user.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-medium leading-none">
                      {friend.user.first_name} {friend.user.last_name}
                    </p>
                    <div>
                      {friend.status && friend.status == "pending" && (
                        <div className="flex gap-2 items-center">
                          <Check
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => accept(friend.id)}
                          />
                          <X
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => reject(friend.id)}
                          />
                        </div>
                      )}
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
