/**
 * index.ts
 * Barrel export for all API modules.
 *
 * Import from "@/lib/api" in components:
 *
 *   import { authApi } from "@/lib/api";
 *   import { studentsApi, type StudentSearchResult } from "@/lib/api";
 */

export { apiFetch, apiUpload, API_BASE } from "./client";

export { announcementsApi } from "./announcementApi";
export type {
  Announcement,
  AnnouncementType,
  AnnouncementFile,
  AnnouncementFileJoin,
  AnnouncementsListResponse,
  AnnouncementResponse,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "./announcementApi";

export { authApi } from "./authApi";
export type { AuthUser, TrustedDevice } from "./authApi";

export { classesApi } from "./classesApi";
export type {
  ClassList,
  SubjectRecord,
  SubjectRecordStudent,
  AttendanceRecord as ClassAttendanceRecord,
  GradeRemarks,
  AttendanceMonth,
  ClassesListResponse,
  CreateClassPayload,
  UpdateClassPayload,
  AddSubjectPayload,
  UpdateGradesPayload,
  UpdateAttendancePayload,
} from "./classesApi";

export { eventsApi } from "./eventsApi";
export type {
  SchoolEvent,
  EventCreator,
  EventsListResponse,
  EventResponse,
  CreateEventPayload,
  UpdateEventPayload,
} from "./eventsApi";

export { libraryApi } from "./libraryApi";
export type {
  LearningMaterial,
  MaterialCopy,
  LibraryCategory,
  BorrowRecord,
  ItemType,
  CopyStatus,
  MaterialsListResponse,
  BorrowHistoryResponse,
  CreateMaterialPayload,
  UpdateMaterialPayload,
  AddCopyPayload,
  UpdateCopyStatusPayload,
  BorrowMaterialPayload,
  ReturnMaterialPayload,
} from "./libraryApi";

export { parentsApi } from "./parentsApi";
export type {
  ParentRegistration,
  RegistrationStatus,
  ChildStudent,
  SubjectGrade,
  AttendanceRecord as ParentAttendanceRecord,
  RegistrationsListResponse,
} from "./parentsApi";

export { studentsApi } from "./studentsApi";
export type {
  Student,
  StudentSearchResult,
  StudentStatus,
  StudentGrade,
  AttendanceRecord as StudentAttendanceRecord,
  StudentsListResponse,
  CreateStudentPayload,
  UpdateStudentPayload,
} from "./studentsApi";

export { usersApi } from "./usersApi";
export type {
  User,
  UserRole,
  UserRoleValue,
  AccountStatus,
  UsersListResponse,
  UpdateUserPayload,
} from "./usersApi";
