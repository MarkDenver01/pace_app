import { type StudentResponse } from "./StudentResponse.ts";

export interface StudentListResponse {
    total: number;
    students: StudentResponse[];
}