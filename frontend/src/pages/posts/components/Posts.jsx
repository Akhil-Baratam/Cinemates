import Post from "./Post";
import PostSkeleton from "../../../assets/skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

const Posts = ({ feedType, username, userId }) => {

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `${import.meta.env.VITE_BASE_URL}/api/posts/all`;
      case "following":
        return `${import.meta.env.VITE_BASE_URL}/api/posts/following`;
      case "posts":
        return `${import.meta.env.VITE_BASE_URL}/api/posts/user/${username}`;
      case "likes":
        return `${import.meta.env.VITE_BASE_URL}/api/posts/likes/${userId}`
      default:
        return `${import.meta.env.VITE_BASE_URL}/api/posts/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });
 
  useEffect(() => {
    refetch();
  }, [feedType, username, refetch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
    >
      <AnimatePresence>
        {(isLoading || isRefetching) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col space-y-4 p-4"
          >
            <PostSkeleton />
            <PostSkeleton />
          </motion.div>
        )}
        {!isLoading && !isRefetching && posts?.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 dark:text-gray-400 p-8"
          >
            No posts available. Start the conversation!
          </motion.p>
        )}
        {!isLoading && !isRefetching && posts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-4"
          >
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Post post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Posts;
