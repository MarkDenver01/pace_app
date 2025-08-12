import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { BookOpen, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getUniversities, getAllCourses } from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type { CourseResponse } from "../../../libs/models/Course";

export default function SuperViewRecords() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const univData = await getUniversities();
        setUniversities(univData);

        const queryUnivId = Number(searchParams.get("university"));
        if (queryUnivId && univData.some(u => u.universityId === queryUnivId)) {
          setSelectedUniversityId(queryUnivId);
        } else if (univData.length > 0) {
          // default to first university if query param invalid/missing
          setSelectedUniversityId(univData[0].universityId);
          setSearchParams({ university: String(univData[0].universityId) });
        }
      } catch (err) {
        console.error("Error loading universities:", err);
      }
    };
    fetchUniversities();
  }, [searchParams, setSearchParams]);

  // Fetch courses whenever selectedUniversityId changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedUniversityId) return;
      setLoading(true);
      try {
        const allCourses = await getAllCourses();
        const filtered = allCourses.filter(
          (c: CourseResponse) =>
            c.status === "Active" && c.universityId === selectedUniversityId
        );
        setCourses(filtered);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedUniversityId]);

  // Reset selected course when university changes
  useEffect(() => {
    setSelectedCourse(null);
  }, [selectedUniversityId]);

  const cardClass =
    "flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border border-orange-600";

  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };

  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };
  const descStyle = { color: "var(--muted-text-color, #6b7280)" };

  if (loading) {
    return <div className="p-4">Loading records...</div>;
  }

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
            value={selectedUniversityId ?? ""}
            onChange={(e) => {
              const newId = Number(e.target.value);
              setSelectedUniversityId(newId);
              setSearchParams({ university: String(newId) });
            }}
            className="w-64 border rounded-md p-2 bg-white text-sm"
          >
            {universities.map((univ) => (
              <option key={univ.universityId} value={univ.universityId}>
                {univ.universityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Courses */}
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
            {courses.map((course) => (
              <Button
                key={ course.courseName}
                onClick={() => setSelectedCourse(course.courseName)}
                style={{
                  width: "100%",
                  height: "42px",
                  backgroundColor:
                    selectedCourse === course.courseName
                      ? "var(--button-color)"
                      : "var(--card-color)",
                  color:
                    selectedCourse === course.courseName
                      ? "#ffffff"
                      : "var(--text-color)",
                  border:
                    selectedCourse === course.courseName
                      ? "none"
                      : "1px solid var(--divider-color)",
                }}
                className="rounded-md text-sm font-medium transition-all flex items-center justify-center"
              >
                {course.courseName}
              </Button>
            ))}
          </div>

          <div className="text-xs mt-4" style={descStyle}>
            Select a course to preview result
          </div>
        </div>

        {/* Result Viewer */}
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
                      courses.find((c) => c.courseName === selectedCourse)
                        ?.assessed
                    }
                    /
                    {courses.find((c) => c.courseName === selectedCourse)?.max}
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
