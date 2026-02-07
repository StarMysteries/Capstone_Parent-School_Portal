export interface ClassItem {
  id: number;
  grade: string;
  section: string;
  start_year: number;
  end_year: number;
}

export interface SubjectItem {
  id: number;
  name: string;
  grade: string;
  section: string;
  start_year: number;
  end_year: number;
}

export interface Student {
  id: number;
  classId: number;
  name: string;
  lrn: string;
  finalAvgGrade: number | string;
  remarks: string;
}