import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react"
import { AboutUsDropdown } from "./AboutUsDropdown";
import { useLocation, Link } from "react-router-dom";

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
    <header className="bg-(--navbar-bg) px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="relative h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src="/Logo.png"
              alt="Bayog Elementary National School Logo"
              className="object-contain"
            />
          </Link>
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
            <div className="relative" ref={dropdownRef}>
            <a  
              className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Announcements
            </a>
            </div>
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
              Records
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login">
            <Button
              className={`h-10 w-32 rounded-full px-12 text-base text-[20px] font-semibold transition-colors ${
                isRegisterPage
                  ? "bg-(--button-white) text-(--button-green) hover:bg-(--button-gray)"
                  : "bg-(--button-green) text-(--button-white) hover:bg-(--button-hover-green)"
              }`}
            >
              Login
            </Button>
          </a>

          <a href="/register">
            <Button
              className={`h-10 w-32 rounded-full px-12 text-base text-[20px] font-semibold transition-colors ${
                isRegisterPage
                  ? "bg-(--button-green) text-(--button-white) hover:bg-(--button-hover-green)"
                  : "bg-(--button-white) text-(--button-green) hover:bg-(--button-gray)"
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
