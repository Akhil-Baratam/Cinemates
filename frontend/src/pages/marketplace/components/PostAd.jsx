import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useClickAway } from "react-use";
import { useForm } from "react-hook-form";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { Film, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const categories = [
  { value: "Camera", label: "Cameras" },
  { value: "Lens", label: "Lenses" },
  { value: "Audio", label: "Audio Equipment" },
  { value: "Lighting", label: "Lighting" },
  { value: "Accessories", label: "Accessories" },
  { value: "Other", label: "Other" }
];

const conditions = [
  { value: "New", label: "New" },
  { value: "Like New", label: "Like New" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" }
];

const PostAd = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const { register, handleSubmit, watch, setValue, reset } = useForm();

  useClickAway(modalRef, () => setIsOpen(false));

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate file count
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) toast.error(`${file.name} is not a valid image type`);
      if (!isValidSize) toast.error(`${file.name} is too large (max 5MB)`);
      
      return isValidType && isValidSize;
    });

    setSelectedImages(validFiles);

    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (data) => {
    try {
      // Convert images to base64
      const imagePromises = selectedImages.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      // Combine form data with images
      const formData = {
        ...data,
        imgs: base64Images
      };

      await onSubmit(formData);
      setIsOpen(false);
      reset();
      setSelectedImages([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Error posting ad:", error);
      toast.error("Failed to post ad");
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-full bg-gradient-to-r from-gray-900 to-slate-900 hover:from-gray-800 hover:to-slate-800 text-white font-medium"
      >
        List Equipment
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={modalRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-6 left-0 h-[94%] z-50 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-4xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">List Your Equipment</h2>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                  {/* Basic Details */}
                  <div className="space-y-4">
                    <Input
                      {...register("productName", { required: true })}
                      placeholder="Equipment Name"
                    />
                    <Select
                      onValueChange={(value) => setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      {...register("description", { required: true })}
                      placeholder="Description"
                      className="h-32"
                    />
                  </div>

                  {/* Price and Condition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      {...register("price", { required: true, min: 0 })}
                      placeholder="Price"
                    />
                    <Select
                      onValueChange={(value) => setValue("condition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Condition" />
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

                  {/* Images */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Film className="h-5 w-5 text-zinc-700" />
                      <h3 className="font-semibold text-lg">Upload Images</h3>
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                    />

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Click to upload images (max 5)
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPEG, PNG, WebP (max 5MB each)
                      </p>
                    </div>

                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Price Negotiable</Label>
                      <Switch
                        onCheckedChange={(checked) =>
                          setValue("isNegotiable", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Has Warranty</Label>
                      <Switch
                        onCheckedChange={(checked) =>
                          setValue("warranty.hasWarranty", checked)
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Post Listing
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostAd; 