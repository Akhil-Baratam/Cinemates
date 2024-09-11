import { FaRegComment, FaRegHeart, FaRegBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ProfileModal from "../../../components/ProfileModal";
import { CommentSection } from "../../../components/CommentSection";

const Post = ({ post }) => {
  const [comments, setComments] = useState(post.comments);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const [isLiked, setIsLiked] = useState(post.likes.includes(authUser._id));
  const [localLikes, setLocalLikes] = useState(post.likes);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = "1h"; // For demonstration, format the date as required
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // queryClient.invalidateQueries({ queryKey: ["posts"] }); //This will refetch all posts which is bad for UX
      //instead update the cache directly for that post
      setLocalLikes(updatedLikes); // Update local state
      setIsLiked(updatedLikes.includes(authUser._id)); // Update isLiked state
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData?.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const {mutate: commentPost, isPending: isCommenting} = useMutation({
    mutationFn: async (newComment) => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newComment }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (newComment) => {
      setComments((prevComments) => [...prevComments, newComment]); // Optimistically update comments state
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData?.map((p) => {
          if (p._id === post._id) {
            return { ...p, comments: [...p.comments, newComment] };
          }
          return p;
        });
      });
      toast.success("Comment posted successfully");
    },
		onError: (error) => {
			toast.error(error.message);
		},
  })

  const handleDeletePost = () => {
    deletePost();
  };


  const handleLikePost = () => {
    if (isLiking) return;
    setIsLiked(!isLiked); // Optimistically update isLiked state
    setLocalLikes((prevLikes) =>
      isLiked ? prevLikes.filter((id) => id !== authUser._id) : [...prevLikes, authUser._id]
    ); // Optimistically update localLikes state
    likePost();
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.imgs.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === post.imgs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-background rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4 border-border">
        <div className="flex items-center space-x-3">
          <div onClick={() => handleUserClick(postOwner)} className="flex-shrink-0 cursor-pointer">
            <Avatar>
              <AvatarImage
                src={postOwner.profileImg}
                alt={postOwner.fullName}
              />
              <AvatarFallback>
                {postOwner.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow min-w-0">
            <p onClick={() => handleUserClick(postOwner)} className="font-bold text-foreground hover:underline">
              {postOwner.fullName}
            </p>
            <p className=" flex min-w-10 text-xs text-muted-foreground truncate">
              <p className="">
                @{postOwner.username}
              </p>
              <span className="mx-1">·</span>
              <span>{formattedDate}</span>
            </p>
          </div>
          {isMyPost && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-muted-foreground hover:text-destructive transition duration-200"
              onClick={handleDeletePost}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <FaTrash className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </div>
      </div>
      <div className="px-5 pb-4">
        <p className="text-foreground text-sm mb-4">{post.text}</p>
        {post.imgs && post.imgs.length > 0 && (
          <div className="relative w-full h-80 mb-4">
            <img
              src={post.imgs[currentImageIndex]}
              className="w-full h-full object-contain rounded-lg"
              alt=""
            />
            {post.imgs.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 left-2 transform -translate-y-1/2"
                  onClick={goToPreviousImage}
                >
                  &#10094;
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  onClick={goToNextImage}
                >
                  &#10095;
                </Button>
              </>
            )}
          </div>
        )}
        <div className="flex justify-between text-xs items-center mb-4">
          <div
            className={`flex items-center space-x-1 cursor-pointer`}
            onClick={handleLikePost}
          >
            {isLiking ? (
              <LoadingSpinner size="sm" className=" border-pink-500" />
            ) : isLiked ? (
              <FaRegHeart className="w-4 h-4 text-pink-500" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-slate-500 hover:text-pink-500" />
            )}
            <span
              className={`text-sm hover:text-pink-500 ${
                isLiked ? "text-pink-500" : "text-slate-500"
              }`}
            >
              {localLikes.length}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 text-muted-foreground"
            onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}
          >
            <FaRegComment className="w-4 h-4" />
            <span>({post.comments.length})</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 text-muted-foreground"
          >
            <BiRepost className="w-4 h-4" />
            <span>Repost</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 text-muted-foreground"
          >
            <FaRegBookmark className="w-4 h-4" />
            <span>Save</span>
          </motion.button>
        </div>
        <CommentSection
          postId={post._id}
          authUser={authUser}
          comments={comments}
          isOpen={isCommentSectionOpen}
          commentPost={commentPost}
          isCommenting={isCommenting}
        />
      </div>
      <ProfileModal
        key={selectedUser?.id} // Ensuring the modal has a unique key if rendered
        user={selectedUser}
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </motion.div>
  );
};

export default Post;
