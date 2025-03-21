import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

export default function PostACollab({ onSubmit }) {
  const queryClient = useQueryClient();
  const titleRef = useRef(null); // Reference for first input
  const [isOpen, setIsOpen] = useState(false); // State for managing open/close
  const [formData, setFormData] = useState({
    title: "",
    projectType: "Short Film",
    genres: [],
    description: "",
    isPaid: false,
    pay: 0,
    timePeriod: "Less than a week",
    location: "",
    requiredCraftsmen: [],
    imgs: [],
    deadline: "",
    referenceLinks: [],
  });

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCraftsmenChange = (craft, checked) => {
    setFormData((prevData) => {
      const updatedCraftsmen = checked
        ? [...prevData.requiredCraftsmen, craft]
        : prevData.requiredCraftsmen.filter((item) => item !== craft);
      return { ...prevData, requiredCraftsmen: updatedCraftsmen };
    });
  };

  const handleGenresChange = (genre, checked) => {
    setFormData((prevData) => {
      const updatedGenres = checked
        ? [...prevData.genres, genre]
        : prevData.genres.filter((item) => item !== genre);
      return { ...prevData, genres: updatedGenres };
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Files = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );
    setFormData((prevData) => ({
      ...prevData,
      imgs: base64Files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.deadline) {
      return alert("Title, description, and deadline are required.");
    }

    const requestData = {
      ...formData,
      user: "userId_placeholder", // replace with actual user ID from context or auth
      imgs: formData.imgs,
      location: formData.location,
    };

    queryClient.setQueryData(["collabs"], (oldData) => ({
      ...oldData,
      pages: [
        {
          ...oldData.pages[0],
          collabs: [
            { _id: Date.now(), ...requestData },
            ...oldData.pages[0].collabs,
          ],
        },
      ],
    }));

    try {
      const response = await fetch("api/collabs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to create collaboration.");
      }

      alert("Collaboration posted successfully!");
      setFormData({
        title: "",
        projectType: "Short Film",
        genres: [],
        description: "",
        isPaid: false,
        pay: 0,
        timePeriod: "Less than a week",
        location: "",
        requiredCraftsmen: [],
        imgs: [],
        deadline: "",
        referenceLinks: [],
      });
      onSubmit(); // Call onSubmit after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating collaboration.");
    }
  };

  return (
    <Card className="p-4 w-full border-none mx-auto">
      <CardHeader>
        <CardTitle>Create Collaboration Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              ref={titleRef} // Focus will move here automatically
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type</Label>
            <Select
              name="projectType"
              value={formData.projectType}
              onValueChange={(value) =>
                setFormData({ ...formData, projectType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Project Type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Short Film",
                  "Feature Film",
                  "Documentary",
                  "Music Video",
                  "Commercial",
                  "Youtube Video",
                  "Reels or Shorts",
                  "Other",
                ].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Documentary", "Other"].map(
                (genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={formData.genres.includes(genre)}
                      onCheckedChange={(checked) => handleGenresChange(genre, checked)}
                    />
                    <Label htmlFor={genre}>{genre}</Label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPaid: checked })
              }
            />
            <Label htmlFor="isPaid">Is this a paid project?</Label>
          </div>

          {formData.isPaid && (
            <div className="space-y-2">
              <Label htmlFor="pay">Pay Amount</Label>
              <Input
                id="pay"
                name="pay"
                type="number"
                value={formData.pay}
                onChange={handleChange}
                placeholder="Enter pay amount"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="timePeriod">Time Period</Label>
            <Select
              name="timePeriod"
              value={formData.timePeriod}
              onValueChange={(value) =>
                setFormData({ ...formData, timePeriod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Time Period" />
              </SelectTrigger>
              <SelectContent>
                {["Less than a week", "Less than a month", "Less than 3 months", "More than 3 months"].map((period) => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Required Craftsmen</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Video Editor", "Audio Mixer", "Cinematographer", "Scriptwriter", "Voice Artist", "Actor", "Director", "Producer", "Other"].map(
                (craft) => (
                  <div key={craft} className="flex items-center space-x-2">
                    <Checkbox
                      id={craft}
                      checked={formData.requiredCraftsmen.includes(craft)}
                      onCheckedChange={(checked) => handleCraftsmenChange(craft, checked)}
                    />
                    <Label htmlFor={craft}>{craft}</Label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imgs">Upload Images</Label>
            <Input
              id="imgs"
              name="imgs"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceLinks">Reference Links</Label>
            <Textarea
              id="referenceLinks"
              name="referenceLinks"
              value={formData.referenceLinks.join('\n')}
              onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value.split('\n') })}
              placeholder="Enter reference links, one per line"
            />
          </div>

          <Button type="submit">Post Collaboration</Button>
        </form>
      </CardContent>
    </Card>
  );
}
