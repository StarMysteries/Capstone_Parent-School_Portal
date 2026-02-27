import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthUser } from "@/lib/auth";

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseMenu = () => setIsOpen(false);

  const handleLogout = () => {
    clearAuthUser();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
        aria-label="Open profile menu"
      >
        <User className="h-6 w-6 text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-56">
          <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-(--button-hover-green) bg-(--button-green)" />
          <div className="relative origin-top-right overflow-hidden rounded-xl border border-(--button-hover-green) bg-(--button-green) py-1 shadow-2xl transition-all duration-200 hover:shadow-2xl">
            <button
              type="button"
              onClick={handleCloseMenu}
              className="block w-full px-4 py-2 text-left text-base font-medium text-white transition-all duration-200 hover:bg-(--button-hover-green) hover:pl-5 hover:tracking-wide"
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={handleCloseMenu}
              className="block w-full px-4 py-2 text-left text-base font-medium text-white transition-all duration-200 hover:bg-(--button-hover-green) hover:pl-5 hover:tracking-wide"
            >
              Manage Account
            </button>
            <button
              type="button"
              onClick={handleCloseMenu}
              className="block w-full px-4 py-2 text-left text-base font-medium text-white transition-all duration-200 hover:bg-(--button-hover-green) hover:pl-5 hover:tracking-wide"
            >
              Change Password
            </button>
            <div className="mx-3 my-1 border-t border-white/30" />
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-base font-semibold text-white transition-all duration-200 hover:bg-(--button-hover-green) hover:pl-5 hover:tracking-wide"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
