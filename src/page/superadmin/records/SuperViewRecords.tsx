import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { BookOpen, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";

// Dummy data
const universityCourses: Record<
  string,
  { name: string; assessed: number; max: number }[]
> = {
  "University A": [
    { name: "IT", assessed: 20, max: 100 },
    { name: "Crim", assessed: 50, max: 100 },
    { name: "NURSE", assessed: 70, max: 100 },
    { name: "EDUC", assessed: 60, max: 150 },
    { name: "ENGINEERING", assessed: 10, max: 100 },
    { name: "Business", assessed: 90, max: 100 },
    { name: "Psych", assessed: 100, max: 100 },
    { name: "HRM", assessed: 45, max: 80 },
    { name: "Tourism", assessed: 30, max: 90 },
    { name: "Accountancy", assessed: 55, max: 100 },
    { name: "Marketing", assessed: 28, max: 80 },
    { name: "Political Science", assessed: 32, max: 70 },
    { name: "Agriculture", assessed: 18, max: 60 },
  ],
  "University B": [
    { name: "Law", assessed: 25, max: 100 },
    { name: "Nursing", assessed: 30, max: 80 },
    { name: "Marine Biology", assessed: 40, max: 85 },
    { name: "Physics", assessed: 12, max: 50 },
  ],
  "University C": [
    { name: "CS", assessed: 40, max: 90 },
    { name: "IT", assessed: 60, max: 100 },
    { name: "Chemistry", assessed: 20, max: 60 },
    { name: "Mathematics", assessed: 25, max: 65 },
    { name: "Architecture", assessed: 22, max: 70 },
  ],
  "University D": [
    { name: "Education", assessed: 80, max: 120 },
    { name: "Fine Arts", assessed: 35, max: 60 },
    { name: "Philosophy", assessed: 10, max: 40 },
  ],
};

export default function SuperViewRecords() {
  const [searchParams] = useSearchParams();
  const defaultUniversity = searchParams.get("university") || "University A";
  const [selectedUniversity, setSelectedUniversity] = useState(defaultUniversity);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const activeCourses = universityCourses[selectedUniversity] || [];

  useEffect(() => {
    setSelectedCourse(null);
  }, [selectedUniversity]);

  // Match dashboard theme exactly
  const cardClass =
    "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border";

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
    <div className="p-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold" style={valueStyle}>
          Records
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={valueStyle}>
            University:
          </label>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="w-64 border rounded-md p-2 bg-white text-sm"
          >
            {Object.keys(universityCourses).map((univ) => (
              <option key={univ} value={univ}>
                {univ}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid layout matching dashboard theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Active Courses */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={iconWrapperStyle}>
              <BookOpen size={24} />
            </div>
            <span className="text-sm font-semibold" style={labelStyle}>
              Active Courses
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-3 max-h-[460px] mt-2 pr-1">
            {activeCourses.map((course) => (
              <Button
                key={course.name}
                onClick={() => setSelectedCourse(course.name)}
                style={{
                  width: "100%",
                  height: "42px",
                  backgroundColor:
                    selectedCourse === course.name
                      ? "var(--button-color)"
                      : "var(--card-color)",
                  color:
                    selectedCourse === course.name
                      ? "#ffffff"
                      : "var(--text-color)",
                  border:
                    selectedCourse === course.name
                      ? "none"
                      : "1px solid var(--divider-color)",
                }}
                className="rounded-md text-sm font-medium transition-all flex items-center justify-center"
              >
                {course.name}
              </Button>
            ))}
          </div>

          <div className="text-xs mt-4" style={descStyle}>
            Select a course to preview result
          </div>
        </div>

        {/* Card: Result Viewer */}
        <div className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={iconWrapperStyle}>
              <Users size={24} />
            </div>
            <span className="text-sm font-semibold" style={labelStyle}>
              Result Viewer
            </span>
          </div>

          <div className="flex-1 mt-4">
            {selectedCourse ? (
              <div className="space-y-3">
                <p className="text-xl font-bold" style={valueStyle}>
                  {selectedCourse}
                </p>
                <p className="flex items-center gap-2 text-sm" style={valueStyle}>
                  <Users size={16} />
                  Student Assessed:
                  <span className="font-semibold ml-1">
                    {
                      activeCourses.find((c) => c.name === selectedCourse)?.assessed
                    }
                    /
                    {
                      activeCourses.find((c) => c.name === selectedCourse)?.max
                    }
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm" style={descStyle}>
                Please select a course to view results.
              </p>
            )}
          </div>

          <div className="text-xs mt-auto" style={descStyle}>
            Live assessment data
          </div>
        </div>
      </div>
    </div>
  );
}
