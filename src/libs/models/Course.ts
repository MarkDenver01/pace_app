export interface CourseResponse {
    courseId: number;
    courseName: string;
    courseDescription: string;
    status: string;
    universityId: number;
    universityName: string;
    max: number;
    assessed: number;
}

export interface CourseRequest {
  courseName: string;
  courseDescription: string;
  universityId: number;
  status: string;
}
