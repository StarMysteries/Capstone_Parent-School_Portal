/**
 * src/lib/api/index.ts
 */

export { authApi } from "./authApi";
export { studentsApi } from "./studentsApi";
export { usersApi } from "./usersApi";
export { pagesApi } from "./pagesApi";

export type {
  ApiMessage,
  ApiData,
  ApiList,
  AuthUser,
  StudentSearchResult,
} from "./types";
