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
import UserCard from "./components/UserCard";
import toast from "react-hot-toast";

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

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/suggestedusers`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const errorData = await res.text();
          try {
            const jsonError = JSON.parse(errorData);
            throw new Error(jsonError.error || "Failed to fetch users");
          } catch {
            throw new Error(errorData || "Failed to fetch users");
          }
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }

        return res.json();
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to load users");
    }
  });

  const { follow, isPending } = useFollow();

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load users. Please try again later.
      </div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl px-4">
        {users?.map((user) => (
          <UserCard key={user._id} user={user} />
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
