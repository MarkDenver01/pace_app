export interface CourseResponse {
    courseName: String;
    courseDescription: String;
    status: String;
}

export interface CourseRequest {
  courseName: string;
  courseDescription: string;
  universityId: number;
}
