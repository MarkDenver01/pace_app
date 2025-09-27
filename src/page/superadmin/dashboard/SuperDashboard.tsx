import { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpenCheck } from "lucide-react";
import {
  getUniversities,
  getAllCourses,
  getActiveCourseCountByUniversity,
} from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type { CourseResponse } from "../../../libs/models/Course";

export default function SuperAdminDashboard() {
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [studentsPerCourse, setStudentsPerCourse] = useState<Record<string, number>>({});
  const [coursesPerUniversity, setCoursesPerUniversity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1️ Fetch all universities
        const uniData = await getUniversities();
        setUniversities(uniData);

        // 2 Fetch all courses to calculate students per course
        const courseData: CourseResponse[] = await getAllCourses();
        const studentsByCourse: Record<string, number> = {};
        courseData.forEach(course => {
          studentsByCourse[course.courseName] =
            (studentsByCourse[course.courseName] || 0) + (course.assessed || 0);
        });
        setStudentsPerCourse(studentsByCourse);

        // 3️ Fetch active course count for each university
        const courseCountMap: Record<string, number> = {};
        for (const uni of uniData) {
          const count = await getActiveCourseCountByUniversity(uni.universityId);
          courseCountMap[uni.universityName] = count;
        }
        setCoursesPerUniversity(courseCountMap);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardClass =
    "w-full flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border border-orange-600";

  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Total Universities */}
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <GraduationCap size={28} />
          </div>
          <span className="text-sm font-semibold">Total Universities</span>
        </div>
        <div className="text-4xl font-bold">{universities.length}</div>
        <div className="text-xs text-gray-500">Fetched from backend</div>
      </div>

      {/* Students Per Course */}
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <Users size={28} />
          </div>
          <span className="text-sm font-semibold">Students per Course (Assessment-Based)</span>
        </div>
        <div className="text-sm">
          <ul className="space-y-1 mt-2">
            {Object.entries(studentsPerCourse).map(([course, count]) => (
              <li key={course} className="flex justify-between">
                <span>{course}</span>
                <span className="font-semibold">{count} Students</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-gray-500">From course assessment data</div>
      </div>

      {/* Active Courses Per University */}
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <BookOpenCheck size={28} />
          </div>
          <span className="text-sm font-semibold">Active Courses per University</span>
        </div>
        <div className="text-sm">
          <ul className="space-y-1 mt-2">
            {Object.entries(coursesPerUniversity).map(([univ, count]) => (
              <li key={univ} className="flex justify-between">
                <span>{univ}</span>
                <span className="font-semibold">{count} Courses</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-gray-500">Assigned by university admin</div>
      </div>
    </div>
  );
}
