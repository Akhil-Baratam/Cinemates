import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext"; // Centralized authentication context
import Navbar from "./components/Navbar/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// Public Pages
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";

// Protected Pages
import ProfilePage from "./pages/profile/ProfilePage";
import CommunityPosts from "./pages/posts/CommunityPosts";
import Chat from "./pages/chat/index";
import DiscoverMates from "./pages/posts/DiscoverMates";
import Contact from "./pages/contact/Contact";
import ExploreAds from "./pages/marketplace/ExploreAds";
import ExploreCollabs from "./pages/collabs/ExploreCollabs";
import NotificationPage from "./pages/notifications/NotificationPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

// Layout components to handle different authentication states
const PublicLayout = ({ children }) => {
  return <div className="bg-white font-poppins">{children}</div>;
};

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="bg-white font-poppins">
      <Navbar />
      {children}
    </div>
  );
};

// Route guards with clearer responsibility separation
const PublicRoute = ({ element }) => {
  const { authUser } = useAuth();
  
  // Redirect authenticated users to their appropriate landing page
  if (authUser) {
    return <Navigate to={authUser.onboardingCompleted ? "/posts" : "/onboarding"} replace />;
  }
  
  return <PublicLayout>{element}</PublicLayout>;
};

const AuthRoute = ({ element }) => {
  const { authUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <AuthenticatedLayout>{element}</AuthenticatedLayout>;
};

const OnboardingRoute = ({ element }) => {
  const { authUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If onboarding is completed, redirect to main content
  if (authUser.onboardingCompleted) {
    return <Navigate to="/posts" replace />;
  }
  
  // Render onboarding without the main layout
  return <PublicLayout>{element}</PublicLayout>;
};

const CompletedOnboardingRoute = ({ element }) => {
  const { authUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to onboarding if not completed
  if (!authUser.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <AuthenticatedLayout>{element}</AuthenticatedLayout>;
};

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute element={<HomePage />} />} />
        <Route path="/signup" element={<PublicRoute element={<SignUpPage />} />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />

        {/* Onboarding route */}
        <Route path="/onboarding" element={<OnboardingRoute element={<OnboardingPage />} />} />

        {/* Protected routes requiring completed onboarding */}
        <Route path="/posts" element={<CompletedOnboardingRoute element={<CommunityPosts />} />} />
        <Route path="/profile/:username" element={<CompletedOnboardingRoute element={<ProfilePage />} />} />
        <Route path="/chat/:id" element={<CompletedOnboardingRoute element={<Chat />} />} />
        <Route path="/mates" element={<CompletedOnboardingRoute element={<DiscoverMates />} />} />
        <Route path="/collabs" element={<CompletedOnboardingRoute element={<ExploreCollabs />} />} />
        <Route path="/ads/explore" element={<CompletedOnboardingRoute element={<ExploreAds />} />} />
        <Route path="/contact" element={<CompletedOnboardingRoute element={<Contact />} />} />
        <Route path="/notifications" element={<CompletedOnboardingRoute element={<NotificationPage />} />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;