/**
 * libraryApi.ts
 * All requests to /api/library/*
 */

import { apiFetch } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ItemType = "Learning_Resource" | "Book";
export type CopyStatus = "AVAILABLE" | "BORROWED" | "LOST" | "GIVEN";
export type CopyCondition = string;

export interface LibraryCategory {
  category_id: number;
  category_name: string;
}

export interface LibraryGradeLevel {
  gl_id: number;
  grade_level: string;
}

export interface MaterialUploader {
  user_id: number;
  fname: string;
  lname: string;
}

export interface MaterialCopy {
  copy_id: number;
  item_id: number;
  copy_code: number;
  status: CopyStatus;
  condition: CopyCondition | null;
}

export interface LearningMaterial {
  item_id: number;
  item_name: string;
  author: string | null;
  item_type: ItemType;
  category_id: number;
  gl_id: number;
  uploaded_by: number;
  uploaded_at: string;
  category: LibraryCategory;
  grade_level: LibraryGradeLevel;
  uploader: MaterialUploader;
  copies?: MaterialCopy[];
}

export interface BorrowRecord {
  mbr_id: number;
  copy_id: number;
  student_id: number | null;
  user_id: number | null;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  penalty_cost: number;
  remarks: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MaterialsListResponse {
  data: LearningMaterial[];
  pagination: Pagination;
}

export interface BorrowHistoryResponse {
  data: BorrowRecord[];
  pagination: Pagination;
}

export interface CreateMaterialPayload {
  item_name: string;
  author?: string;
  item_type: ItemType;
  category_id: number;
  gl_id: number;
}

export interface UpdateMaterialPayload {
  item_name?: string;
  author?: string;
  item_type?: ItemType;
  category_id?: number;
  gl_id?: number;
}

export interface AddCopyPayload {
  copy_code: number;
  condition?: CopyCondition;
}

export interface UpdateCopyStatusPayload {
  status: CopyStatus;
  condition?: CopyCondition;
}

export interface BorrowMaterialPayload {
  copy_id: number;
  student_id?: number;
  user_id?: number;
  /** ISO 8601 date string — defaults to 1 week from now */
  due_at?: string;
}

export interface ReturnMaterialPayload {
  penalty_cost?: number;
  remarks?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const libraryApi = {
  // ── Materials ──────────────────────────────────────────────────────────────

  /**
   * Fetch a paginated list of learning materials.
   * Optionally filter by item_type, category_id, or grade_level.
   * Requires authentication.
   */
  getAllMaterials(params?: {
    page?: number;
    limit?: number;
    item_type?: ItemType;
    category_id?: number;
    grade_level?: number;
  }): Promise<MaterialsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.item_type) query.set("item_type", params.item_type);
    if (params?.category_id)
      query.set("category_id", String(params.category_id));
    if (params?.grade_level)
      query.set("grade_level", String(params.grade_level));
    const qs = query.toString();
    return apiFetch(`/library/materials${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch a single material with all its copies and borrow records.
   */
  getMaterialById(id: number): Promise<{ data: LearningMaterial }> {
    return apiFetch(`/library/materials/${id}`);
  },

  /**
   * Create a new learning material.
   * Requires Librarian or Admin role.
   */
  createMaterial(
    payload: CreateMaterialPayload,
  ): Promise<{ message: string; data: LearningMaterial }> {
    return apiFetch("/library/materials", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing material's metadata.
   * Requires Librarian or Admin role.
   */
  updateMaterial(
    id: number,
    payload: UpdateMaterialPayload,
  ): Promise<{ message: string; data: LearningMaterial }> {
    return apiFetch(`/library/materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a material and all associated copies.
   * Requires Librarian or Admin role.
   */
  deleteMaterial(id: number): Promise<{ message: string }> {
    return apiFetch(`/library/materials/${id}`, { method: "DELETE" });
  },

  // ── Copies ─────────────────────────────────────────────────────────────────

  /**
   * Add a physical copy to an existing material.
   * Requires Librarian or Admin role.
   */
  addCopy(
    materialId: number,
    payload: AddCopyPayload,
  ): Promise<{ message: string; data: MaterialCopy }> {
    return apiFetch(`/library/materials/${materialId}/copies`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update the status or condition of a specific copy.
   * Requires Librarian or Admin role.
   */
  updateCopyStatus(
    copyId: number,
    payload: UpdateCopyStatusPayload,
  ): Promise<{ message: string; data: MaterialCopy }> {
    return apiFetch(`/library/copies/${copyId}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // ── Borrowing ──────────────────────────────────────────────────────────────

  /**
   * Record a new borrow transaction for a copy.
   * The copy must be in AVAILABLE status.
   * Sets copy status to BORROWED automatically.
   */
  borrowMaterial(
    payload: BorrowMaterialPayload,
  ): Promise<{ message: string; data: BorrowRecord }> {
    return apiFetch("/library/borrow", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Record the return of a borrowed copy.
   * Sets copy status back to AVAILABLE automatically.
   * Requires Librarian or Admin role.
   */
  returnMaterial(
    borrowId: number,
    payload: ReturnMaterialPayload,
  ): Promise<{ message: string; data: BorrowRecord }> {
    return apiFetch(`/library/borrow/${borrowId}/return`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch a paginated borrow history.
   * Optionally filter by student_id, user_id, or status.
   */
  getBorrowHistory(params?: {
    page?: number;
    limit?: number;
    student_id?: number;
    user_id?: number;
    status?: "borrowed" | "returned" | "overdue";
  }): Promise<BorrowHistoryResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.student_id) query.set("student_id", String(params.student_id));
    if (params?.user_id) query.set("user_id", String(params.user_id));
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiFetch(`/library/borrow/history${qs ? `?${qs}` : ""}`);
  },

  // ── Categories ─────────────────────────────────────────────────────────────

  /**
   * Fetch all library categories, sorted alphabetically.
   */
  getAllCategories(): Promise<{ data: LibraryCategory[] }> {
    return apiFetch("/library/categories");
  },

  /**
   * Create a new category.
   * Requires Librarian or Admin role.
   */
  createCategory(
    category_name: string,
  ): Promise<{ message: string; data: LibraryCategory }> {
    return apiFetch("/library/categories", {
      method: "POST",
      body: JSON.stringify({ category_name }),
    });
  },
};
