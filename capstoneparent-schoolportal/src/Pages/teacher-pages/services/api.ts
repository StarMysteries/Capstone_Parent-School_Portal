import type { ClassItem, SubjectItem, Student } from '@/Pages/teacher-pages/types';
import type { SectionItem } from '@/Pages/principal-pages/types';
import { apiFetch } from '@/lib/api/base';

export const fetchClasses = async (): Promise<ClassItem[]> => {
  try {
    const response = await apiFetch<{ data: any[] }>('/classes/teacher/list');
    return response.data.map(item => ({
      ...item,
      grade: item.grade_level?.grade_level,
      section_name: item.section?.section_name
    }));
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
};

export const fetchSubjects = async (): Promise<SubjectItem[]> => {
  try {
    const response = await apiFetch<{ data: any[] }>('/classes/subjects/teacher');
    return response.data.map((item) => {
      const firstClass = item.class_lists && item.class_lists.length > 0
        ? item.class_lists[0].class_list
        : null;

      return {
        ...item,
        studentCount: item.students?.length ?? 0,
        grade: firstClass?.grade_level?.grade_level || '',
        section: firstClass?.section?.section_name || '',
        syear_start: firstClass?.syear_start ?? undefined,
        syear_end: firstClass?.syear_end ?? undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
};

export const fetchStudents = async (clist_id?: number): Promise<Student[]> => {
  try {
    const endpoint = clist_id ? `/students?clist_id=${clist_id}` : '/students';
    const response = await apiFetch<{ data: any[] }>(endpoint);
    return response.data.map(item => ({
      ...item,
      name: `${item.fname} ${item.lname}`,
      lrn: item.lrn_number,
      schoolYear: `${item.syear_start} - ${item.syear_end}`,
      clist_id: item.clist_id ?? null,
      // Add other mappings as needed
    }));
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const fetchSections = async (): Promise<SectionItem[]> => {
  try {
    const response = await apiFetch<{ data: SectionItem[] }>('/classes/sections/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
};

export const fetchGradeLevels = async (): Promise<any[]> => {
  try {
    const response = await apiFetch<{ data: any[] }>('/classes/grade-levels/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching grade levels:', error);
    return [];
  }
};
