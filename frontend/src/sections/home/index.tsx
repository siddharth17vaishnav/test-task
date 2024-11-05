import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RootReduxState } from "@/store/root-reducer.type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { Bell, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
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

const friends = [
  { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg" },
  { id: 2, name: "Bob Smith", avatar: "/placeholder.svg" },
  { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg" },
  { id: 4, name: "David Lee", avatar: "/placeholder.svg" },
  { id: 5, name: "Eve Taylor", avatar: "/placeholder.svg" },
];

const HomePage = () => {
  const userData = useSelector((state: RootReduxState) => state.userSlice);
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
          <CardHeader>
            <CardTitle>Friends</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center space-x-4 mb-4"
                >
                  <Avatar>
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {friend.name}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
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
