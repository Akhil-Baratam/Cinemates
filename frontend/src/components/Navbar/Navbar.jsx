import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logoBlack.png";
import Dropdown from "./Dropdown";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBox from "./NotificationBox";
import { ErrorBoundary } from "react-error-boundary";

const Navbar = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.Error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const socialLinks = useMemo(() => [
    { name: "Chats", link: "/chats" },
    { name: "Community Posts", link: "/posts" },
    { name: "Discover mates", link: "/mates" },
  ], []);

  const collabLinks = useMemo(() => [
    { name: "Explore Collabs", link: "/collabs/all" },
    { name: "Post a collab", link: "/collabs/create" },
    { name: "My Collabs", link: `/collabs/user/${authUser?.username}` },
  ], [authUser?.username]);

  const marketplaceLinks = useMemo(() => [
    { name: "Explore Ads", link: "/ads/explore" },
    { name: "Post an Ad", link: "/ads/post" },
    { name: "My ads", link: `/ads/${authUser?.username}` },
  ], [authUser?.username]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <nav className="bg-white">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img src={logo} alt="Logo" className="w-40 h-auto" />
              </Link>
            </div>
            <div className="hidden md:block">
              <ul className="flex items-center space-x-8 font-normal">
                <Dropdown title="Social" items={socialLinks} currentPath={currentPath} />
                <Dropdown title="Collabs" items={collabLinks} currentPath={currentPath} />
                <Dropdown title="Marketplace" items={marketplaceLinks} currentPath={currentPath} />
                <li className={`${currentPath === '/rentorhelp/all' ? 'text-primary font-semibold' : ''} hover:text-primary transition-colors duration-200`}>
                  <Link to="/rentorhelp/all">Rent/Help</Link>
                </li>
                <li className={`${currentPath === '/contact' ? 'text-primary font-semibold' : ''} hover:text-primary transition-colors duration-200`}>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="hidden md:flex justify-center gap-2 items-center">
              <NotificationBox authUser={authUser} />
              <ProfileDropdown handleLogout={handleLogout} authUser={authUser} />
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-label="Toggle mobile menu"
              >
                <Menu className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/chats" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Chats</Link>
                <Link to="/posts" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Community Posts</Link>
                <Link to="/mates" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Discover mates</Link>
                <Link to="/collabs/all" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Explore Collabs</Link>
                <Link to="/ads/explore" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Explore Ads</Link>
                <Link to="/rentorhelp/all" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Rent/Help</Link>
                <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Contact</Link>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={authUser?.profileImg} alt={authUser?.fullName} />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{authUser?.username}</div>
                    <div className="text-sm font-medium text-gray-500">{authUser?.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link to={`/profile/${authUser?.username}`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Logout</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </ErrorBoundary>
  );
};

export default Navbar;