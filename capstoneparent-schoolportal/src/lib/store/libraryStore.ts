import { create } from "zustand";
import { libraryApi, type GetMaterialsParams, type GetBorrowHistoryParams } from "../api/libraryApi";
import type { 
  LearningMaterial, 
  LibraryCategory, 
  BorrowRecord, 
  PaginationMeta,
  MaterialStatus
} from "../api/types";

// --- Constants ---

export const GRADE_LEVELS = [
  { id: 1, label: "Grade 1" },
  { id: 2, label: "Grade 2" },
  { id: 3, label: "Grade 3" },
  { id: 4, label: "Grade 4" },
  { id: 5, label: "Grade 5" },
  { id: 6, label: "Grade 6" },
  { id: 7, label: "Grade 7" },
  { id: 8, label: "Grade 8" },
  { id: 9, label: "Grade 9" },
  { id: 10, label: "Grade 10" },
  { id: 11, label: "Grade 11" },
  { id: 12, label: "Grade 12" },
];

export function formatGradeLevel(glId: number): string {
  const found = GRADE_LEVELS.find((g) => g.id === glId);
  return found ? found.label : `Grade ${glId}`;
}

// --- Store ---

interface LibraryState {
  materials: LearningMaterial[];
  categories: LibraryCategory[];
  borrowHistory: BorrowRecord[];
  
  loading: boolean;
  
  materialsPagination: PaginationMeta | null;
  historyPagination: PaginationMeta | null;

  // Actions
  fetchMaterials: (params?: GetMaterialsParams) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createMaterial: (data: Partial<LearningMaterial>) => Promise<void>;
  updateMaterial: (id: number, data: Partial<LearningMaterial>) => Promise<void>;
  deleteMaterial: (id: number) => Promise<void>;
  
  createCategory: (name: string) => Promise<void>;
  
  addCopy: (id: number, data: { copy_code: number; condition?: string }) => Promise<void>;
  updateCopyStatus: (copyId: number, data: { status: MaterialStatus; condition?: string }) => Promise<void>;
  
  borrowMaterial: (data: { copy_id: number; student_id?: number; user_id?: number; due_at?: string }) => Promise<void>;
  returnMaterial: (borrowId: number, data: { penalty_cost?: number; remarks?: string }) => Promise<void>;
  fetchBorrowHistory: (params?: GetBorrowHistoryParams) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  materials: [],
  categories: [],
  borrowHistory: [],
  loading: false,
  materialsPagination: null,
  historyPagination: null,

  fetchMaterials: async (params) => {
    set({ loading: true });
    try {
      const res = await libraryApi.getAllMaterials(params);
      set({ materials: res.data, materialsPagination: res.pagination });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    const res = await libraryApi.getAllCategories();
    set({ categories: res.data });
  },

  createMaterial: async (data) => {
    await libraryApi.createMaterial(data);
    await get().fetchMaterials();
  },

  updateMaterial: async (id, data) => {
    await libraryApi.updateMaterial(id, data);
    await get().fetchMaterials();
  },

  deleteMaterial: async (id) => {
    await libraryApi.deleteMaterial(id);
    await get().fetchMaterials();
  },

  createCategory: async (category_name) => {
    await libraryApi.createCategory({ category_name });
    await get().fetchCategories();
  },

  addCopy: async (id, data) => {
    await libraryApi.addCopy(id, data);
    await get().fetchMaterials();
  },

  updateCopyStatus: async (copyId, data) => {
    await libraryApi.updateCopyStatus(copyId, data);
    await get().fetchMaterials();
  },

  borrowMaterial: async (data) => {
    await libraryApi.borrowMaterial(data);
    await get().fetchMaterials();
  },

  returnMaterial: async (borrowId, data) => {
    await libraryApi.returnMaterial(borrowId, data);
    await get().fetchBorrowHistory();
    await get().fetchMaterials();
  },

  fetchBorrowHistory: async (params) => {
    set({ loading: true });
    try {
      const res = await libraryApi.getBorrowHistory(params);
      set({ borrowHistory: res.data, historyPagination: res.pagination });
    } finally {
      set({ loading: false });
    }
  },
}));
