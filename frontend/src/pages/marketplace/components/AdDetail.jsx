import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatPrice, formatDate } from "../../../utils/formatters";
import { useAuthContext } from "../../../context/AuthContext";

const AdDetail = () => {
  const { id } = useParams();
  const { authUser } = useAuthContext();

  const { data: ad, isLoading, error } = useQuery({
    queryKey: ["ad", id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ads/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch ad details");
      return res.json();
    },
  });

  const { mutate: toggleInterest, isLoading: isTogglingInterest } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/ads/${id}/toggle-interest`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to update interest");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ad", id]);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  const isInterested = ad.interests.some(
    (interest) => interest._id === authUser?._id
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            {ad.imgs?.[0] && (
              <img
                src={ad.imgs[0].url}
                alt={ad.productName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ad.imgs?.slice(1).map((img, index) => (
              <div
                key={index}
                className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={`${ad.productName} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{ad.productName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{ad.category}</Badge>
              <Badge variant="outline" className="bg-muted">
                {ad.condition}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {formatPrice(ad.price, ad.currency)}
              </p>
              {ad.isNegotiable && (
                <p className="text-sm text-muted-foreground">Price negotiable</p>
              )}
            </div>
            <Button
              onClick={() => toggleInterest()}
              disabled={isTogglingInterest}
              variant={isInterested ? "outline" : "default"}
            >
              {isInterested ? "Remove Interest" : "Show Interest"}
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {ad.description}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Location:</span> {ad.location}
            </p>
            <p className="text-sm">
              <span className="font-medium">Posted by:</span>{" "}
              {ad.user.username}
            </p>
            <p className="text-sm">
              <span className="font-medium">Purchase Date:</span>{" "}
              {formatDate(ad.bought_on)}
            </p>
            {ad.warranty?.hasWarranty && (
              <p className="text-sm">
                <span className="font-medium">Warranty until:</span>{" "}
                {formatDate(ad.warranty.expiryDate)}
              </p>
            )}
          </div>

          {/* Contact Section */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Options</h2>
            <div className="space-y-2">
              {ad.contactPreferences.email && (
                <Button variant="outline" className="w-full">
                  Email Seller
                </Button>
              )}
              {ad.contactPreferences.chat && (
                <Button variant="outline" className="w-full">
                  Chat with Seller
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdDetail; 