import { useState, useRef, useEffect } from "react"
import { AboutUsDropdown } from "../general/AboutUsDropdown";
import { ProfileDropdown } from "../general/ProfileDropdown";
import { useLocation, Link } from "react-router-dom";
import { getAuthUser } from "@/lib/auth";

export const NavbarParent = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isParentLoggedIn = getAuthUser()?.role === "parent";
  const aboutRoutes = [
    "/",
    "/contactus",
    "/history",
    "/orginizationalchart",
    "/schoolcalendar",
    "/transparency",
    "/visionandmission",
  ];
  const isAboutSelected = aboutRoutes.includes(location.pathname);
  const learnChildRoutes = [
    "/parentview",
    "/classschedule",
    "/quarterlygrades",
    "/libraryrecords",
  ];
  const isLearnAboutChildSelected = learnChildRoutes.includes(location.pathname);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
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
              src="/Logo.png"
              alt="Bayog Elementary National School Logo"
              className="object-contain"
            />
          </Link>
          <nav
            ref={navRef}
            className="flex flex-col md:flex-row items-center gap-4 md:gap-20 text-center md:text-left"
          >
            <div className="relative">
              <a
                className={`text-gray-900 hover:text-gray-700 transition-colors cursor-pointer ${
                  isAboutSelected
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
              <Link
                className={`text-gray-900 hover:text-gray-700 transition-colors cursor-pointer ${
                  location.pathname === "/announcements"
                    ? "text-xl font-bold"
                    : "text-lg font-medium"
                }`}
                to="/announcements"
              >
                Announcements
              </Link>
            </div>
            <Link
              to="/partnership&events"
              className={`text-gray-900 hover:text-gray-700 transition-colors ${
                location.pathname === "/partnership&events"
                  ? "text-xl font-bold"
                  : "text-lg font-medium"
              }`}
            >
              Partnership & Events
            </Link>
            <a
              href={isParentLoggedIn ? "/parentview" : "/login"}
              className={`text-gray-900 hover:text-gray-700 transition-colors ${
                isLearnAboutChildSelected
                  ? "text-xl font-bold"
                  : "text-lg font-medium"
              }`}
            >
              Learn about your child
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
