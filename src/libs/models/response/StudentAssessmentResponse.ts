export interface RecommendedCareerResponse {
  careerId: number;
  career: string;
}

export interface RecommendedCourseResponse {
  courseId: number;
  courseDescription: string;
  assessmentResult: number;
  resultDescription: string;
  studentId: number | null;
  careers: RecommendedCareerResponse[];
}

export interface StudentAssessmentResponse {
  studentId: number;
  userName: string;
  email: string;
  enrollmentStatus: string;
  enrolledUniversity: string;
  universityId: number | null;
  createdDateTime: string;
  assessmentStatus: string;
  recommendedCourses: RecommendedCourseResponse[];
}