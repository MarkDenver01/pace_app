import { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpenCheck } from "lucide-react";
import {
  getUniversities,
  getAllCourses,
  getActiveCourseCountByUniversity,
} from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type { CourseResponse } from "../../../libs/models/Course";
import Mascot from "../../../assets/pace/super_admin_hero.png";

export default function SuperAdminDashboard() {
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [studentsPerCourse, setStudentsPerCourse] = useState<Record<string, number>>({});
  const [coursesPerUniversity, setCoursesPerUniversity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const uniData = await getUniversities();
        setUniversities(uniData);

        const courseData: CourseResponse[] = await getAllCourses();
        const studentsByCourse: Record<string, number> = {};
        courseData.forEach((c) => {
          studentsByCourse[c.courseName] =
            (studentsByCourse[c.courseName] || 0) + (c.assessed || 0);
        });
        setStudentsPerCourse(studentsByCourse);

        const courseCountMap: Record<string, number> = {};
        for (const uni of uniData) {
          const count = await getActiveCourseCountByUniversity(uni.universityId);
          courseCountMap[uni.universityName] = count;
        }
        setCoursesPerUniversity(courseCountMap);
      } catch (e) {
        console.error("Dashboard fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p className="p-6 text-lg">Loading dashboard...</p>;

  // === Card style classes === //
  const cardBase =
    "w-full bg-white rounded-2xl shadow-xl p-6 border-4 flex flex-col gap-3";

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen p-6">

      {/* LEFT CONTENT */}
      <div className="flex flex-col gap-6 w-full lg:w-[60%]">

        {/* 🔴 Total Universities */}
        <div className={`${cardBase} border-red-400`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <GraduationCap size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-700">Total Universities</h2>
          </div>

          <div className="text-[60px] leading-none font-extrabold text-red-600">
            {universities.length}
          </div>

          <p className="text-sm text-gray-500 font-medium">
            *Total Universities
          </p>
        </div>

        {/* 🔵 Students per Course */}
        <div className={`${cardBase} border-blue-400`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-700">
              Students per Course (Assessment-Based)
            </h2>
          </div>

          <ul className="mt-2 text-[15px] font-medium">
            {Object.entries(studentsPerCourse).map(([course, count]) => (
              <li key={course} className="flex justify-between py-1">
                <span>{course}</span>
                <span className="font-semibold text-blue-600">{count} Students</span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-gray-500 font-medium">
            From course assessment data
          </p>
        </div>

        {/* 🟡 Active Courses Per University */}
        <div className={`${cardBase} border-yellow-400`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BookOpenCheck size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-700">
              Active Courses per University
            </h2>
          </div>

          <ul className="mt-2 text-[15px] font-medium">
            {Object.entries(coursesPerUniversity).map(([uni, count]) => (
              <li key={uni} className="flex justify-between py-1">
                <span>{uni}</span>
                <span className="font-semibold text-yellow-600">{count} Students</span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-gray-500 font-medium">
            Assigned by university admin
          </p>
        </div>
      </div>

      {/* RIGHT CHARACTER IMAGE */}
      <div className="hidden lg:flex justify-center items-center w-[40%] relative">
        <img
          src={Mascot}
          alt="Mascot"
          className="w-[380px] absolute right-6 bottom-0 select-none"
        />
      </div>
    </div>
  );
}
