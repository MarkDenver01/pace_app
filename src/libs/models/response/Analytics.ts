export interface DailyAssessmentCountResponse {
  date: string; // "yyyy-MM-dd"
  count: number;
}

export interface DailySameSchoolCountResponse {
  date: string;
  count: number;
}

export interface DailyOtherSchoolCountResponse {
  date: string;
  count: number;
}

export interface DailyNewSchoolCountResponse {
  date: string;
  count: number;
}

export interface CourseCountResponse {
  courseDescription: string;
  total: number;
}

export interface CompetitorUniversityCountResponse {
  universityName: string;
  date: string; // yyyy-MM-dd
  count: number;
}