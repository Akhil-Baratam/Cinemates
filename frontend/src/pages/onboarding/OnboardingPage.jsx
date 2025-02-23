"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, User, Briefcase, Settings } from "lucide-react"
import { cn } from "../../lib/utils"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const steps = [
  {
    title: "Basic Information",
    icon: User,
    description: "Create your profile",
  },
  {
    title: "Professional Details",
    icon: Briefcase,
    description: "Your work preferences",
  },
  {
    title: "Additional Info",
    icon: Settings,
    description: "Final touches",
  },
]

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profileImg: null,
    coverImg: null,
    bio: "",
    link: "",
    profession: "",
    skills: [],
    experienceLevel: "",
    genres: [],
    location: "",
    availableForCollaboration: false,
    interests: [],
    preferredCollabTypes: [],
    pastProjects: [],
    equipmentOwned: [],
  })

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 2))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove empty fields before sending
    const sanitizedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "" && value !== null)
    );

    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/onboarding`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedData), // Send as JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to complete onboarding");
        }

        const data = await response.json();

        if (!data.username) {
          throw new Error("Username is missing from the response!");
        }
      
        toast.success("Onboarding completed successfully!");
        navigate(`/profile/${data.username}`);
    } catch (error) {
        console.error("Error during onboarding submission:", error);
        toast.error(error.message || "Onboarding failed");
    }
};


  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[1300px] min-h-[800px] mx-16 lg:mx-0 flex flex-col lg:flex-row">
        {/* Header for mobile */}
        <div className="lg:hidden p-6">
          <button className="flex items-center text-sm text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to dashboard
          </button>
        </div>

        {/* Progress Section */}
        <motion.div
          className="w-full lg:w-80 p-6 lg:py-8 px-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back button for desktop */}
          <div className="hidden lg:flex items-center text-sm text-gray-600 mb-12">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to dashboard
          </div>

          {/* Progress Steps */}
          <div className="flex lg:flex-col gap-4 lg:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-start flex-1 lg:flex-none">
                  <div className="relative flex flex-col items-center">
                    <div className="relative flex items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                          i === step
                            ? "border-gray-900 bg-gray-50"
                            : i < step
                              ? "border-gray-900 bg-gray-900"
                              : "border-gray-200 bg-white",
                        )}
                      >
                        {i < step ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <Icon className={cn("h-4 w-4", i === step ? "text-gray-900" : "text-gray-400")} />
                        )}
                      </motion.div>
                      {/* Horizontal line for mobile/tablet */}
                      {i < steps.length - 1 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "80px" }}
                          transition={{ duration: 0.9, delay: i * 0.5 }}
                          className={cn(
                            "lg:hidden absolute left-full top-1/2 -translate-y-1/2 h-0.5 ml-2", // Position line relative to icon
                            i < step ? "bg-gray-900" : "bg-gray-200"
                          )}
                        />
                      )}
                    </div>
                    
                    {/* Vertical line for desktop */}
                    {i < steps.length - 1 && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "12px" }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className={cn(
                          "hidden lg:block absolute top-8 left-1/2 w-0.5 transition-colors duration-300",
                          i < step ? "bg-gray-900" : "bg-gray-200",
                        )}
                      />
                    )}
                    {/* Badge for Step Title */}
                    <div className="lg:hidden mt-2 text-nowrap">
                      <span className="bg-slate-50 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {s.title}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 hidden lg:block">
                    <h3
                      className={cn(
                        "font-medium transition-colors duration-300",
                        i === step ? "text-gray-900" : i < step ? "text-gray-700" : "text-gray-400",
                      )}
                    >
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-500">{s.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          className="flex-1 p-6 lg:mt-12 lg:p-12 lg:max-w-[800px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1">
                <div> 
                  <h2 className="text-2xl font-semibold mb-1">{steps[step].title}</h2>
                  <p className="text-gray-500 mb-8">{steps[step].description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 lg:pl-6">
                  {step === 0 && <Step1 formData={formData} updateFormData={updateFormData} />}
                  {step === 1 && <Step2 formData={formData} updateFormData={updateFormData} />}
                  {step === 2 && <Step3 formData={formData} updateFormData={updateFormData} />}
                </form>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                    step === 0 ? "invisible" : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={step === 2 ? handleSubmit : handleNext}
                  className="px-6 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  {step === 2 ? "Complete" : "Continue"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default OnboardingForm

