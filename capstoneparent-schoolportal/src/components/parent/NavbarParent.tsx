import { useState, useRef, useEffect } from "react"
import { AboutUsDropdown } from "../general/AboutUsDropdown";
import { NavbarMenu, type NavbarMenuItem } from "../general/NavbarMenu";
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

  const navItems: NavbarMenuItem[] = [
    {
      key: "about",
      label: "About Us",
      type: "dropdown",
      isActive: isAboutSelected || openDropdown === "about",
      onClick: () => setOpenDropdown(openDropdown === "about" ? null : "about"),
      dropdown: openDropdown === "about" ? <AboutUsDropdown /> : null,
    },
    {
      key: "announcements",
      label: "Announcements",
      to: "/announcements",
      isActive: location.pathname === "/announcements",
    },
    {
      key: "events",
      label: "Partnership & Events",
      to: "/partnership&events",
      isActive: location.pathname === "/partnership&events",
    },
    {
      key: "learn",
      label: "Learn about your child",
      to: isParentLoggedIn ? "/parentview" : "/login",
      isActive: isLearnAboutChildSelected,
    },
  ];

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
          <NavbarMenu items={navItems} navRef={navRef} />
        </div>
        <div className="flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
