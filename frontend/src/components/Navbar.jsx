import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, User, Menu } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logoBlack.png";

// Dropdown Component
const Dropdown = ({ title, items, currentPath }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isActive = items.some(item => currentPath === item.link);

  return (
    <li
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center ${isActive ? 'font-semibold text-primary' : ''}`}>
        {title}
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 ml-1" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 bg-white text-black font-light border border-slate-300 rounded-lg shadow-lg whitespace-nowrap z-10"
          >
            {items.map((item, index) => (
              <Link to={item.link} key={index}>
                <li
                  className={`p-2 hover:bg-gray-100 rounded-sm px-6 ${
                    currentPath === item.link ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  {item.name}
                </li>
              </Link>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

// Profile Dropdown Component
const ProfileDropdown = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.Error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  const {data: authUser} = useQuery({queryKey: ["authUser"]});

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors duration-200">
        <User />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10"
          >
            <Link to={`/profile/${authUser.username}`}>
              <li className="p-2 hover:bg-gray-100 rounded-sm px-6">Profile</li>
            </Link>
            <li
              className="p-2 hover:bg-gray-100 rounded-sm px-6 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Navbar Component
const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const socialLinks = [
    { name: "Chats", link: "/chats" },
    { name: "Community Posts", link: "/posts" },
    { name: "Discover mates", link: "/mates" },
  ];

  const collabLinks = [
    { name: "Explore Collabs", link: "/collabs/all" },
    { name: "Post a collab", link: "/collabs/create" },
    { name: "My Collabs", link: `/collabs/user/akki` },
  ];

  const marketplaceLinks = [
    { name: "Explore Ads", link: "/ads/explore" },
    { name: "Post a Ad", link: "/ads/post" },
    { name: "My ads", link: "/ads/username" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:block">
            <ProfileDropdown />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
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
                  <User className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">User Name</div>
                  <div className="text-sm font-medium text-gray-500">user@example.com</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Profile</Link>
                <button onClick={() => {/* handle logout */}} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Logout</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;