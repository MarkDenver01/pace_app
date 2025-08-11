import { useEffect, useState } from "react";
import { Select, Button, Spinner } from "flowbite-react";
import { School2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UniversityResponse } from "../../../libs/models/University";
import { getUniversities, getCourseCountByUniversity } from "../../../libs/ApiResponseService";

export default function SuperRecordsPage() {
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courseCount, setCourseCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoadingUniversities(true);
        const data = await getUniversities();
        setUniversities(data);
        if (data.length > 0) {
          setSelectedUniversity(data[0].universityId);
        }
      } catch (error) {
        console.error("Error loading universities:", error);
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch course count whenever university changes
  useEffect(() => {
    const fetchCourseCount = async () => {
      if (selectedUniversity) {
        try {
          setLoadingCourses(true);
          const count = await getCourseCountByUniversity(selectedUniversity);
          setCourseCount(count);
        } catch (error) {
          console.error("Error loading course count:", error);
          setCourseCount(0);
        } finally {
          setLoadingCourses(false);
        }
      }
    };
    fetchCourseCount();
  }, [selectedUniversity]);

  const handleViewClick = () => {
    if (selectedUniversity) {
      navigate(`/superadmin/records/view?university=${selectedUniversity}`);
    }
  };

  // Shared styles
  const cardClass =
    "w-full flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border";
  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };
  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };
  const descStyle = { color: "var(--muted-text-color, #6b7280)" };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold" style={valueStyle}>
          Records
        </h2>

        {loadingUniversities ? (
          <Spinner />
        ) : (
          <Select
            value={selectedUniversity ?? ""}
            onChange={(e) => setSelectedUniversity(Number(e.target.value))}
            className="w-64"
          >
            {universities.map((univ) => (
              <option key={univ.universityId} value={univ.universityId}>
                {univ.universityName}
              </option>
            ))}
          </Select>
        )}
      </div>

      {/* Themed Card */}
      <div className={cardClass}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <School2 size={24} />
          </div>
          <h3 className="text-sm font-semibold" style={labelStyle}>
            {universities.find((u) => u.universityId === selectedUniversity)?.universityName || "—"}
          </h3>
        </div>

        {/* Value */}
        <div className="mt-4">
          <p className="text-sm font-medium" style={descStyle}>
            Active Courses
          </p>
          <p className="text-4xl font-bold mt-1" style={valueStyle}>
            {loadingCourses ? "…" : courseCount}
          </p>
        </div>

        {/* Divider */}
        <hr className="my-4" style={{ borderColor: "var(--divider-color)" }} />

        {/* Button */}
        <div className="flex justify-end">
          <Button
            style={{
              backgroundColor: "var(--button-color)",
              color: "white",
              fontWeight: 600,
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              minWidth: "100px",
            }}
            onClick={handleViewClick}
            disabled={!selectedUniversity}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
