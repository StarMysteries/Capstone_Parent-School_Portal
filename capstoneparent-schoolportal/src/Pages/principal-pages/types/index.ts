export interface SectionItem {
  id: number;
  name: string; // e.g., "Section A", "Section B"
}

export interface TeacherItem {
  id: number;
  name: string;
}

export interface ClassItem {
  id: number;
  grade: string;
  section: string;
  start_year: number;
  end_year: number;
  teacher_id?: number;
  teacher_name?: string; // Populated from join
}

export interface SubjectItem {
  id: number;
  name: string;
  grade: string;
  section: string;
  start_year: number;
  end_year: number;
  teacher_id?: number;
  teacher_name?: string; // Populated from join
}

export interface Student {
  id: number;
  classId: number;
  name: string;
  lrn: string;
}