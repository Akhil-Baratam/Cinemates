import Post from "./Post";
import PostSkeleton from "../../../assets/skeletons/PostSkeleton";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import LoadingSpinner from "../../../components/LoadingSpinner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["posts", feedType],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await fetch(`${POST_ENDPOINT}?page=${pageParam}&limit=10`, {
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
            throw new Error(jsonError.error || "Failed to fetch posts");
          } catch {
            throw new Error(errorData || "Failed to fetch posts");
          }
        }

        const data = await res.json();
        
        // Log the response to see its structure
        console.log("API Response:", data);

        // Check if data exists and has the expected structure
        if (!data || (typeof data === 'object' && !Array.isArray(data.posts) && !Array.isArray(data))) {
          console.error("Unexpected data structure:", data);
          throw new Error("Invalid response format");
        }

        // If data is an array directly, wrap it
        if (Array.isArray(data)) {
          return {
            posts: data,
            nextPage: pageParam + 1
          };
        }

        // If data has posts array
        return data;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  useEffect(() => {
    fetchNextPage();
  }, [feedType, username, fetchNextPage]);

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again later.</div>}
      onError={(error, errorInfo) => {
        // Log to your error reporting service
        console.error('Error:', error, errorInfo);
      }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
        >
          <AnimatePresence>
            {(isLoading || isFetchingNextPage) && (
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
            {!isLoading && !isFetchingNextPage && data?.pages[0].posts?.length === 0 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-500 dark:text-gray-400 p-8"
              >
                No posts available. Start the conversation!
              </motion.p>
            )}
            {!isLoading && !isFetchingNextPage && data && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="space-y-4"
              >
                {data.pages.map((page) => (
                  page.posts && (
                    <motion.div
                      key={page.nextPage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {page.posts.map((post) => (
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
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Posts;
