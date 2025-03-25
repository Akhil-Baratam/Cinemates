import { useQuery } from "@tanstack/react-query";
import { Card } from "../../../components/ui/card";
import LoadingSpinner from "../../../components/LoadingSpinner";

const MyCollabs = () => {
  const { data: collabs, isLoading, error } = useQuery({
    queryKey: ["userCollabs"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/collabs/user`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch collabs");
      return res.json();
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="space-y-4">
      {collabs?.map((collab) => (
        <CollabCard key={collab._id} collab={collab} />
      ))}
    </div>
  );
};

// Subcomponent for individual collab cards
const CollabCard = ({ collab }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Upper section - Title */}
      <div className="px-3 py-1 border-b">
        <h3 className="font-medium text-sm line-clamp-1">{collab.title}</h3>
      </div>
      
      {/* Lower section - Description and Project Type */}
      <div className="p-3 flex items-center justify-between">
        <div className="relative flex-1 pr-4">
          <p className="text-sm text-muted-foreground line-clamp-1">
            {collab.description}
          </p>
          {/* Gradient overlay for text fade effect */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-transparent to-background" />
        </div>
        <span className="text-xs px-2 py-1 bg-muted rounded-full whitespace-nowrap">
          {collab.projectType}
        </span>
      </div>
    </Card>
  );
};

export default MyCollabs;