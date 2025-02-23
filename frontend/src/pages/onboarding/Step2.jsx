import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"

const Step2 = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handleSelectChange = (name, value) => {
    updateFormData({ [name]: value })
  }

  const handleMultiSelectChange = (name, value) => {
    const updatedValues = formData[name].includes(value)
      ? formData[name].filter((item) => item !== value)
      : [...formData[name], value]
    updateFormData({ [name]: updatedValues })
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="profession" className="text-sm font-medium">
          Profession
        </Label>
        <Select name="profession" onValueChange={(value) => handleSelectChange("profession", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="director">Director</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="actor">Actor</SelectItem>
            <SelectItem value="cinematographer">Cinematographer</SelectItem>
            <SelectItem value="producer">Producer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceLevel" className="text-sm font-medium">
          Experience Level
        </Label>
        <Select name="experienceLevel" onValueChange={(value) => handleSelectChange("experienceLevel", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 col-span-2">
        <Label className="text-sm font-medium">Skills</Label>
        <div className="grid grid-cols-3 gap-2">
          {["Cinematography", "VFX", "Sound Editing", "Screenwriting", "Lighting", "Color Grading"].map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={formData.skills.includes(skill)}
                onCheckedChange={() => handleMultiSelectChange("skills", skill)}
              />
              <label htmlFor={skill} className="text-sm">
                {skill}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 col-span-2">
        <Label className="text-sm font-medium">Genres</Label>
        <div className="grid grid-cols-3 gap-2">
          {["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Documentary"].map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={genre}
                checked={formData.genres.includes(genre)}
                onCheckedChange={() => handleMultiSelectChange("genres", genre)}
              />
              <label htmlFor={genre} className="text-sm">
                {genre}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="availableForCollaboration"
          checked={formData.availableForCollaboration}
          onCheckedChange={(checked) => updateFormData({ availableForCollaboration: checked })}
        />
        <Label htmlFor="availableForCollaboration" className="text-sm">
          Available for Collaboration
        </Label>
      </div>
    </div>
  )
}

export default Step2

