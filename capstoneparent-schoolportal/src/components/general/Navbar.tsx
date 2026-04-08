import { Button } from "@/components/ui/button";
import { NavbarMenu, type NavbarMenuItem } from "@/components/general/NavbarMenu";
import { useState, useRef, useEffect } from "react"
import { AboutUsDropdown } from "./AboutUsDropdown";
import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";
import { Menu, X, ChevronRight } from "lucide-react";

export const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  const isPartnershipAndEventsRoute = location.pathname.startsWith("/partnership&events");
  const aboutRoutes = [
    "/contactus",
    "/history",
    "/orginizationalchart",
    "/schoolcalendar",
    "/transparency",
    "/visionandmission",
  ];
  const isAboutSelected = aboutRoutes.includes(location.pathname);
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

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const navItems: NavbarMenuItem[] = [
    {
      key: "about",
      label: "About Us",
      type: "dropdown",
      isActive: isAboutSelected || openDropdown === "about",
      onClick: () => setOpenDropdown(openDropdown === "about" ? null : "about"),
      dropdown: openDropdown === "about" ? <AboutUsDropdown /> : null,
    },
    ...(isAuthenticated ? [{
      key: "announcements",
      label: "Announcements",
      to: "/announcements",
      isActive: location.pathname === "/announcements",
    }] : []),
    {
      key: "events",
      label: "Partnership & Events",
      to: "/partnership&events",
      isActive: isPartnershipAndEventsRoute,
    },
    {
      key: "learn",
      label: "Learn about your child",
      to: "/login",
      isActive: location.pathname === "/login",
    },
  ];

  return (
    <header className="bg-(--navbar-bg) px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <Link to="/homepage" className="relative h-12 w-12 cursor-pointer transition-opacity hover:opacity-80">
            <img
              src="/Logo.png"
              alt="Bayog Elementary National School Logo"
              className="object-contain"
            />
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

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className={`h-auto p-0 text-base font-medium text-black hover:bg-transparent ${isRegisterPage ? "font-semibold" : ""}`}
          >
            <Link to="/login">Login</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`h-auto p-0 text-base font-medium text-black hover:bg-transparent ${isRegisterPage ? "font-semibold" : ""}`}
          >
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/homepage" className="relative h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src="/Logo.png"
              alt="Bayog Elementary National School Logo"
              className="object-contain"
            />
          </Link>
          <NavbarMenu items={navItems} navRef={navRef} />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <Button
            asChild
            className={`h-10 w-32 rounded-full px-12 text-base text-[20px] font-semibold transition-colors ${
              isRegisterPage
                ? "bg-(--button-white) text-(--button-green) hover:bg-(--button-gray)"
                : "bg-(--button-green) text-(--button-white) hover:bg-(--button-hover-green)"
            }`}
          >
            <Link to="/login">Login</Link>
          </Button>

          <Button
            asChild
            className={`h-10 w-32 rounded-full px-12 text-base text-[20px] font-semibold transition-colors ${
              isRegisterPage
                ? "bg-(--button-green) text-(--button-white) hover:bg-(--button-hover-green)"
                : "bg-(--button-white) text-(--button-green) hover:bg-(--button-gray)"
            }`}
          >
            <Link to="/register">Register</Link>
          </Button>
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
              <Link to="/homepage" className="relative h-12 w-12 cursor-pointer transition-opacity hover:opacity-80">
                <img
                  src="/Logo.png"
                  alt="Bayog Elementary National School Logo"
                  className="object-contain"
                />
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
                onClick={() => setOpenDropdown(openDropdown === "about" ? null : "about")}
                aria-expanded={openDropdown === "about"}
              >
                <span>About Us</span>
                <ChevronRight className={`h-8 w-8 transition-transform ${openDropdown === "about" ? "rotate-90" : ""}`} />
              </button>

              {openDropdown === "about" && (
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

              {navItems.filter((item) => item.key !== "about").map((item) => (
                <Link
                  key={item.key}
                  to={item.to ?? "/homepage"}
                  className={`text-3xl font-medium hover:opacity-80 ${item.isActive ? "font-semibold" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
