import { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpenCheck } from "lucide-react";

export default function SuperAdminDashboard() {
  const [universities, setUniversities] = useState(12);

  const [studentsPerCourse, setStudentsPerCourse] = useState({
    BSIT: 194,
    BSCS: 100,
    BASIS: 80,
    BSA: 76,
  });

  const [coursesPerUniversity, setCoursesPerUniversity] = useState({
    "University A": 8,
    "University B": 5,
    "University C": 10,
    "University D": 4,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setUniversities((prev) => prev + Math.floor(Math.random() * 2));

      setStudentsPerCourse((prev) => ({
        ...prev,
        BSIT: prev.BSIT + Math.floor(Math.random() * 3),
        BSCS: prev.BSCS + Math.floor(Math.random() * 2),
        BASIS: prev.BASIS + Math.floor(Math.random() * 2),
        BSA: prev.BSA + Math.floor(Math.random() * 2),
      }));

      setCoursesPerUniversity((prev) => ({
        ...prev,
        "University A": prev["University A"] + Math.floor(Math.random() * 2),
        "University B": prev["University B"] + Math.floor(Math.random() * 2),
        "University C": prev["University C"] + Math.floor(Math.random() * 2),
        "University D": prev["University D"] + Math.floor(Math.random() * 2),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Shared styles
  const cardClass =
    "w-full flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border";

  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };

  const labelStyle = {
    color: "var(--button-color)",
  };

  const valueStyle = {
    color: "var(--text-color)",
  };

  const descStyle = {
    color: "var(--muted-text-color, #6b7280)",
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Card 1: Total Universities */}
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
          {universities}
        </div>
        <div className="text-xs" style={descStyle}>
          Updated live
        </div>
      </div>

      {/* Card 2: Students Per Course */}
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
          Assessment-based live count
        </div>
      </div>

      {/* Card 3: Courses Per University */}
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
