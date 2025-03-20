"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

const CollabFilters = ({ activeFilters, onFilterChange }) => {
  const projectTypes = [
    { value: "all", label: "All Projects" },
    { value: "film", label: "Film" },
    { value: "music", label: "Music" },
    { value: "photography", label: "Photography" },
    { value: "writing", label: "Writing" },
    { value: "other", label: "Other" },
  ]

  const genres = [
    { value: "all", label: "All Genres" },
    { value: "action", label: "Action" },
    { value: "comedy", label: "Comedy" },
    { value: "drama", label: "Drama" },
    { value: "documentary", label: "Documentary" },
    { value: "horror", label: "Horror" },
    { value: "scifi", label: "Sci-Fi" },
  ]

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "remote", label: "Remote" },
    { value: "local", label: "Local" },
    { value: "hybrid", label: "Hybrid" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Collabs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Type</label>
            <Select value={activeFilters.projectType} onValueChange={(value) => onFilterChange("projectType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>
            <Select value={activeFilters.genre} onValueChange={(value) => onFilterChange("genre", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.value} value={genre.value}>
                    {genre.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select value={activeFilters.location} onValueChange={(value) => onFilterChange("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CollabFilters

