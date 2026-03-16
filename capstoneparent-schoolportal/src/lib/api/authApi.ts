/**
 * authApi.ts
 * All requests to /api/auth/*
 */

import { apiFetch, apiUpload } from "./client";

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface AuthUser {
  user_id: number;
  email: string;
  fname: string;
  lname: string;
  account_status: string;
  created_at: string;
  roles: { ur_id: number; role: string }[];
}

export interface TrustedDevice {
  td_id: number;
  user_id: number;
  device_token: string;
  last_used_at: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Step 1 of parent registration.
   * Validates the form data, stores a pending record, and sends a
   * verification OTP. Does NOT write to the DB yet.
   * Returns { message }.
   */
  register(payload: FormData): Promise<{ message: string }> {
    return apiUpload("/auth/register", payload);
  },

  /**
   * Step 2 of parent registration — verify the OTP emailed in step 1.
   * Creates the user account (status: Inactive) and returns the first
   * device token the client must persist for future logins.
   */
  verifyRegistrationOtp(
    email: string,
    otpCode: string,
  ): Promise<{
    message: string;
    data: { user: AuthUser; deviceToken: string };
  }> {
    return apiFetch("/auth/verify-otp-code", {
      method: "POST",
      body: JSON.stringify({ email, otpCode }),
    });
  },

  /**
   * Login with email + password + a known device token.
   * Returns a JWT immediately when all three are valid.
   * For new/unrecognized devices use sendOtp → verifyOtp first.
   */
  login(
    email: string,
    password: string,
    deviceToken: string,
  ): Promise<{ message: string; data: { token: string; user: AuthUser } }> {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, deviceToken }),
    });
  },

  /**
   * Request a one-time password sent to the user's email.
   * Used when the client has no stored device token (first login / new device).
   */
  sendOtp(email: string): Promise<{ message: string }> {
    return apiFetch("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Verify the OTP from sendOtp.
   * Registers the device as trusted and returns a JWT + fresh device token.
   * The client MUST persist the device token for future logins.
   */
  verifyOtp(
    email: string,
    otpCode: string,
  ): Promise<{
    message: string;
    data: { token: string; user: AuthUser; deviceToken: string };
  }> {
    return apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otpCode }),
    });
  },

  /**
   * Send a password-reset link to the given email.
   * The server is intentionally silent about whether the email exists
   * to prevent account enumeration.
   */
  forgotPassword(email: string): Promise<{ message: string }> {
    return apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Validate a reset token and return the masked email for display
   * (e.g. "j***e@gmail.com") without exposing the real address.
   */
  getResetPasswordInfo(
    token: string,
  ): Promise<{ data: { maskedEmail: string } }> {
    return apiFetch(
      `/auth/reset-password-info?token=${encodeURIComponent(token)}`,
    );
  },

  /**
   * Submit a new password using the token from the reset link.
   */
  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    return apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  },

  /**
   * Invalidate the current session cookie server-side and clear the
   * httpOnly token cookie.
   */
  logout(): Promise<{ message: string }> {
    return apiFetch("/auth/logout", { method: "POST" });
  },

  /**
   * Return the authenticated user's profile from the JWT.
   */
  getCurrentUser(): Promise<{ data: AuthUser }> {
    return apiFetch("/auth/me");
  },

  /**
   * List all trusted devices for the current user.
   */
  getTrustedDevices(): Promise<{ data: TrustedDevice[] }> {
    return apiFetch("/auth/trusted-devices");
  },

  /**
   * Remove a specific trusted device by its ID.
   * The user will be required to go through OTP on next login from
   * that device.
   */
  removeTrustedDevice(tdId: number): Promise<{ message: string }> {
    return apiFetch(`/auth/trusted-devices/${tdId}`, { method: "DELETE" });
  },
};
