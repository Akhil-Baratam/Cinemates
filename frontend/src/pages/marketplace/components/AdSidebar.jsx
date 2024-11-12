import React, { useState } from 'react'
import { Search, Home, ShoppingCart, Star, Heart, Bell, Settings, ChevronDown } from 'lucide-react'
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Slider } from "../../../components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
const AdSidebar = () => {
  return (
    <div className=' m-4'>
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Product Ads</h1>
        </div>
        <h2 className="font-semibold mb-2">Categories</h2>
        <div>
          <h2 className="font-semibold mb-2">Filter by</h2>
          <div className="mb-4">
            <h3 className="text-sm mb-2">Price</h3>
            <Slider defaultValue={[20]} max={100} step={1} className="mb-2" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Min: $120</span>
              <span>Max: $2000</span>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-sm mb-2">Color</h3>
            <div className="flex gap-2">
              {['bg-blue-500', 'bg-gray-300', 'bg-yellow-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500'].map((color) => (
                <div key={color} className={`w-6 h-6 rounded-full ${color} cursor-pointer`}></div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm mb-2">Material</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Metal', 'Wood', 'Glass', 'Stone', 'Acrilic'].map((material) => (
                <Badge key={material} variant="outline" className="cursor-pointer">{material}</Badge>
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdSidebar