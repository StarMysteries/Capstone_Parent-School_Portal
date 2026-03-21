/**
 * src/lib/api/students.ts
 */

import { apiFetch, bearerHeaders } from "./base";
import type { ApiList, StudentSearchResult } from "./types";

export const studentsApi = {
  // GET /api/students/search?lrn=...
  searchByLrn(lrn: string) {
    return apiFetch<ApiList<StudentSearchResult>>(
      `/students/search?lrn=${encodeURIComponent(lrn)}`,
      { headers: bearerHeaders() },
    );
  },
};
