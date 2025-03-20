"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogTrigger } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import PostACollab from "./components/PostACollab"
import Collabs from "./components/Collabs"
import CollabFilters from "./components/CollabFilters"

const ExploreCollabs = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    projectType: "all",
    genre: "all",
    location: "all"
  })

  const handleDialogClose = () => {
    setIsOpen(false)
  }

  const handleDialogOpen = () => {
    setIsOpen(true)
  }

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto pt-16"
    >
      {/* Mobile Layout - Single Column */}
      <div className="md:hidden space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Collaboration Posts</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-primary text-white hover:bg-primary/90"
                onClick={handleDialogOpen}
              >
                Post A Collab
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogTitle>Create Collaboration Post</DialogTitle>
              <DialogDescription>
                Share your project idea and find collaborators
              </DialogDescription>
              <PostACollab onSubmit={handleDialogClose} />
            </DialogContent>
          </Dialog>
        </div>
        
        <CollabFilters 
          activeFilters={activeFilters} 
          onFilterChange={handleFilterChange} 
        />
        
        <Collabs filters={activeFilters} />
      </div>

      {/* Desktop Layout - 3 Column */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        {/* Left Column - 1/4 width */}
        <div className="col-span-1 space-y-6">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-primary text-white hover:bg-primary/90"
                onClick={handleDialogOpen}
              >
                Post A Collab
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto" >
              <DialogTitle>Create Collaboration Post</DialogTitle>
              <DialogDescription>
                Share your project idea and find collaborators
              </DialogDescription>
              <PostACollab onSubmit={handleDialogClose} />
            </DialogContent>
          </Dialog>
          
          <CollabFilters 
            activeFilters={activeFilters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {/* Middle Column - 2/4 width */}
        <div className="col-span-2">
          <Collabs filters={activeFilters} />
        </div>
        
        {/* Right Column - 1/4 width */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">My Collabs</h2>
          {/* Implementation will be done later */}
        </div>
      </div>
    </motion.div>
  )
}

export default ExploreCollabs
