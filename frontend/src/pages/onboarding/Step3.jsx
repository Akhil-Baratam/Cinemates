import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Checkbox } from "../../components/ui/checkbox"
import { Button } from "../../components/ui/button"
import { X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

const Step3 = ({ formData, updateFormData }) => {
  const { data: options, isLoading } = useQuery({
    queryKey: ['onboardingOptions'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/onboarding/options`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch onboarding options");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  const handleMultiSelectChange = (name, value) => {
    const updatedValues = formData[name].includes(value)
      ? formData[name].filter((item) => item !== value)
      : [...formData[name], value]
    updateFormData({ [name]: updatedValues })
  }

  const handleArrayInputChange = (e, index, field) => {
    const newArray = [...formData[field]]
    newArray[index] = e.target.value
    updateFormData({ [field]: newArray })
  }

  const addArrayItem = (field) => {
    updateFormData({ [field]: [...formData[field], ""] })
  }

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    updateFormData({ [field]: newArray })
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading options...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Interests</Label>
        <div className="grid grid-cols-3 gap-2">
          {options?.interests?.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={formData.interests.includes(interest)}
                onCheckedChange={() => handleMultiSelectChange("interests", interest)}
              />
              <label htmlFor={interest} className="text-sm">
                {interest}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Collaboration Types</Label>
        <div className="grid grid-cols-3 gap-2">
          {options?.preferredCollabTypes?.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={formData.preferredCollabTypes.includes(type)}
                onCheckedChange={() => handleMultiSelectChange("preferredCollabTypes", type)}
              />
              <label htmlFor={type} className="text-sm">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Past Projects</Label>
        {formData.pastProjects.map((project, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={project}
              onChange={(e) => handleArrayInputChange(e, index, "pastProjects")}
              placeholder="Project URL"
              className="flex-grow"
            />
            <Button type="button" variant="outline" size="icon" onClick={() => removeArrayItem(index, "pastProjects")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => addArrayItem("pastProjects")} variant="outline" size="sm">
          Add Project
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Equipment Owned</Label>
        <div className="grid grid-cols-3 gap-2">
          {options?.equipmentOwned?.map((equipment) => (
            <div key={equipment} className="flex items-center space-x-2">
              <Checkbox
                id={equipment}
                checked={formData.equipmentOwned.includes(equipment)}
                onCheckedChange={() => handleMultiSelectChange("equipmentOwned", equipment)}
              />
              <label htmlFor={equipment} className="text-sm">
                {equipment}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Step3

