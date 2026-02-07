import type { ClassItem, SubjectItem, Student } from '@/Pages/teacher-pages/types';

const API_BASE_URL = '/api'; // backend URL

// Sample data for fallback
const SAMPLE_CLASSES: ClassItem[] = [
  {
    id: 1,
    grade: 'Grade 1',
    section: 'Section A',
    start_year: 2024,
    end_year: 2025,
  },
  {
    id: 2,
    grade: 'Grade 1',
    section: 'Section B',
    start_year: 2023,
    end_year: 2024,
  },
  {
    id: 3,
    grade: 'Grade 2',
    section: 'Section A',
    start_year: 2024,
    end_year: 2025,
  },
];

const SAMPLE_SUBJECTS: SubjectItem[] = [
  {
    id: 1,
    name: 'Mathematics',
    grade: 'Grade 1',
    section: 'Section A',
    start_year: 2024,
    end_year: 2025,
  },
  {
    id: 2,
    name: 'Science',
    grade: 'Grade 1',
    section: 'Section A',
    start_year: 2024,
    end_year: 2025,
  },
];

const SAMPLE_STUDENTS: Student[] = [
  {
    id: 1,
    classId: 1,
    name: 'Angela Reyes',
    lrn: '501142400721',
    finalAvgGrade: 90,
    remarks: 'PASSED',
  },
  {
    id: 2,
    classId: 1,
    name: 'Angelo Moreno',
    lrn: '501142400731',
    finalAvgGrade: 74,
    remarks: 'FAILED',
  },
  {
    id: 3,
    classId: 1,
    name: 'Sophia Dizon',
    lrn: '501142400741',
    finalAvgGrade: 'N/A',
    remarks: 'N/A',
  },
  {
    id: 4,
    classId: 2,
    name: 'Juan Dela Cruz',
    lrn: '501142400751',
    finalAvgGrade: 85,
    remarks: 'PASSED',
  },
  {
    id: 5,
    classId: 2,
    name: 'Maria Santos',
    lrn: '501142400761',
    finalAvgGrade: 92,
    remarks: 'PASSED',
  },
];

export const fetchClasses = async (): Promise<ClassItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching classes:', error);
    return SAMPLE_CLASSES; // Fallback to sample data
  }
};

export const fetchSubjects = async (): Promise<SubjectItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`);
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return SAMPLE_SUBJECTS;
  }
};

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return SAMPLE_STUDENTS;
  }
};