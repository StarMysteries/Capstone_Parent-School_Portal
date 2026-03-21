/**
 * src/lib/api/types.ts
 */

export interface ApiMessage {
  message: string;
}

export interface ApiData<T> {
  message?: string;
  data: T;
}

export interface ApiList<T> {
  message?: string;
  data: T[];
}

export interface AuthUser {
  user_id: number;
  email: string;
  fname: string;
  lname: string;
  contact_num: string;
  address: string;
  account_status: "Active" | "Inactive";
  created_at: string;
  roles: { role: string }[];
}

export interface StudentSearchResult {
  student_id: number;
  lrn_number: string;
  fname: string;
  lname: string;
  grade_level: { grade_level: string };
}
