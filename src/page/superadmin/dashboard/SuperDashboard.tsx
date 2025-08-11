import { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpenCheck } from "lucide-react";
import {
  getUniversities,
  getCourseCountByUniversity,
  getAllCourses
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

        // 1️⃣ Fetch all universities
        const uniData = await getUniversities();
        setUniversities(uniData);

        // 2️⃣ Fetch all courses to calculate students per course
        const courseData: CourseResponse[] = await getAllCourses();
        const studentsByCourse: Record<string, number> = {};
        courseData.forEach(course => {
          studentsByCourse[course.courseName] = (studentsByCourse[course.courseName] || 0) + (course.assessed || 0);
        });
        setStudentsPerCourse(studentsByCourse);

        // 3️⃣ Fetch active course count for each university
        const courseCountMap: Record<string, number> = {};
        for (const uni of uniData) {
          const count = await getCourseCountByUniversity(uni.universityId);
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
    "w-full flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border";

  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };

  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };
  const descStyle = { color: "var(--muted-text-color, #6b7280)" };

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Total Universities */}
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <GraduationCap size={28} />
          </div>
          <span className="text-sm font-semibold" style={labelStyle}>
            Total Universities
          </span>
        </div>
        <div className="text-4xl font-bold" style={valueStyle}>
          {universities.length}
        </div>
        <div className="text-xs" style={descStyle}>
          Fetched from backend
        </div>
      </div>

      {/* Students Per Course */}
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <Users size={28} />
          </div>
          <span className="text-sm font-semibold" style={labelStyle}>
            Students per Course
          </span>
        </div>
        <div className="text-sm" style={valueStyle}>
          <ul className="space-y-1 mt-2">
            {Object.entries(studentsPerCourse).map(([course, count]) => (
              <li key={course} className="flex justify-between">
                <span>{course}</span>
                <span className="font-semibold">{count} Students</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs" style={descStyle}>
          From course assessment data
        </div>
      </div>

      {/* Courses Per University */}
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <BookOpenCheck size={28} />
          </div>
          <span className="text-sm font-semibold" style={labelStyle}>
            Active Courses / University
          </span>
        </div>
        <div className="text-sm" style={valueStyle}>
          <ul className="space-y-1 mt-2">
            {Object.entries(coursesPerUniversity).map(([univ, count]) => (
              <li key={univ} className="flex justify-between">
                <span>{univ}</span>
                <span className="font-semibold">{count} Courses</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs" style={descStyle}>
          Includes only active programs
        </div>
      </div>
    </div>
  );
}
