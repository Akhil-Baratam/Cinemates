import React, { useState } from 'react'
import CollabFilters from './components/CollabFilters';
import Collabs from './components/Collabs';

const ExploreCollabs = () => { 
  const [showFilters, setShowFilters] = useState(true);
  return (
    <div className=" flex items-center bg-white mx-auto p-4">
      <CollabFilters />
      <Collabs />
    </div>
  )
}

export default ExploreCollabs