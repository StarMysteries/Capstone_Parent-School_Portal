import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react"
import { AboutUsDropdown } from "./AboutUsDropdown";
import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="bg-[#d4d433] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="relative h-16 w-16">
            <img
              src="/Logo.png"
              alt="Bayog Elementary National School Logo"
              className="object-contain"
            />
          </div>
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-20 text-center md:text-left">
            <div className="relative" ref={dropdownRef}>
              <a
                className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                About Us
              </a>
              {isDropdownOpen && <AboutUsDropdown />}
            </div>
            <a
              href="/announcements"
              className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Announcements
            </a>
            <a
              href="/partnership"
              className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Partnership & Events
            </a>
            <a
              href="/learn"
              className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Learn about your child
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login">
            <Button
              className={`h-10 w-32 rounded-full px-12 text-base text-[20px] font-semibold transition-colors ${
                isRegisterPage
                  ? "bg-white text-[#4a9d5f] hover:bg-[#e0e0e0]"
                  : "bg-[#4a9d5f] text-white hover:bg-[#3d8550]"
              }`}
            >
              Login
            </Button>
          </a>

          <a href="/register">
            <Button
              className={`h-10 w-32 rounded-full px-12 text-base text-[20px] font-semibold transition-colors ${
                isRegisterPage
                  ? "bg-[#4a9d5f] text-white hover:bg-[#3d8550]"
                  : "bg-white text-[#4a9d5f] hover:bg-[#e0e0e0]"
              }`}
            >
              Register
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};
