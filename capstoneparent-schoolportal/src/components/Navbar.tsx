import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react"
import { AboutUsDropdown } from "./AboutUsDropdown";
import { useLocation, Link } from "react-router-dom";

export const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
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
              src="/logo.png"
              alt="Bayog Elementary National School Logo"
              className="object-contain"
            />
          </Link>
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-20 text-center md:text-left">
            <div className="relative" ref={dropdownRef}>
              <a
                className={`text-gray-900 hover:text-gray-700 transition-colors cursor-pointer ${
                  location.pathname.startsWith("/") && !location.pathname.startsWith("/announcements") && !location.pathname.startsWith("/partnership") && !location.pathname.startsWith("/learn")
                    ? "text-xl font-bold"
                    : "text-lg font-medium"
                }`}
                onClick={() => setOpenDropdown(openDropdown === "about" ? null : "about")}
              >
                About Us
              </a>
              {openDropdown === "about" && <AboutUsDropdown />}
            </div>
            <div className="relative">
              <a  
                className={`text-gray-900 hover:text-gray-700 transition-colors cursor-pointer ${
                  location.pathname === "/announcements"
                    ? "text-xl font-bold"
                    : "text-lg font-medium"
                }`}
                href="/announcements"
              >
                Announcements
              </a>
            </div>
            <a
              href="/partnership&events"
              className={`text-gray-900 hover:text-gray-700 transition-colors ${
                location.pathname === "/partnership&events"
                  ? "text-xl font-bold"
                  : "text-lg font-medium"
              }`}
            >
              Partnership & Events
            </a>
            <a
              href="/login"
              className={`text-gray-900 hover:text-gray-700 transition-colors ${
                location.pathname === "/learn"
                  ? "text-xl font-bold"
                  : "text-lg font-medium"
              }`}
            >
              Learn about your child
            </a>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
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
