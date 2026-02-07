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
  
  // Add quarterly data
  quarters?: {
    q1?: QuarterGrades;
    q2?: QuarterGrades;
    q3?: QuarterGrades;
    q4?: QuarterGrades;
  };
}

export interface QuarterGrades {
  subjects: {
    Filipino?: number;
    English?: number;
    Math?: number;
    Science?: number;
    AP?: number;
    GMRC?: number;
    EPP?: number;
    MAPEH?: number;
  };
  average: number;
  passed: boolean;
}

export interface ClassSummaryProps {
  students: Student[];
}

export interface QuarterStats {
  quarter: string;
  passingRate: number;
  totalStudents: number;
  passedStudents: number;
  color: string;
}

export interface SubjectAverage {
  subject: string;
  average: number;
  fullMark: number;
}