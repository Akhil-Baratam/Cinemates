import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/notifications`, {
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
            throw new Error(jsonError.error || "Failed to fetch notifications");
          } catch {
            throw new Error(errorData || "Failed to fetch notifications");
          }
        }

        return res.json();
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
    },
    refetchInterval: 30000,
    staleTime: 15000,
    cacheTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error(error.message || "Failed to load notifications");
    }
  });
};

export default useNotifications;
