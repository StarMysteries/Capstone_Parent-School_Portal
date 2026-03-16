/**
 * classesApi.ts
 * All requests to /api/classes/*
 */

import { apiFetch } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceMonth =
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sept"
  | "Oct"
  | "Nov"
  | "Dec"
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr";

export type GradeRemarks = "PASSED" | "FAILED" | "IN_PROGRESS";

export interface GradeLevel {
  gl_id: number;
  grade_level: string;
}

export interface Section {
  section_id: number;
  section_name: string;
}

export interface ClassAdviser {
  user_id: number;
  fname: string;
  lname: string;
}

export interface ClassList {
  clist_id: number;
  gl_id: number;
  section_id: number;
  class_adviser: number;
  syear_start: number;
  syear_end: number;
  class_sched: string | null;
  grade_level: GradeLevel;
  section: Section;
  adviser: ClassAdviser;
}

export interface SubjectTeacher {
  user_id: number;
  fname: string;
  lname: string;
}

export interface SubjectRecordStudent {
  srs_id: number;
  srecord_id: number;
  student_id: number;
  q1_grade: number | null;
  q2_grade: number | null;
  q3_grade: number | null;
  q4_grade: number | null;
  avg_grade: number | null;
  remarks: GradeRemarks;
}

export interface SubjectRecord {
  srecord_id: number;
  subject_name: string;
  time_start: string;
  time_end: string;
  subject_teacher: number;
  teacher: SubjectTeacher;
  students: SubjectRecordStudent[];
}

export interface AttendanceRecord {
  attendance_id: number;
  student_id: number;
  school_days: number;
  days_present: number;
  days_absent: number;
  month: AttendanceMonth;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClassesListResponse {
  data: ClassList[];
  pagination: Pagination;
}

export interface CreateClassPayload {
  gl_id: number;
  section_id: number;
  class_adviser: number;
  syear_start: number;
  syear_end: number;
  class_sched?: string;
}

export interface UpdateClassPayload {
  gl_id?: number;
  section_id?: number;
  class_adviser?: number;
  class_sched?: string;
}

export interface AddSubjectPayload {
  subject_name: string;
  /** HH:mm */
  time_start: string;
  /** HH:mm */
  time_end: string;
  subject_teacher: number;
}

export interface UpdateGradesPayload {
  q1_grade?: number;
  q2_grade?: number;
  q3_grade?: number;
  q4_grade?: number;
}

export interface UpdateAttendancePayload {
  school_days: number;
  days_present: number;
  days_absent: number;
  month: AttendanceMonth;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const classesApi = {
  /**
   * Fetch a paginated list of class lists.
   * Optionally filter by school year start or grade level ID.
   * Requires Teacher, Admin, Principal, or Vice_Principal role.
   */
  getAll(params?: {
    page?: number;
    limit?: number;
    school_year?: number;
    grade_level?: number;
  }): Promise<ClassesListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.school_year)
      query.set("school_year", String(params.school_year));
    if (params?.grade_level)
      query.set("grade_level", String(params.grade_level));
    const qs = query.toString();
    return apiFetch(`/classes${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch a single class list with subjects and student records.
   * Requires Teacher, Admin, Principal, or Vice_Principal role.
   */
  getById(id: number): Promise<{ data: ClassList }> {
    return apiFetch(`/classes/${id}`);
  },

  /**
   * Create a new class list.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  create(
    payload: CreateClassPayload,
  ): Promise<{ message: string; data: ClassList }> {
    return apiFetch("/classes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing class list.
   * Requires Admin, Principal, or Vice_Principal role.
   */
  update(
    id: number,
    payload: UpdateClassPayload,
  ): Promise<{ message: string; data: ClassList }> {
    return apiFetch(`/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a class list.
   * Requires Admin or Principal role.
   */
  delete(id: number): Promise<{ message: string }> {
    return apiFetch(`/classes/${id}`, { method: "DELETE" });
  },

  /**
   * Add a subject record to a class list.
   * Requires Admin, Principal, Vice_Principal, or Teacher role.
   */
  addSubject(
    classId: number,
    payload: AddSubjectPayload,
  ): Promise<{ message: string; data: SubjectRecord }> {
    return apiFetch(`/classes/${classId}/subjects`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch all subject records for a class list.
   * Requires Teacher, Admin, Principal, or Vice_Principal role.
   */
  getSubjects(classId: number): Promise<{ data: SubjectRecord[] }> {
    return apiFetch(`/classes/${classId}/subjects`);
  },

  /**
   * Create or update quarterly grades for a student in a subject.
   * Calculates avg_grade and remarks (PASSED / FAILED / IN_PROGRESS) automatically.
   * Requires Teacher, Admin, Principal, or Vice_Principal role.
   */
  updateStudentGrades(
    subjectId: number,
    studentId: number,
    payload: UpdateGradesPayload,
  ): Promise<{ message: string; data: SubjectRecordStudent }> {
    return apiFetch(
      `/classes/subjects/${subjectId}/students/${studentId}/grades`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
  },

  /**
   * Create or update monthly attendance for a student.
   * Requires Teacher, Admin, Principal, or Vice_Principal role.
   */
  updateAttendance(
    studentId: number,
    payload: UpdateAttendancePayload,
  ): Promise<{ message: string; data: AttendanceRecord }> {
    return apiFetch(`/classes/students/${studentId}/attendance`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
