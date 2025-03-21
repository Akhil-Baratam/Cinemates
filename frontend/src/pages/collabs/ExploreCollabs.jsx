"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import PostACollab from "./components/PostCollab"
import Collabs from "./components/Collabs"
import CollabFilters from "./components/CollabFilters"
import { useQuery } from "@tanstack/react-query"

const ExploreCollabs = () => {
  const [activeFilters, setActiveFilters] = useState({
    projectType: "all",
    genre: "all",
    location: "all"
  })

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleCollabPosted = () => {
    console.log("Collaboration posted successfully")
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
          <PostACollab onSubmit={handleCollabPosted} />
        </div>
        
        <CollabFilters 
          activeFilters={activeFilters} 
          onFilterChange={handleFilterChange} 
        />
        
        <Collabs filters={activeFilters} />
      </div>

      {/* Desktop Layout - 3 Column */}
      <div className="hidden md:grid md:gap-6 md:grid-cols-4">
        {/* Left Column - 1/4 width */}
        <div className="col-span-1 space-y-6">
          <PostACollab onSubmit={handleCollabPosted} />
          
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