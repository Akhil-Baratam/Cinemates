import React, { useState } from "react";
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import PostACollab from "./components/PostACollab";

const ExploreCollabs = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  const handleDialogOpen = () => {
    setIsOpen(true);
  }; 

  return (
    <div className="flex items-center justify-center bg-white mx-auto p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="bg-black rounded-md px-4 py-2 text-white" onClick={handleDialogOpen}>
          Post a Collab
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-[80vh] overflow-y-auto my-2">
          <DialogTitle>Create Collaboration Post</DialogTitle>
          <DialogDescription>
            {/* Any description you want */}
          </DialogDescription>
          <PostACollab onSubmit={handleDialogClose} /> {/* Pass close function as prop */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExploreCollabs;
