import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { 
    mutate: follow,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to update follow status");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Follow status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Failed to update follow status");
    },
  });

  return { follow, isPending, isSuccess, isError };
};

export default useFollow;
