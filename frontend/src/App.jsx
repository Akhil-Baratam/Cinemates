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

// Higher Order Components for Route Protection
const ProtectedRoute = ({ element }) => {
  const { authUser, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner size="lg" />;
  return authUser ? element : <Navigate to="/login" />;
};

const OnboardingGuard = ({ element }) => {
  const { authUser, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner size="lg" />;
  return authUser?.onboardingCompleted ? element : <Navigate to="/onboarding" />;
};

function App() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-white font-poppins">
      {/* Show Navbar only for authenticated users (except onboarding) */}
      {authUser && !window.location.pathname.includes('/onboarding') && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={authUser ? <Navigate to="/posts" /> : <HomePage />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={authUser?.onboardingCompleted ? "/posts" : "/onboarding"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={authUser?.onboardingCompleted ? "/posts" : "/onboarding"} />} />

        {/* Protected Routes (Accessible only if logged in) */}
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
        <Route path="/posts" element={<OnboardingGuard element={<CommunityPosts />} />} />
        <Route path="/profile/:username" element={<OnboardingGuard element={<ProfilePage />} />} />
        <Route path="/chat/:id" element={<OnboardingGuard element={<Chat />} />} />
        <Route path="/mates" element={<OnboardingGuard element={<DiscoverMates />} />} />
        <Route path="/collabs" element={<OnboardingGuard element={<ExploreCollabs />} />} />
        <Route path="/ads/explore" element={<OnboardingGuard element={<ExploreAds />} />} />
        <Route path="/contact" element={<OnboardingGuard element={<Contact />} />} />
        <Route path="/notifications" element={<OnboardingGuard element={<NotificationPage />} />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
