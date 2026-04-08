import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AboutUsDropdown } from "@/components/general/AboutUsDropdown";
import { ProfileDropdown } from "@/components/general/ProfileDropdown";
import { RoleSwitcherDropdown } from "@/components/general/RoleSwitcherDropdown";

interface NavDropdownItem {
  label: string;
  to: string;
}

interface CustomNavLink {
  label: string;
  to: string;
  activePaths: string[];
}

interface AuthenticatedNavbarProps {
  announcementPath: string;
  announcementActivePaths: string[];
  partnershipPath?: string;
  partnershipActivePaths?: string[];
  /** Standard Records dropdown. Omit when using customNavLink instead. */
  recordsItems?: NavDropdownItem[];
  recordsActivePaths?: string[];
  /** Replaces the Records dropdown with a plain link (e.g. parent role). */
  customNavLink?: CustomNavLink;
  sticky?: boolean;
  logoAlt?: string;
}

export const AuthenticatedNavbar = ({
  announcementPath,
  announcementActivePaths,
  partnershipPath = "/partnership&events",
  partnershipActivePaths = ["/partnership&events"],
  recordsItems,
  recordsActivePaths = [],
  customNavLink,
  sticky = false,
  logoAlt = "Pagsabungan Elementary School Logo",
}: AuthenticatedNavbarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  const isAnnouncementRoute = announcementActivePaths.includes(
    location.pathname,
  );
  const isRecordsRoute = recordsActivePaths.includes(location.pathname);
  const isPartnershipRoute = partnershipActivePaths.some((path) =>
    location.pathname.startsWith(path),
  );
  const isCustomNavActive =
    customNavLink?.activePaths.some((p) => location.pathname.startsWith(p)) ??
    false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getLinkClasses = (isActive: boolean) =>
    `cursor-pointer text-gray-900 transition-colors hover:text-gray-700 ${
      isActive ? "text-xl font-bold" : "text-lg font-medium"
    }`;

  const getMobileLinkClasses = (isActive: boolean) =>
    `text-gray-900 transition-colors hover:text-gray-700 text-base py-2 ${
      isActive ? "font-bold" : "font-medium"
    }`;

  return (
    <header
      className={`bg-(--navbar-bg) px-4 py-4 sm:px-6 ${sticky ? "sticky top-0 z-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            to="/homepage"
            className="relative h-14 w-14 sm:h-16 sm:w-16 cursor-pointer transition-opacity hover:opacity-80"
          >
            <img src="/Logo.png" alt={logoAlt} className="object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav
            ref={navRef}
            className="hidden md:flex gap-20 items-center"
          >
            {/* About Us */}
            <div className="relative">
              <button
                type="button"
                className={getLinkClasses(openDropdown === "about")}
                onClick={() =>
                  setOpenDropdown(openDropdown === "about" ? null : "about")
                }
                aria-expanded={openDropdown === "about"}
              >
                About Us
              </button>
              {openDropdown === "about" && <AboutUsDropdown />}
            </div>

            {/* Announcements */}
            <Link
              className={getLinkClasses(isAnnouncementRoute)}
              to={announcementPath}
            >
              Announcements
            </Link>

            {/* Partnership & Events */}
            <Link
              to={partnershipPath}
              className={getLinkClasses(isPartnershipRoute)}
            >
              Partnership & Events
            </Link>

            {/* Records or Custom Nav Link */}
            {customNavLink ? (
              <Link
                to={customNavLink.to}
                className={getLinkClasses(isCustomNavActive)}
              >
                {customNavLink.label}
              </Link>
            ) : recordsItems && recordsItems.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  className={getLinkClasses(openDropdown === "records" || isRecordsRoute)}
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === "records" ? null : "records",
                    )
                  }
                  aria-expanded={openDropdown === "records"}
                >
                  Records
                </button>

                {openDropdown === "records" && (
                  <div className="absolute z-10 mt-2 w-56 rounded-md border border-gray-200 bg-(--navbar-bg) shadow-lg">
                    {recordsItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-900 hover:text-gray-700 transition-colors p-2"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Right: role switcher + profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <RoleSwitcherDropdown />
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pt-4 border-t border-gray-300 flex flex-col gap-2">
          {/* About Us */}
          <div className="relative w-full">
            <button
              type="button"
              className={`w-full text-left ${getMobileLinkClasses(openDropdown === "about")}`}
              onClick={() =>
                setOpenDropdown(openDropdown === "about" ? null : "about")
              }
              aria-expanded={openDropdown === "about"}
            >
              About Us
            </button>
            {openDropdown === "about" && (
              <div className="mt-2 ml-4">
                <AboutUsDropdown />
              </div>
            )}
          </div>

          {/* Announcements */}
          <Link
            className={`w-full block ${getMobileLinkClasses(isAnnouncementRoute)}`}
            to={announcementPath}
          >
            Announcements
          </Link>

          {/* Partnership & Events */}
          <Link
            to={partnershipPath}
            className={`w-full block ${getMobileLinkClasses(isPartnershipRoute)}`}
          >
            Partnership & Events
          </Link>

          {/* Records or Custom Nav Link */}
          {customNavLink ? (
            <Link
              to={customNavLink.to}
              className={`w-full block ${getMobileLinkClasses(isCustomNavActive)}`}
            >
              {customNavLink.label}
            </Link>
          ) : recordsItems && recordsItems.length > 0 ? (
            <div className="relative w-full">
              <button
                type="button"
                className={`w-full text-left ${getMobileLinkClasses(openDropdown === "records" || isRecordsRoute)}`}
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "records" ? null : "records",
                  )
                }
                aria-expanded={openDropdown === "records"}
              >
                Records
              </button>

              {openDropdown === "records" && (
                <div className="mt-2 ml-4 flex flex-col gap-1">
                  {recordsItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="text-gray-800 hover:text-gray-600 py-1.5 text-sm"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </nav>
      )}
    </header>
  );
};
