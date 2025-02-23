import { useRef, useState } from "react";
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"

const Step1 = ({ formData, updateFormData }) => {

  const [coverImgPreview, setCoverImgPreview] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(null);
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    updateFormData({ [name]: files[0] })
  }

  const handleImgChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            updateFormData({ [type]: reader.result }); // Store Base64 string
            if (type === "profileImg") {
                setProfileImgPreview(reader.result);
            } else if (type === "coverImg") {
                setCoverImgPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }
};


  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name
        </Label>
        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          Username
        </Label>
        <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImg" className="text-sm font-medium">
          Profile Image
        </Label>
        <div>
          <Input id="profileImg" name="profileImg" type="file" ref={profileImgRef} onChange={(e) => handleImgChange(e, "profileImg")} accept="image/*" />
          {profileImgPreview && (
            <img src={profileImgPreview} alt="Profile Preview" className="mt-2 w-20 h-20 object-cover rounded-full" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImg" className="text-sm font-medium">
          Cover Image
        </Label>
        <div>
          <Input id="coverImg" name="coverImg" type="file" ref={coverImgRef} onChange={(e) => handleImgChange(e, "coverImg")} accept="image/*" />
          {coverImgPreview && (
            <img src={coverImgPreview} alt="Cover Preview" className="mt-2 w-full h-32 object-cover rounded" />
          )}
        </div>
      </div>

      <div className="space-y-2 col-span-2">
        <Label htmlFor="bio" className="text-sm font-medium">
          Bio
        </Label>
        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} className="resize-none" />
      </div>

      <div className="space-y-2 col-span-2">
        <Label htmlFor="link" className="text-sm font-medium">
          Website/Portfolio Link
        </Label>
        <Input
          id="link"
          name="link"
          type="url"
          value={formData.link}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>
    </div>
  )
}

export default Step1

