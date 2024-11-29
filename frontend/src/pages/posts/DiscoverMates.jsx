import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import ProfileModal from "../../components/ProfileModal";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../../components/LoadingSpinner";

const DiscoverMates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [loadingUserId, setLoadingUserId] = useState(null);

  const handleFollowClick = async (e, userId) => {
    e.preventDefault();
    setLoadingUserId(userId);
    follow(userId, {
      onSettled: () => {
        setLoadingUserId(null);
      },
    });
  };

  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      } 
    },
  });

  const { follow, isPending } = useFollow();

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  return (
    <div className="container pt-20 bg-zinc-50 mx-auto px-16 py-8">
      <h1 className="text-4xl font-bold mb-8">Discover Mates</h1>

      {/* Filter Component */}
      <div className="mb-8 flex flex-nowrap gap-4">
        <Input
          className="flex-grow focus:outline-none"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={filter1}
          onValueChange={setFilter1}
          className="focus:outline-none"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter 1" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filter2} onValueChange={setFilter2}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter 2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="optionA">Option A</SelectItem>
            <SelectItem value="optionB">Option B</SelectItem>
            <SelectItem value="optionC">Option C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading &&
          Array(8)
            .fill(0)
            .map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
        {!isLoading &&
          suggestedUsers?.map((user) => (
            <Card
              key={user._id}              
              className="cursor-pointer bg-white hover:drop-shadow-lg transition-shadow"
            >
              <CardContent onClick={() => handleUserClick(user)} className="p-4 flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user.profileImg} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                <p className="text-sm text-gray-500 mb-4">@{user.username}</p>
              </CardContent>
              <CardFooter>
              <Button
              className="w-full"
              onClick={(e) => handleFollowClick(e, user._id)}
              disabled={loadingUserId === user._id} // Disable button while loading
            >
              {loadingUserId === user._id ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Follow"
              )}
            </Button>
          </CardFooter>
            </Card>
          ))}
      </div>

      <ProfileModal
        key={selectedUser?.id} // Ensuring the modal has a unique key if rendered
        user={selectedUser}
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </div>
  );
};

export default DiscoverMates;
