import { useQuery } from "@tanstack/react-query";
import { Card } from "../../../components/ui/card";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Badge } from "../../../components/ui/badge";
import { formatPrice } from "../../../utils/formatters";
import toast from "react-hot-toast";

const MyAds = () => {
  const { data: ads, isLoading, error } = useQuery({
    queryKey: ["userAds"],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ads/user`, {
          credentials: "include",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch ads");
        }

        return res.json();
      } catch (error) {
        console.error("Error fetching user ads:", error);
        throw error;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to load your ads");
    }
  });

  if (isLoading) return (
    <div className="flex justify-center items-center p-4">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="text-center p-4">
      <p className="text-red-500 text-sm">Failed to load ads</p>
    </div>
  );

  // Get only the latest 5 ads
  const latestAds = ads?.slice(0, 5) || [];

  if (latestAds.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground text-sm">No ads posted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {latestAds.map((ad) => (
        <Card 
          key={ad._id} 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="p-3 flex items-center justify-between">
            <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
              <h3 className="font-medium text-sm line-clamp-1">{ad.productName}</h3>
              <p className="text-sm text-muted-foreground">
                {formatPrice(ad.price, ad.currency)}
              </p>
            </div>
            <Badge 
              variant={ad.isSold ? "secondary" : "default"}
              className="whitespace-nowrap ml-2"
            >
              {ad.isSold ? "Sold" : "Active"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MyAds;