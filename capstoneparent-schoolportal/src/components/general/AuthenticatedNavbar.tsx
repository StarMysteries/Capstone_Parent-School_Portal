import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AboutUsDropdown } from "@/components/general/AboutUsDropdown";
import { ProfileDropdown } from "@/components/general/ProfileDropdown";
import { RoleSwitcherDropdown } from "@/components/general/RoleSwitcherDropdown";
import { ChevronRight, Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
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

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileAboutOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={`bg-(--navbar-bg) px-6 py-4 ${sticky ? "sticky top-0 z-50" : ""}`}
    >
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <Link
            to="/homepage"
            className="relative h-12 w-12 cursor-pointer transition-opacity hover:opacity-80"
          >
            <img src="/Logo.png" alt={logoAlt} className="object-contain" />
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-black"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-9 w-9" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <RoleSwitcherDropdown />
          <ProfileDropdown />
        </div>
      </div>

      <div className="hidden items-center justify-between md:flex">
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-8">
          <Link
            to="/homepage"
            className="relative h-16 w-16 cursor-pointer transition-opacity hover:opacity-80"
          >
            <img src="/Logo.png" alt={logoAlt} className="object-contain" />
          </Link>

          <nav
            ref={navRef}
            className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-20 md:text-left"
          >
            {/* About Us */}
            <div className="relative">
              <button
                type="button"
                className={`cursor-pointer text-gray-900 transition-colors hover:text-gray-700 ${
                  openDropdown === "about"
                    ? "text-xl font-bold"
                    : "text-lg font-medium"
                }`}
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
              className={`cursor-pointer text-gray-900 transition-colors hover:text-gray-700 ${
                isAnnouncementRoute
                  ? "text-xl font-bold"
                  : "text-lg font-medium"
              }`}
              to={announcementPath}
            >
              Announcements
            </Link>

            {/* Partnership & Events */}
            <Link
              to={partnershipPath}
              className={`text-gray-900 transition-colors hover:text-gray-700 ${
                isPartnershipRoute ? "text-xl font-bold" : "text-lg font-medium"
              }`}
            >
              Partnership & Events
            </Link>

            {/* 4th item: Records dropdown OR a custom plain link */}
            {customNavLink ? (
              <Link
                to={customNavLink.to}
                className={`cursor-pointer text-gray-900 transition-colors hover:text-gray-700 ${
                  isCustomNavActive
                    ? "text-xl font-bold"
                    : "text-lg font-medium"
                }`}
              >
                {customNavLink.label}
              </Link>
            ) : recordsItems && recordsItems.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  className={`cursor-pointer text-gray-900 transition-colors hover:text-gray-700 ${
                    openDropdown === "records" || isRecordsRoute
                      ? "text-xl font-bold"
                      : "text-lg font-medium"
                  }`}
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
        </div>

        {/* Right: role switcher + profile */}
        <div className="flex items-center gap-3">
          <RoleSwitcherDropdown />
          <ProfileDropdown />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu overlay"
          />

          <div className="relative flex h-full w-1/2 flex-col bg-(--navbar-bg) px-4 py-3 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <Link
                to="/homepage"
                className="relative h-12 w-12 cursor-pointer transition-opacity hover:opacity-80"
              >
                <img src="/Logo.png" alt={logoAlt} className="object-contain" />
              </Link>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-black"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="h-9 w-9" strokeWidth={2.5} />
              </button>
            </div>

            <nav className="mt-10 flex flex-1 flex-col gap-6 px-2 text-black">
              <button
                type="button"
                className="flex items-center justify-between text-left text-3xl font-medium"
                onClick={() => setIsMobileAboutOpen((prev) => !prev)}
                aria-expanded={isMobileAboutOpen}
              >
                <span>About Us</span>
                <ChevronRight className={`h-8 w-8 transition-transform ${isMobileAboutOpen ? "rotate-90" : ""}`} />
              </button>

              {isMobileAboutOpen && (
                <div className="ml-4 flex flex-col gap-4 border-l-2 border-black/20 pl-5 text-2xl font-medium">
                  <Link to="/contactus" className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
                    Contact Us
                  </Link>
                  <Link to="/history" className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
                    History
                  </Link>
                  <Link to="/orginizationalchart" className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
                    Orginizational Chart
                  </Link>
                  <Link to="/schoolcalendar" className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
                    School Calendar
                  </Link>
                  <Link to="/transparency" className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
                    Transparency
                  </Link>
                  <Link to="/visionandmission" className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
                    Vision & Mission
                  </Link>
                </div>
              )}

              <Link
                to={announcementPath}
                className={`text-3xl font-medium hover:opacity-80 ${isAnnouncementRoute ? "font-semibold" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Announcements
              </Link>

              <Link
                to="/partnership&events"
                className={`text-3xl font-medium hover:opacity-80 ${isPartnershipRoute ? "font-semibold" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Partnership & Events
              </Link>

              {customNavLink ? (
                <Link
                  to={customNavLink.to}
                  className={`text-3xl font-medium hover:opacity-80 ${isCustomNavActive ? "font-semibold" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {customNavLink.label}
                </Link>
              ) : recordsItems && recordsItems.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className={`flex items-center justify-between text-left text-3xl font-medium hover:opacity-80 ${openDropdown === "records" || isRecordsRoute ? "font-semibold" : ""}`}
                    onClick={() => setOpenDropdown(openDropdown === "records" ? null : "records")}
                    aria-expanded={openDropdown === "records"}
                  >
                    <span>Records</span>
                    <ChevronRight className={`h-8 w-8 transition-transform ${openDropdown === "records" ? "rotate-90" : ""}`} />
                  </button>

                  {openDropdown === "records" && (
                    <div className="ml-4 flex flex-col gap-4 border-l-2 border-black/20 pl-5 text-2xl font-medium">
                      {recordsItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="hover:opacity-80"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mt-auto border-t border-black/20 pt-6">
                <div className="flex flex-col gap-4">
                  <RoleSwitcherDropdown />
                  <ProfileDropdown />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
