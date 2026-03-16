/**
 * parentsApi.ts
 * All requests to /api/parents/*
 */

import { apiFetch, apiUpload } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegistrationStatus = "PENDING" | "VERIFIED" | "DENIED";

export interface RegistrationParent {
  user_id: number;
  fname: string;
  lname: string;
  email: string;
  contact_num: string;
}

export interface RegistrationGradeLevel {
  gl_id: number;
  grade_level: string;
}

export interface RegistrationStudent {
  student_id: number;
  fname: string;
  lname: string;
  lrn_number: string;
  grade_level: RegistrationGradeLevel;
}

export interface RegistrationStudentJoin {
  student: RegistrationStudent;
}

export interface RegistrationFile {
  file_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

export interface RegistrationFileJoin {
  file: RegistrationFile;
}

export interface RegistrationVerifier {
  user_id: number;
  fname: string;
  lname: string;
}

export interface ParentRegistration {
  pr_id: number;
  parent_id: number;
  status: RegistrationStatus;
  remarks: string | null;
  submitted_at: string;
  verified_at: string | null;
  verified_by: number | null;
  parent: RegistrationParent;
  students: RegistrationStudentJoin[];
  files: RegistrationFileJoin[];
  verifier: RegistrationVerifier | null;
}

export interface ChildStudent {
  student_id: number;
  fname: string;
  lname: string;
  lrn_number: string;
  grade_level: RegistrationGradeLevel;
}

export interface SubjectGrade {
  srs_id: number;
  srecord_id: number;
  student_id: number;
  q1_grade: number | null;
  q2_grade: number | null;
  q3_grade: number | null;
  q4_grade: number | null;
  avg_grade: number | null;
  remarks: "PASSED" | "FAILED" | "IN_PROGRESS";
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

export interface RegistrationsListResponse {
  data: ParentRegistration[];
  pagination: Pagination;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const parentsApi = {
  /**
   * Submit a new parent registration with supporting document uploads.
   * Requires authentication (parent must already have an account).
   * At least one file attachment is required.
   */
  submitRegistration(
    studentIds: number[],
    files: File[],
  ): Promise<{ message: string; data: ParentRegistration }> {
    const formData = new FormData();
    for (const id of studentIds) formData.append("student_ids", String(id));
    for (const file of files) formData.append("attachments", file);
    return apiUpload("/parents/register", formData);
  },

  /**
   * Fetch a paginated list of parent registrations.
   * Optionally filter by status.
   * Requires Admin, Teacher, Principal, or Vice_Principal role.
   */
  getAllRegistrations(params?: {
    page?: number;
    limit?: number;
    status?: RegistrationStatus;
  }): Promise<RegistrationsListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiFetch(`/parents/registrations${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch a single registration with all attached files and student info.
   */
  getRegistrationById(id: number): Promise<{ data: ParentRegistration }> {
    return apiFetch(`/parents/registrations/${id}`);
  },

  /**
   * Approve or deny a pending parent registration.
   * Approving automatically sets the parent's account_status to Active.
   * Requires Admin, Teacher, Principal, or Vice_Principal role.
   */
  verifyRegistration(
    id: number,
    payload: { status: "VERIFIED" | "DENIED"; remarks?: string },
  ): Promise<{ message: string; data: ParentRegistration }> {
    return apiFetch(`/parents/registrations/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Return the list of students linked to the current parent via a
   * VERIFIED registration.
   */
  getMyChildren(): Promise<{ data: ChildStudent[] }> {
    return apiFetch("/parents/my-children");
  },

  /**
   * Return all quarterly grades for one of the current parent's children.
   * Returns 403 if the student does not belong to the authenticated parent.
   */
  getChildGrades(studentId: number): Promise<{ data: SubjectGrade[] }> {
    return apiFetch(`/parents/children/${studentId}/grades`);
  },

  /**
   * Return the monthly attendance records for one of the current parent's
   * children.
   * Returns 403 if the student does not belong to the authenticated parent.
   */
  getChildAttendance(studentId: number): Promise<{ data: AttendanceRecord[] }> {
    return apiFetch(`/parents/children/${studentId}/attendance`);
  },
};
