import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole =
  | "admin"
  | "principal"
  | "vice_principal"
  | "teacher"
  | "librarian"
  | "parent"
  | "staff";

export interface SessionUser {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  /** Resolved session user (name, role, etc.) */
  user: SessionUser | null;
  /** JWT returned by /login or /verify-otp */
  token: string | null;
  /**
   * Raw device token stored on this browser.
   * Sent with every /login so OTP is skipped for known devices.
   * Kept in the store even after logout so the same device stays trusted.
   */
  deviceToken: string | null;
  isAuthenticated: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Called after a successful login or OTP verification.
   * Stores the JWT, resolves the best role, and marks the session active.
   */
  loginSuccess: (
    token: string,
    apiUser: AuthUser,
    newDeviceToken?: string,
  ) => void;

  /**
   * Clears the active session (token + user) but intentionally keeps the
   * deviceToken so future logins on this device skip OTP.
   */
  logout: () => void;

  /** Stores (or replaces) the trusted device token for this browser. */
  setDeviceToken: (token: string) => void;

  /** Removes the device token, forcing OTP on the next login. */
  clearDeviceToken: () => void;

  /** Replaces the in-memory session user (used by auth.ts helpers). */
  setUser: (user: SessionUser) => void;
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

const ROLE_MAP: Record<string, UserRole> = {
  admin: "admin",
  principal: "principal",
  vice_principal: "vice_principal",
  teacher: "teacher",
  librarian: "librarian",
  parent: "parent",
  staff: "staff",
};

const ROLE_PRIORITY: UserRole[] = [
  "staff",
  "admin",
  "principal",
  "vice_principal",
  "teacher",
  "librarian",
  "parent",
];

function mapRole(raw: string): UserRole {
  return ROLE_MAP[raw.toLowerCase()] ?? "staff";
}

/** Pick the highest-priority role from the user's role list. */
function resolveRole(roles: { role: string }[]): UserRole {
  const mapped = roles.map((r) => mapRole(r.role));
  return ROLE_PRIORITY.find((p) => mapped.includes(p)) ?? "staff";
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      deviceToken: null,
      isAuthenticated: false,

      loginSuccess(token, apiUser, newDeviceToken) {
        const role = resolveRole(apiUser.roles ?? []);

        const sessionUser: SessionUser = {
          userId: apiUser.user_id,
          email: apiUser.email,
          name: `${apiUser.fname} ${apiUser.lname}`,
          role,
        };

        set((prev) => ({
          user: sessionUser,
          token,
          // Only overwrite deviceToken when a new one is provided
          deviceToken: newDeviceToken ?? prev.deviceToken,
          isAuthenticated: true,
        }));
      },

      logout() {
        set((prev) => ({
          user: null,
          token: null,
          isAuthenticated: false,
          // Intentionally preserve deviceToken
          deviceToken: prev.deviceToken,
        }));
      },

      setDeviceToken(token) {
        set({ deviceToken: token });
      },

      clearDeviceToken() {
        set({ deviceToken: null });
      },

      setUser(user) {
        set({ user });
      },
    }),
    {
      name: "auth-session", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        deviceToken: state.deviceToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
