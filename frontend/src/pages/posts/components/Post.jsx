import { FaRegComment, FaRegHeart, FaRegBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadinSpinner";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
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

  const postOwner = post.user;
  const isLiked = false;
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = "1h"; // For demonstration, format the date as required

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    // Implement comment posting functionality
  };

  const handleLikePost = () => {
    // Implement like functionality
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? post.imgs.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === post.imgs.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
      <div className='avatar w-8 h-8'>
        <Link to={`/profile/${postOwner.username}`}>
          <img
            className='aspect-square object-cover rounded-full'
            src={postOwner.profileImg || postOwner.fullName.charAt(0).toUpperCase()}
            alt={postOwner.fullName}
          />
        </Link>
      </div>
      <div className='flex flex-col flex-1'>
        <div className='flex gap-2 items-center'>
          <Link to={`/profile/${postOwner.username}`} className='font-bold'>
            {postOwner.fullName}
          </Link>
          <span className='text-gray-700 flex gap-1 text-sm'>
            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className='flex justify-end flex-1'>
              {!isPending && (
                <FaTrash
                  className='cursor-pointer hover:text-red-500'
                  onClick={handleDeletePost}
                />
              )}
              {isPending && <LoadingSpinner />}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-3 overflow-hidden'>
          <span>{post.text}</span>
          {post.imgs && post.imgs.length > 0 && (
            <div className='relative w-full h-80'>
              <img
                src={post.imgs[currentImageIndex]}
                className='w-full h-full object-contain rounded-lg border border-gray-700'
                alt=''
              />
              {post.imgs.length > 1 && (
                <>
                  <button
                    className='absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded'
                    onClick={goToPreviousImage}
                  >
                    &#10094;
                  </button>
                  <button
                    className='absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded'
                    onClick={goToNextImage}
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className='flex justify-between mt-3'>
          <div className='flex gap-4 items-center w-2/3 justify-between'>
            <div
              className='flex gap-1 items-center cursor-pointer'
              onClick={handleLikePost}
            >
              <FaRegHeart className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
              <span className={`${isLiked ? 'text-red-500' : 'text-gray-500'}`}>Like</span>
            </div>
            <div className='flex gap-1 items-center cursor-pointer'>
              <FaRegComment className='w-5 h-5 text-gray-500' />
              <span>Comment</span>
            </div>
            <div className='flex gap-1 items-center cursor-pointer'>
              <BiRepost className='w-5 h-5 text-gray-500' />
              <span>Repost</span>
            </div>
            <div className='flex gap-1 items-center cursor-pointer'>
              <FaRegBookmark className='w-5 h-5 text-gray-500' />
              <span>Save</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
          <form onSubmit={handlePostComment} className='flex gap-2 items-center'>
            <input
              type='text'
              className='input input-sm w-full border-gray-700 rounded-full'
              placeholder='Add a comment...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type='submit' className='btn btn-sm btn-primary rounded-full'>
              Comment
            </button>
          </form>
          {/* Render comments here */}
        </div>
      </div>
    </div>
  );
};

export default Post;
