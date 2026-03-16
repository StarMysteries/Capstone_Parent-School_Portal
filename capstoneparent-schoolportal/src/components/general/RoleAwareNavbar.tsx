import { Navbar } from "@/components/general/Navbar";
import { NavbarAdmin } from "@/components/admin/NavbarAdmin";
import { NavbarTeacher } from "@/components/teacher/NavbarTeacher";
import { NavbarLibrarian } from "@/components/librarian/NavbarLibrarian";
import { NavbarParent } from "@/components/parent/NavbarParent";
import { NavbarStaff } from "@/components/staff/NavbarStaff";
import { NavbarPrincipal } from "@/components/principal/NavbarPrincipal";
import { getAuthUser, type UserRole } from "@/lib/auth";

const getStoredRole = (): UserRole | null => {
  const authRole = getAuthUser()?.role ?? null;
  if (authRole) {
    return authRole;
  }

  // Keep backward compatibility for local mock sessions.
  const rawLegacyAuthUser = localStorage.getItem("dummyAuthUser");
  if (!rawLegacyAuthUser) return null;

  try {
    const parsedUser = JSON.parse(rawLegacyAuthUser) as { role?: UserRole };
    return parsedUser.role ?? null;
  } catch {
    return null;
  }
};

export const RoleAwareNavbar = () => {
  const role = getStoredRole();

  if (role === "admin") return <NavbarAdmin />;
  if (role === "principal" || role === "vice_principal") return <NavbarPrincipal />;
  if (role === "teacher") return <NavbarTeacher />;
  if (role === "librarian") return <NavbarLibrarian />;
  if (role === "parent") return <NavbarParent />;
  if (role === "staff") return <NavbarStaff />;

  return <Navbar />;
};
