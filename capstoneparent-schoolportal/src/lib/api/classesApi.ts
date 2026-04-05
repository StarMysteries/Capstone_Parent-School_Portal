import { apiFetch, bearerHeaders } from "./base";

export interface Section {
  section_id: number;
  section_name: string;
}

export interface GradeLevelOption {
  gl_id: number;
  grade_level: string;
}

export interface ClassListItem {
  clist_id: number;
  gl_id: number;
  section_id: number;
  syear_start: number;
  syear_end: number;
  grade_level?: GradeLevelOption;
  section?: Section;
}

export const classesApi = {
  getAllClasses: async (page = 1, limit = 100) => {
    return apiFetch<{ data: ClassListItem[] }>("/classes?page=" + page + "&limit=" + limit, {
      method: "GET",
      headers: bearerHeaders(),
    });
  },

  getSections: async () => {
    return apiFetch<{ data: Section[] }>("/classes/sections/all", {
      method: "GET",
      headers: bearerHeaders(),
    });
  },

  createSection: async (name: string) => {
    return apiFetch<{ data: Section }>("/classes/sections", {
      method: "POST",
      headers: {
        ...bearerHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ section_name: name }),
    });
  },

  updateSection: async (id: number, name: string) => {
    return apiFetch<{ data: Section }>(`/classes/sections/${id}`, {
      method: "PUT",
      headers: {
        ...bearerHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ section_name: name }),
    });
  },

  deleteSection: async (id: number) => {
    return apiFetch<void>(`/classes/sections/${id}`, {
      method: "DELETE",
      headers: bearerHeaders(),
    });
  },

  importStudents: async (classId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<{ message: string; data: unknown[] }>(
      `/classes/${classId}/import-students`,
      {
        method: "POST",
        headers: bearerHeaders(),
        body: formData,
      },
    );
  },
};
