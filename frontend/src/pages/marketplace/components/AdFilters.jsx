import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { motion } from "framer-motion";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Camera", label: "Cameras" },
  { value: "Lens", label: "Lenses" },
  { value: "Audio", label: "Audio Equipment" },
  { value: "Lighting", label: "Lighting" },
  { value: "Accessories", label: "Accessories" },
  { value: "Other", label: "Other" }
];

const conditions = [
  { value: "all", label: "All Conditions" },
  { value: "New", label: "New" },
  { value: "Like New", label: "Like New" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" }
];

const AdFilters = ({ activeFilters, onFilterChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Equipment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={activeFilters.category} 
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={activeFilters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Max"
                value={activeFilters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-1/2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Condition</label>
            <Select 
              value={activeFilters.condition} 
              onValueChange={(value) => onFilterChange("condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdFilters; 