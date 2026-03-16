import type { ClassItem, SubjectItem, Student, SectionItem, TeacherItem } from '@/Pages/principal-pages/types';

const API_BASE_URL = '/api'; // Replace with actual API base URL

// ==================== SAMPLE DATA ====================

const SAMPLE_SECTIONS: SectionItem[] = [
  { id: 1, name: 'Section A' },
  { id: 2, name: 'Section B' },
  { id: 3, name: 'Section C' },
  { id: 4, name: 'Section D' },
];

const SAMPLE_TEACHERS: TeacherItem[] = [
  { id: 1, name: 'Dominique Enriquez' },
  { id: 2, name: 'Maria Santos' },
  { id: 3, name: 'Juan Dela Cruz' },
  { id: 4, name: 'Romulo Terrence' },
];

const SAMPLE_CLASSES: ClassItem[] = [
  { id: 1, grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025, teacher_id: 4, teacher_name: 'Romulo Terrence' },
  { id: 2, grade: 'Grade 1', section: 'Section B', start_year: 2023, end_year: 2024, teacher_id: 1, teacher_name: 'Dominique Enriquez' },
];

const SAMPLE_SUBJECTS: SubjectItem[] = [
  { id: 1, name: 'Filipino', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025, teacher_id: 1, teacher_name: 'Dominique Enriquez' },
  { id: 2, name: 'English', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025 },
  { id: 3, name: 'Mathematics', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025 },
  { id: 4, name: 'Science', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025 },
  { id: 5, name: 'Araling Panlipunan (AP)', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025 },
  { id: 6, name: 'Good Manners & Right Conduct (GMRC)', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025 },
  { id: 7, name: 'Edukasyong Pantahanan at Pangkabuhayan (EPP)', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025 },
  { id: 8, name: 'MAPEH', grade: 'Grade 1', section: 'Section A', start_year: 2024, end_year: 2025 },
];

const SAMPLE_STUDENTS: Student[] = [
  { id: 1, classId: 1, name: 'Angela Reyes', lrn: '501142400721' },
  { id: 2, classId: 1, name: 'Angelo Moreno', lrn: '501142400731' },
  { id: 3, classId: 1, name: 'Sophia Dizon', lrn: '501142400731' },
  { id: 4, classId: 2, name: 'Juan Dela Cruz', lrn: '501142400741' },
  { id: 5, classId: 2, name: 'Maria Santos', lrn: '501142400751' },
];

// ==================== API FUNCTIONS ====================

export const fetchClasses = async (): Promise<ClassItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching classes:', error);
    return SAMPLE_CLASSES;
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

export const fetchSections = async (): Promise<SectionItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sections`);
    if (!response.ok) throw new Error('Failed to fetch sections');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sections:', error);
    return SAMPLE_SECTIONS;
  }
};

export const fetchTeachers = async (): Promise<TeacherItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teachers`);
    if (!response.ok) throw new Error('Failed to fetch teachers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return SAMPLE_TEACHERS;
  }
};

export const addSubjects = async (
  classId: number,
  subjectNames: string[]
): Promise<SubjectItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/add-subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject_names: subjectNames }),
    });
    if (!response.ok) throw new Error('Failed to add subjects');
    return await response.json();
  } catch (error) {
    console.error('Error adding subjects:', error);
    throw error;
  }
};

// ==================== MUTATIONS ====================

export const addClass = async (classData: {
  grade: string;
  section: string;
  start_year: number;
  end_year: number;
  teacher_id?: number;
}): Promise<ClassItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData),
    });
    if (!response.ok) throw new Error('Failed to add class');
    return await response.json();
  } catch (error) {
    console.error('Error adding class:', error);
    throw error;
  }
};

export const updateClass = async (
  classId: number,
  classData: {
    grade: string;
    section: string;
    start_year: number;
    end_year: number;
    teacher_id?: number;
  }
): Promise<ClassItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData),
    });
    if (!response.ok) throw new Error('Failed to update class');
    return await response.json();
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

export const assignTeacherToSubject = async (
  subjectId: number,
  teacherId: number
): Promise<SubjectItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/assign-teacher`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacher_id: teacherId }),
    });
    if (!response.ok) throw new Error('Failed to assign teacher');
    return await response.json();
  } catch (error) {
    console.error('Error assigning teacher:', error);
    throw error;
  }
};

export const removeSubject = async (subjectId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove subject');
  } catch (error) {
    console.error('Error removing subject:', error);
    throw error;
  }
};

export const removeStudentFromClass = async (studentId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/remove-from-class`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to remove student');
  } catch (error) {
    console.error('Error removing student:', error);
    throw error;
  }
};

export const assignClassAdviser = async (
  classId: number,
  teacherId: number
): Promise<ClassItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/assign-adviser`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacher_id: teacherId }),
    });
    if (!response.ok) throw new Error('Failed to assign class adviser');
    return await response.json();
  } catch (error) {
    console.error('Error assigning class adviser:', error);
    throw error;
  }
};