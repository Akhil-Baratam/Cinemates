const onboardingOptions = {
  professions: [
    "Director", 
    "Editor", 
    "Actor", 
    "Cinematographer", 
    "Producer",
    "Sound Designer",
    "Screenwriter",
    "VFX Artist",
    "Production Designer"
  ],
  experienceLevels: ["Beginner", "Intermediate", "Professional"],
  skills: [
    "Cinematography", 
    "VFX", 
    "Sound Editing", 
    "Screenwriting", 
    "Lighting", 
    "Color Grading",
    "Storyboarding",
    "Camera Operation",
    "Set Design",
    "Film Scoring"
  ],
  genres: [
    "Action", 
    "Drama", 
    "Comedy", 
    "Sci-Fi", 
    "Horror", 
    "Documentary",
    "Animation",
    "Thriller",
    "Romance",
    "Fantasy"
  ],
  interests: [
    "Filmmaking", 
    "Screenwriting", 
    "Editing", 
    "Cinematography", 
    "Sound Design", 
    "Production",
    "Visual Effects",
    "Film Theory",
    "Film History",
    "Independent Cinema"
  ],
  preferredCollabTypes: [
    "Short Films", 
    "Documentaries", 
    "Music Videos", 
    "Feature Films", 
    "Web Series", 
    "Commercials",
    "Corporate Videos",
    "Television",
    "Experimental",
    "Student Films"
  ],
  equipmentOwned: [
    "Camera", 
    "Lighting", 
    "Sound", 
    "Editing Software", 
    "Drone", 
    "Stabilizer",
    "Lenses",
    "Audio Recorder",
    "Green Screen",
    "Microphones"
  ]
};

const getOnboardingOptions = async (req, res) => {
  try {
    res.status(200).json(onboardingOptions);
  } catch (error) {
    console.error("Error in getOnboardingOptions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getOnboardingOptions };

