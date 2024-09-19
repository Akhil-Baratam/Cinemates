import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

const ProfileDropdown = React.memo(({ handleLogout, authUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={authUser.profileImg}
            alt={authUser.fullName}
          />
          <AvatarFallback>
            {authUser.fullName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10"
          >
            <li>
              <Link
                to={`/profile/${authUser.username}`}
                className="block p-2 hover:bg-gray-100 rounded-sm px-6"
                onClick={toggleDropdown}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                className="w-full text-left p-2 hover:bg-gray-100 rounded-sm px-6 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ProfileDropdown;