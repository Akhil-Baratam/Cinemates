import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  CalendarDays,
  Link as LinkIcon,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import useFollow from "../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

const ProfileModal = ({ user, isOpen, onOpenChange }) => {
  const {data: authUser} = useQuery({queryKey: ["authUser"]});

  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(user?.followers.includes(authUser._id));


  const { follow, isPending, isSuccess } = useFollow();
  const [loadingUserId, setLoadingUserId] = useState(null);

  const handleFollowClick = async (e, userId) => {
    e.preventDefault();
    setLoadingUserId(userId);
    follow(userId, {
      onSettled: () => {
        setLoadingUserId(null);
      },
      onSuccess: () => {
        setIsFollowing(!isFollowing);
      },
    });
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] sm:h-[90vh] p-0 bg-background rounded-t-3xl"
      >
        <div className="relative h-full">
          <div className=" absolute left-1/2 transform -translate-x-20 ml-4 sm:-translate-x-24 -top-16 z-50">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-36 sm:-bottom-52 z-10"
            >
              <Avatar className="w-32 h-32 sm:w-52 sm:h-52 border-4 border-background">
                <AvatarImage src={user.profileImg} alt={user.fullName} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
          <ScrollArea className="h-full">
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-2xl font-bold">
                    {user.fullName}
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground">
                    @{user.username}
                  </SheetDescription>
                </SheetHeader>
                <p className="mb-4">{user.bio}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Users size={14} />
                    {user.followers.length} followers
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Users size={14} />
                    {user.following.length} following
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <CalendarDays size={14} />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                  {user.link && (
                    <div className="flex items-center gap-1">
                      <LinkIcon size={14} />
                      <a
                        href={user.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user.link}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    {user.email}
                  </div>
                </div>
                <div className="flex gap-4 mb-8">
                  <Button
                    className="flex-1"
                    onClick={(e) => handleFollowClick(e, user._id)}
                    disabled={loadingUserId === user._id} // Disable button while loading
                  >
                    {loadingUserId === user._id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      isFollowing ? "Unfollow" : "follow"
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Message
                  </Button>
                </div>
              </motion.div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="posts" className="flex-1">
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="likes" className="flex-1">
                    Likes
                  </TabsTrigger>
                  <TabsTrigger value="ads" className="flex-1">
                    Ads
                  </TabsTrigger>
                </TabsList>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="posts" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-center text-muted-foreground">
                            User's posts will be displayed here
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="likes" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-center text-muted-foreground">
                            {user.likedPosts.length} liked posts
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="ads" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-center text-muted-foreground">
                            {user.interestedAds.length} interested ads
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileModal;
