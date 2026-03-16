/**
 * usersApi.ts
 * All requests to /api/users/*
 */

import { apiFetch } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccountStatus = "Active" | "Inactive";

export type UserRoleValue =
  | "Parent"
  | "Librarian"
  | "Teacher"
  | "Admin"
  | "Principal"
  | "Vice_Principal";

export interface UserRole {
  ur_id: number;
  user_id: number;
  role: UserRoleValue;
}

export interface User {
  user_id: number;
  email: string;
  fname: string;
  lname: string;
  contact_num: string;
  address: string;
  account_status: AccountStatus;
  created_at: string;
  updated_at?: string;
  roles: UserRole[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersListResponse {
  data: User[];
  pagination: Pagination;
}

export interface UpdateUserPayload {
  fname?: string;
  lname?: string;
  contact_num?: string;
  address?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  /**
   * Fetch a paginated list of users.
   * Optionally filter by role or account status.
   * Requires Admin or Principal role.
   */
  getAll(params?: {
    page?: number;
    limit?: number;
    role?: UserRoleValue;
    status?: AccountStatus;
  }): Promise<UsersListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.role) query.set("role", params.role);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiFetch(`/users${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch a single user with their roles.
   * Requires authentication.
   */
  getById(id: number): Promise<{ data: User }> {
    return apiFetch(`/users/${id}`);
  },

  /**
   * Update a user's profile fields (name, contact, address).
   * Does NOT update roles or account status — use the dedicated methods below.
   * Requires authentication.
   */
  update(
    id: number,
    payload: UpdateUserPayload,
  ): Promise<{ message: string; data: User }> {
    return apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Activate or deactivate a user account.
   * Requires Admin or Principal role.
   */
  updateStatus(
    id: number,
    account_status: AccountStatus,
  ): Promise<{ message: string; data: User }> {
    return apiFetch(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ account_status }),
    });
  },

  /**
   * Replace all roles for a user in one operation.
   * Deletes existing roles and inserts the new set atomically.
   * Requires Admin or Principal role.
   */
  updateRoles(
    id: number,
    roles: UserRoleValue[],
  ): Promise<{ message: string; data: UserRole[] }> {
    return apiFetch(`/users/${id}/roles`, {
      method: "PUT",
      body: JSON.stringify({ roles }),
    });
  },

  /**
   * Assign a single role to a user without removing existing roles.
   * Requires Admin or Principal role.
   */
  assignRole(
    id: number,
    role: UserRoleValue,
  ): Promise<{ message: string; data: UserRole }> {
    return apiFetch(`/users/${id}/roles`, {
      method: "POST",
      body: JSON.stringify({ role }),
    });
  },

  /**
   * Remove a single role from a user by role record ID (ur_id).
   * Requires Admin or Principal role.
   */
  removeRole(userId: number, roleId: number): Promise<{ message: string }> {
    return apiFetch(`/users/${userId}/roles/${roleId}`, {
      method: "DELETE",
    });
  },
};
