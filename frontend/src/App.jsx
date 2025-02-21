import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import ProfilePage from "./pages/profile/ProfilePage";
import CommunityPosts from "./pages/posts/CommunityPosts";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner";
import Chat from "./pages/chat/index";
import DiscoverMates from "./pages/posts/DiscoverMates";
import Contact from "./pages/contact/Contact";
import ExploreAds from "./pages/marketplace/ExploreAds";
import ExploreCollabs from "./pages/collabs/ExploreCollabs";
import NotificationPage from "./pages/notifications/NotificationPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

function App() { 

  const {data: authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
        });

        // Check content type before parsing
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Received non-JSON response");
          return null;
        }

        const data = await res.json();
        
        if (!res.ok) {
          if (res.status === 401) {
            return null; // Handle unauthorized gracefully
          }
          throw new Error(data.error || "Something went wrong");
        }
        
        return data;
      } catch (error) {
        // Log the full error for debugging
        console.error("Auth check error details:", {
          message: error.message,
          stack: error.stack
        });
        return null;
      }
    },
    retry: false,
    staleTime: 5*60*1000,
    refetchOnWindowFocus: false
  });

  if(isLoading) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className=" bg-white font-poppins">
          {authUser && !window.location.pathname.includes('/onboarding') && <Navbar />}

          <Routes>
            <Route path="/" element={authUser ? <CommunityPosts /> : <HomePage />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/posts" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/posts" />} />
            <Route path="/posts" element={authUser ? <CommunityPosts /> : <Navigate to="/" />} />
            <Route path="/chat/:id" element={authUser ? <Chat /> : <Navigate to="/" />} />
            <Route path="/mates" element={authUser ? <DiscoverMates /> : <Navigate to="/" />} />
            <Route path="/collabs" element={authUser ? <ExploreCollabs /> : <Navigate to="/" />} />
            <Route path="/ads/explore" element={authUser ? <ExploreAds /> : <Navigate to="/" />} />
            <Route path="/contact" element={authUser ? <Contact /> : <Navigate to="/" />} />
            <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/" />} />
            <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

      <Toaster />
    </div>
  );
}

export default App;
 