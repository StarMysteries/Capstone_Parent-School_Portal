/**
 * studentsApi.ts
 * All requests to /api/students/*
 */

import { apiFetch } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StudentStatus =
  | "ENROLLED"
  | "GRADUATED"
  | "TRANSFERRED"
  | "DROPPED"
  | "SUSPENDED";

export type GradeRemarks = "PASSED" | "FAILED" | "IN_PROGRESS";

export interface StudentGradeLevel {
  gl_id: number;
  grade_level: string;
}

export interface Student {
  student_id: number;
  fname: string;
  lname: string;
  sex: "Male" | "Female";
  lrn_number: string;
  gl_id: number;
  syear_start: number;
  syear_end: number;
  status: StudentStatus;
  grade_level?: StudentGradeLevel;
}

/** Lightweight shape returned by the public LRN search endpoint */
export interface StudentSearchResult {
  student_id: number;
  lrn_number: string;
  fname: string;
  lname: string;
  grade_level: { grade_level: string };
}

export interface StudentGrade {
  srs_id: number;
  srecord_id: number;
  student_id: number;
  q1_grade: number | null;
  q2_grade: number | null;
  q3_grade: number | null;
  q4_grade: number | null;
  avg_grade: number | null;
  remarks: GradeRemarks;
  subject_record: {
    subject_name: string;
    teacher: { user_id: number; fname: string; lname: string };
  };
}

export interface AttendanceRecord {
  attendance_id: number;
  student_id: number;
  school_days: number;
  days_present: number;
  days_absent: number;
  month: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentsListResponse {
  data: Student[];
  pagination: Pagination;
}

export interface CreateStudentPayload {
  fname: string;
  lname: string;
  sex: "Male" | "Female";
  lrn_number: string;
  gl_id: number;
  syear_start: number;
  syear_end: number;
}

export interface UpdateStudentPayload {
  fname?: string;
  lname?: string;
  sex?: "Male" | "Female";
  lrn_number?: string;
  syear_start?: number;
  syear_end?: number;
  status?: StudentStatus;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const studentsApi = {
  /**
   * Public LRN prefix search used during parent self-registration.
   * Returns up to 10 enrolled students whose lrn_number starts with `lrn`.
   * Only exposes safe fields (student_id, lrn_number, fname, lname, grade_level).
   * No authentication required.
   */
  searchByLrn(lrn: string): Promise<{ data: StudentSearchResult[] }> {
    return apiFetch(`/students/search?lrn=${encodeURIComponent(lrn)}`);
  },

  /**
   * Fetch a paginated list of students.
   * Optionally filter by status, grade level, or school year start.
   * Requires Teacher, Admin, Principal, or Vice_Principal role.
   */
  getAll(params?: {
    page?: number;
    limit?: number;
    status?: StudentStatus;
    grade_level?: number;
    syear_start?: number;
  }): Promise<StudentsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.grade_level)
      query.set("grade_level", String(params.grade_level));
    if (params?.syear_start)
      query.set("syear_start", String(params.syear_start));
    const qs = query.toString();
    return apiFetch(`/students${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch a single student by their student_id.
   * Requires authentication.
   */
  getById(id: number): Promise<{ data: Student }> {
    return apiFetch(`/students/${id}`);
  },

  /**
   * Create a new student record.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  create(
    payload: CreateStudentPayload,
  ): Promise<{ message: string; data: Student }> {
    return apiFetch("/students", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing student record.
   * Requires Admin, Principal, Vice_Principal, or Teacher role.
   */
  update(
    id: number,
    payload: UpdateStudentPayload,
  ): Promise<{ message: string; data: Student }> {
    return apiFetch(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a student record.
   * Requires Admin or Principal role.
   */
  delete(id: number): Promise<{ message: string }> {
    return apiFetch(`/students/${id}`, { method: "DELETE" });
  },

  /**
   * Fetch all quarterly grade records for a student across all subjects.
   * Requires authentication.
   */
  getGrades(id: number): Promise<{ data: StudentGrade[] }> {
    return apiFetch(`/students/${id}/grades`);
  },

  /**
   * Fetch all monthly attendance records for a student.
   * Requires authentication.
   */
  getAttendance(id: number): Promise<{ data: AttendanceRecord[] }> {
    return apiFetch(`/students/${id}/attendance`);
  },
};
