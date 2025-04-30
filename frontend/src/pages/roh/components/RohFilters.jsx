"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"

// Categories and Departments from RohModel.js
const categories = [
    "Cameras and Accessories",
    "Lighting Equipment",
    "Audio Gear",
    "Storage and Memory",
    "Studio Setup",
    "Drones and Aerial Equipment",
    "Mobile Filmmaking",
];

// Note: Department might not be a primary filter, but included for potential future use
// const departments = ["Filmmaking", "Photography", "Audio Production", "Post-Production", "Other"];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "false", label: "For Rent" }, // Value corresponds to isForHelp=false
  { value: "true", label: "For Help" },   // Value corresponds to isForHelp=true
]

// Status options from RohModel.js
const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
    { value: "lent", label: "Lent" },
    { value: "reserved", label: "Reserved" },
];

const RohFilters = ({ activeFilters, onFilterChange }) => {

  // Helper to handle select changes and pass "all" as undefined
  const handleSelectChange = (filterName, value) => {
    onFilterChange(filterName, value === "all" ? undefined : value);
  };

  // Helper for text input changes (e.g., location)
   const handleInputChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter by Type (Rent/Help) */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Type</Label>
            <Select 
              value={activeFilters.isForHelp === undefined ? "all" : String(activeFilters.isForHelp)} 
              onValueChange={(value) => handleSelectChange("isForHelp", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Category</Label>
            <Select 
              value={activeFilters.category || "all"} 
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

           {/* Filter by Status */}
           <div className="space-y-1.5">
            <Label className="text-sm font-medium">Status</Label>
            <Select 
              value={activeFilters.status || "all"} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Location (Text Input) */}
          <div className="space-y-1.5">
            <Label htmlFor="location-filter" className="text-sm font-medium">Location</Label>
            <Input
              id="location-filter"
              name="location" // Make sure name matches the filter key
              placeholder="Search by city, area..."
              value={activeFilters.location || ""} // Controlled component
              onChange={handleInputChange}
            />
          </div>

        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RohFilters 