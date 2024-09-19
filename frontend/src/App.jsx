import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import ProfilePage from "./pages/profile/ProfilePage";
import CommunityPosts from "./pages/posts/CommunityPosts";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner";
import DiscoverMates from "./pages/posts/DiscoverMates";
import Contact from "./pages/contact/Contact";
import ExploreAds from "./pages/marketplace/ExploreAds";
import ExploreCollabs from "./pages/collabs/ExploreCollabs";
import NotificationPage from "./pages/notifications/NotificationPage";

function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if(isLoading) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Ensure that the user is redirected properly
  return (
    <div className=" bg-white">
          {authUser && <Navbar />}
          <Routes>
            <Route path="/" element={authUser ? <CommunityPosts /> : <HomePage />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/posts" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/posts" />} />
            <Route path="/posts" element={authUser ? <CommunityPosts /> : <Navigate to="/" />} />
            <Route path="/mates" element={authUser ? <DiscoverMates /> : <Navigate to="/" />} />
            <Route path="/collabs/all" element={authUser ? <ExploreCollabs /> : <Navigate to="/" />} />
            <Route path="/ads/explore" element={authUser ? <ExploreAds /> : <Navigate to="/" />} />
            <Route path="/contact" element={authUser ? <Contact /> : <Navigate to="/" />} />
            <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/" />} />
            <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          </Routes>

      <Toaster />
    </div>
  );
}

export default App;
 