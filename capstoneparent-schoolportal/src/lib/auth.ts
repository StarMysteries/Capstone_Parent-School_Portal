/**
 * src/lib/auth.ts
 *
 * Compatibility helpers that delegate to the Zustand auth store.
 * Components that were already importing from "@/lib/auth" continue
 * to work without changes.
 */

import { useAuthStore } from "./store/authStore";

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type { UserRole, SessionUser } from "./store/authStore";

// ─── JWT ──────────────────────────────────────────────────────────────────────

export function setJwt(token: string): void {
  useAuthStore.setState({ token, isAuthenticated: true });
}

export function getJwt(): string | null {
  return useAuthStore.getState().token;
}

// ─── Device token ─────────────────────────────────────────────────────────────

/**
 * Persists a trusted device token into the Zustand store (and therefore
 * localStorage via the `persist` middleware).
 * Pass an empty string to effectively clear it.
 */
export function setDeviceToken(token: string): void {
  if (!token) {
    useAuthStore.getState().clearDeviceToken();
  } else {
    useAuthStore.getState().setDeviceToken(token);
  }
}

export function getDeviceToken(): string | null {
  return useAuthStore.getState().deviceToken || null;
}

// ─── Session user ─────────────────────────────────────────────────────────────

import type { SessionUser } from "./store/authStore";

export function setAuthUser(user: SessionUser): void {
  useAuthStore.getState().setUser(user);
}

export function getAuthUser(): SessionUser | null {
  return useAuthStore.getState().user;
}

/** Clears the active session without wiping the trusted device token. */
export function clearAuthUser(): void {
  useAuthStore.getState().logout();
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

import type { UserRole } from "./store/authStore";

const ROLE_MAP: Record<string, UserRole> = {
  admin: "admin",
  principal: "principal",
  vice_principal: "vice_principal",
  teacher: "teacher",
  librarian: "librarian",
  parent: "parent",
  staff: "staff",
};

/** Maps a raw backend role string to a typed frontend UserRole. */
export function mapBackendRole(backendRole: string): UserRole {
  return ROLE_MAP[backendRole.toLowerCase()] ?? "staff";
}

const DEFAULT_ROUTES: Record<UserRole, string> = {
  admin: "/adminview",
  principal: "/manageclasslists",
  vice_principal: "/manageclasslists",
  teacher: "/teacherview",
  librarian: "/librarianview",
  parent: "/parentview",
  staff: "/staffview",
};

/** Returns the landing route for a given role after login. */
export function getDefaultRouteForRole(role: UserRole): string {
  return DEFAULT_ROUTES[role] ?? "/dashboard";
}

/**
 * Returns true if the user's role is in the allowedRoles list.
 * When allowedRoles is undefined or empty, all authenticated users pass.
 */
export function hasAllowedRole(
  user: SessionUser,
  allowedRoles?: UserRole[],
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(user.role);
}
