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

// Student interface
export interface Student {
  id: number;
  classId: number;
  name: string;
  lrn: string;
  sex: string;
  schoolYear: string;     // Need to change: must be based on subject school year
  gradeSection: string;
  finalAvgGrade: number | string;
  remarks: string;
  
  // Subject grades with all quarters
  subjectGrades?: SubjectGrade[];
  
  // Attendance records
  attendance?: AttendanceRecord;
}

// Student subjects grades interface
export interface SubjectGrade {
  subject: string;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  finalGrade: number | string; // Stored in DB
  remarks: string; // Stored in DB (PASSED/FAILED)
}

// Attendance data structure
export interface AttendanceRecord {
  months: {
    Jun: MonthAttendance;
    Jul: MonthAttendance;
    Aug: MonthAttendance;
    Sept: MonthAttendance;
    Oct: MonthAttendance;
    Nov: MonthAttendance;
    Dec: MonthAttendance;
    Jan: MonthAttendance;
    Feb: MonthAttendance;
    Mar: MonthAttendance;
    Apr: MonthAttendance;
  };
}

export interface MonthAttendance {
  schoolDays: number;
  present: number;
  absent: number;
}

// For backward compatibility with ClassSummary
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

// Props for StudentGrades component
export interface StudentGradesProps {
  student: Student;
  onBack: () => void;
}
