export interface CourseResponse {
  courseId: number;
  courseName: string;
  courseDescription: string;
  status: string;
  max: number;
  assessed: number;
}

export interface CourseRequest {
  courseName: string;
  courseDescription: string;
  status: string;
}