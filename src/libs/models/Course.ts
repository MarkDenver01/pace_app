export interface CourseResponse {
    courseName: string;
    courseDescription: string;
    status: string;
    universityId: number;
    max: number;
    assessed: number;
}

export interface CourseRequest {
  courseName: string;
  courseDescription: string;
  universityId: number;
}
