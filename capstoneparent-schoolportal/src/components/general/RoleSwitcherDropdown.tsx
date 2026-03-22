import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { useAuthStore, type UserRole } from "@/lib/store/authStore";
import { getDefaultRouteForRole } from "@/lib/auth";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  principal: "Principal",
  vice_principal: "Vice Principal",
  teacher: "Teacher",
  librarian: "Librarian",
  parent: "Parent",
  staff: "Staff",
};

const ROLE_COLORS: Record<UserRole, { bg: string; text: string; dot: string }> =
  {
    admin: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
    principal: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      dot: "bg-purple-500",
    },
    vice_principal: {
      bg: "bg-violet-100",
      text: "text-violet-800",
      dot: "bg-violet-500",
    },
    teacher: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
    librarian: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      dot: "bg-amber-500",
    },
    parent: { bg: "bg-teal-100", text: "text-teal-800", dot: "bg-teal-500" },
    staff: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-400" },
  };

export const RoleSwitcherDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Only show when the user has more than one role
  if (!user || !user.roles || user.roles.length <= 1) return null;

  const currentRole = user.role;
  const colors = ROLE_COLORS[currentRole];

  const handleSwitch = (role: UserRole) => {
    if (role === currentRole) {
      setIsOpen(false);
      return;
    }
    switchRole(role);
    setIsOpen(false);
    navigate(getDefaultRouteForRole(role));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger badge */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 border border-transparent hover:border-current ${colors.bg} ${colors.text}`}
        aria-label="Switch role"
        aria-expanded={isOpen}
      >
        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${colors.dot}`} />
        <span className="hidden sm:inline">{ROLE_LABELS[currentRole]}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Switch View
            </p>
          </div>
          <div className="py-1">
            {user.roles.map((role) => {
              const isActive = role === currentRole;
              const c = ROLE_COLORS[role];
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSwitch(role)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${isActive ? "bg-gray-50 font-semibold text-gray-900" : "font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <span
                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${c.dot}`}
                  />
                  <span className="flex-1">{ROLE_LABELS[role]}</span>
                  {isActive && (
                    <Check className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-t border-gray-100 px-4 py-2">
            <p className="text-xs text-gray-400">
              You have {user.roles.length} roles
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
