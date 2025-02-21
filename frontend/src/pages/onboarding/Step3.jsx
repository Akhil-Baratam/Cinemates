import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Checkbox } from "../../components/ui/checkbox"
import { Button } from "../../components/ui/button"
import { X } from "lucide-react"

const Step3 = ({ formData, updateFormData }) => {
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Interests</Label>
        <div className="grid grid-cols-3 gap-2">
          {["Filmmaking", "Screenwriting", "Editing", "Cinematography", "Sound Design", "Production"].map(
            (interest) => (
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
            ),
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Collaboration Types</Label>
        <div className="grid grid-cols-3 gap-2">
          {["Short Films", "Documentaries", "Music Videos", "Feature Films", "Web Series", "Commercials"].map(
            (type) => (
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
            ),
          )}
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
          {["Camera", "Lighting", "Sound", "Editing Software", "Drone", "Stabilizer"].map((equipment) => (
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

