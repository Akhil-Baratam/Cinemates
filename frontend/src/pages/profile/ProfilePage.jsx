import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../posts/components/Posts";
import ProfileHeaderSkeleton from "../../assets/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const {username} = useParams();

  const isMyProfile = true;
  
  const {data: user, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ["UserProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    }
  });
  
  const memberSinceDate = formatMemberSinceDate(user?.createdAt)

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch()
  },[username, refetch])

  return (
    <>
      <div className="flex-1 min-h-screen bg-gray-100">
        {/* HEADER */}
        {isLoading || isRefetching && <ProfileHeaderSkeleton />}
        {!isLoading || !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-6 px-6 py-4 items-center bg-white shadow-sm">
                <Link to="/">
                  <FaArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-semibold text-xl">{user?.fullName}</p>
                  <span className="text-sm text-gray-500">{POSTS?.length} posts</span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-60 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-4 right-4 rounded-full p-2 bg-black bg-opacity-60 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="absolute -bottom-16 left-6">
                  <div className="w-32 h-32 rounded-full border-4 border-white relative group">
                    <img
                      src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                      className="rounded-full w-full h-full object-cover"
                      alt="user avatar"
                    />
                    {isMyProfile && (
                      <div
                        className="absolute top-2 right-2 p-1 bg-primary rounded-full group-hover:opacity-100 opacity-0 cursor-pointer"
                        onClick={() => profileImgRef.current.click()}
                      >
                        <MdEdit className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-6 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className="bg-white border border-gray-300 text-gray-700 rounded-full px-4 py-1.5 hover:bg-gray-100 transition"
                    onClick={() => alert("Followed successfully")}
                  >
                    Follow
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="ml-2 bg-primary text-white rounded-full px-6 py-1.5 hover:bg-primary-dark transition"
                    onClick={() => alert("Profile updated successfully")}
                  >
                    Update
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-20 px-6">
                <div className="flex flex-col">
                  <span className="font-semibold text-xl">{user?.fullName}</span>
                  <span className="text-sm text-gray-500">@{user?.username}</span>
                  <span className="text-sm mt-2">{user?.bio}</span>
                </div>

                <div className="flex gap-3 flex-wrap text-gray-600">
                  {user?.link && (
                    <div className="flex gap-1 items-center">
                      <FaLink className="w-4 h-4" />
                      <a
                        href={user.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {new URL(user.link).hostname}
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-5 h-5" />
                    <span className="text-sm">{memberSinceDate}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-sm">{user?.following.length}</span>
                    <span className="text-gray-600 text-sm">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-sm">{user?.followers.length}</span>
                    <span className="text-gray-600 text-sm">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-300 mt-6">
                <div
                  className={`flex justify-center flex-1 py-3 cursor-pointer transition duration-300 ${
                    feedType === "posts"
                      ? "border-b-4 border-primary text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                </div>
                <div
                  className={`flex justify-center flex-1 py-3 cursor-pointer transition duration-300 ${
                    feedType === "likes"
                      ? "border-b-4 border-primary text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
